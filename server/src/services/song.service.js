// server/src/services/search.service.js
const { Song, Artist, Genre, ChordSheet, User, SongView } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/db');

class SongService {
    // ===== MAIN SEARCH FUNCTION =====
    async search(query, options = {}) {
        const {
            page = 1,
            limit = 20,
            search_type = 'all', // 'song', 'artist', 'genre', 'all'
            genre_id = null,
            sort_by = 'relevance', // 'relevance', 'popular', 'recent', 'title'
            include_deleted = false
        } = options;

        const offset = (page - 1) * limit;

        // Build where conditions
        const whereConditions = {
            is_deleted: include_deleted ? undefined : false
        };

        // Search by type
        let songs = [];
        let total = 0;

        switch (search_type) {
            case 'song':
                ({ songs, total } = await this.searchBySong(query, whereConditions, offset, limit, sort_by));
                break;
            case 'artist':
                ({ songs, total } = await this.searchByArtist(query, whereConditions, offset, limit, sort_by));
                break;
            case 'genre':
                ({ songs, total } = await this.searchByGenre(genre_id, whereConditions, offset, limit, sort_by));
                break;
            case 'all':
            default:
                ({ songs, total } = await this.searchAll(query, whereConditions, offset, limit, sort_by));
                break;
        }

        // Enrich songs with chord versions and stats
        const enrichedSongs = await Promise.all(
            songs.map(song => this.enrichSongData(song))
        );

        return {
            songs: enrichedSongs,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit)
            }
        };
    }

    // ===== SEARCH BY SONG TITLE =====
    async searchBySong(query, whereConditions, offset, limit, sort_by) {
        // Full-text search with PostgreSQL
        const searchCondition = query ? {
            [Op.or]: [
                literal(`to_tsvector('english', title) @@ plainto_tsquery('english', '${query}')`),
                { title: { [Op.iLike]: `%${query}%` } }
            ]
        } : {};

        const { count, rows } = await Song.findAndCountAll({
            where: {
                ...whereConditions,
                ...searchCondition
            },
            include: [
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] }
                }
            ],
            offset,
            limit,
            order: this.getOrderClause(sort_by),
            distinct: true
        });

        return { songs: rows, total: count };
    }

    // ===== SEARCH BY ARTIST NAME =====
    async searchByArtist(query, whereConditions, offset, limit, sort_by) {
        const { count, rows } = await Song.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] },
                    where: {
                        [Op.or]: [
                            literal(`to_tsvector('english', "artists"."name") @@ plainto_tsquery('english', '${query}')`),
                            { name: { [Op.iLike]: `%${query}%` } }
                        ]
                    },
                    required: true // INNER JOIN
                }
            ],
            offset,
            limit,
            order: this.getOrderClause(sort_by),
            distinct: true,
            subQuery: false
        });

        return { songs: rows, total: count };
    }

    // ===== SEARCH BY GENRE =====
    async searchByGenre(genre_id, whereConditions, offset, limit, sort_by) {
        if (!genre_id) {
            return { songs: [], total: 0 };
        }

        const { count, rows } = await Song.findAndCountAll({
            where: {
                ...whereConditions,
                genre_id
            },
            include: [
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] }
                }
            ],
            offset,
            limit,
            order: this.getOrderClause(sort_by),
            distinct: true
        });

        return { songs: rows, total: count };
    }

    // ===== SEARCH ALL (Song + Artist) =====
    async searchAll(query, whereConditions, offset, limit, sort_by) {
        const { count, rows } = await Song.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] },
                    where: query ? {
                        [Op.or]: [
                            literal(`to_tsvector('english', "artists"."name") @@ plainto_tsquery('english', '${query}')`),
                            { name: { [Op.iLike]: `%${query}%` } }
                        ]
                    } : undefined,
                    required: false // LEFT JOIN
                }
            ],
            where: query ? {
                ...whereConditions,
                [Op.or]: [
                    literal(`to_tsvector('english', "Song"."title") @@ plainto_tsquery('english', '${query}')`),
                    { title: { [Op.iLike]: `%${query}%` } }
                ]
            } : whereConditions,
            offset,
            limit,
            order: this.getOrderClause(sort_by),
            distinct: true,
            subQuery: false
        });

        return { songs: rows, total: count };
    }

    // ===== ENRICH SONG WITH CHORD VERSIONS & STATS =====
    async enrichSongData(song, includeFullContent = false) {
        const songData = song.toJSON();

        // Get all chord versions for this song
        const chordVersions = await ChordSheet.findAll({
            where: {
                song_id: song.song_id,
                status: 'approved',
                is_deleted: false
            },
            include: [
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['user_id', 'display_name']
                }
            ],
            order: [
                ['is_canonical', 'DESC'],
                ['created_at', 'DESC']
            ]
        });

        // Get ratings for each chord version
        const enrichedVersions = await Promise.all(
            chordVersions.map(async (version) => {
                const versionData = version.toJSON();
                
                // Get average rating
                const [ratingResult] = await sequelize.query(`
                    SELECT 
                        COUNT(rating_id) as count,
                        COALESCE(ROUND(AVG(score), 2), 0) as avg
                    FROM ratings
                    WHERE chord_sheet_id = :chord_sheet_id
                `, {
                    replacements: { chord_sheet_id: version.chord_sheet_id },
                    type: sequelize.QueryTypes.SELECT
                });

                const result = {
                    ...versionData,
                    rating: {
                        avg: parseFloat(ratingResult.avg) || 0,
                        count: parseInt(ratingResult.count) || 0
                    }
                };

                // For search results, don't include full content
                if (!includeFullContent) {
                    result.content = undefined;
                    result.content_preview = versionData.content.substring(0, 200) + '...';
                }

                return result;
            })
        );

        // Get stats
        const [statsResult] = await sequelize.query(`
            SELECT 
                COUNT(DISTINCT sv.song_view_id) as total_views,
                COUNT(DISTINCT fs.user_id) as total_favorites
            FROM songs s
            LEFT JOIN song_views sv ON s.song_id = sv.song_id
            LEFT JOIN favorite_songs fs ON s.song_id = fs.song_id
            WHERE s.song_id = :song_id
            GROUP BY s.song_id
        `, {
            replacements: { song_id: song.song_id },
            type: sequelize.QueryTypes.SELECT
        });

        return {
            ...songData,
            chord_versions: enrichedVersions,
            stats: {
                total_views: parseInt(statsResult?.total_views) || 0,
                total_favorites: parseInt(statsResult?.total_favorites) || 0,
                total_versions: enrichedVersions.length
            }
        };
    }

    // ===== GET SINGLE SONG WITH DETAILS =====
    async getSongById(song_id, user_id = null) {
        const song = await Song.findOne({
            where: {
                song_id,
                is_deleted: false
            },
            include: [
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: ChordSheet,
                    as: 'chord_sheets',
                    attributes: ['chord_sheet_id', 'content', 'is_canonical', 'created_at'],
                    include: [
                        {
                            model: User,
                            as: 'uploader',
                            attributes: ['user_id', 'display_name']
                        }
                    ]
                }
            ]
        });

        if (!song) {
            throw new Error('Song not found');
        }

        // Enrich with chord versions and stats
        const enrichedSong = await this.enrichSongData(song, true); // includeFullContent = true

        // Check if song is favorited by user
        let is_favorited = false;
        if (user_id) {
            const [favoriteResult] = await sequelize.query(`
                SELECT EXISTS(
                    SELECT 1 FROM favorite_songs
                    WHERE user_id = :user_id AND song_id = :song_id
                ) as is_favorited
            `, {
                replacements: { user_id, song_id },
                type: sequelize.QueryTypes.SELECT
            });
            is_favorited = favoriteResult.is_favorited;
        }

        return {
            ...enrichedSong,
            is_favorited
        };
    }

    // ===== SEARCH BY CHORD PROGRESSION =====
    async searchByChords(chords, options = {}) {
        const { page = 1, limit = 20 } = options;
        const offset = (page - 1) * limit;

        // Build chord search pattern
        const chordPattern = chords.join('%');

        const { count, rows } = await Song.findAndCountAll({
            where: {
                is_deleted: false
            },
            include: [
                {
                    model: ChordSheet,
                    as: 'chord_sheets',
                    where: {
                        content: { [Op.iLike]: `%${chordPattern}%` },
                        status: 'approved',
                        is_deleted: false
                    },
                    required: true
                },
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] }
                }
            ],
            offset,
            limit,
            distinct: true
        });

        // const enrichedSongs = await Promise.all(
        //     rows.map(song => this.enrichSongData(song))
        // );

        return {
            songs: rows,
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    // ===== HELPER: Get Order Clause =====
    getOrderClause(sort_by) {
        switch (sort_by) {
            case 'popular':
                return [[literal('(SELECT COUNT(*) FROM song_views WHERE song_views.song_id = Song.song_id)'), 'DESC']];
            case 'recent':
                return [['created_at', 'DESC']];
            case 'title':
                return [['title', 'ASC']];
            case 'relevance':
            default:
                return [['title', 'ASC']];
        }
    }

    // ===== GET POPULAR SONGS =====
    async getPopularSongs(limit = 10) {
        const songs = await Song.findAll({
            where: { is_deleted: false },
            include: [
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                },
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] }
                }
            ],
            order: [[literal('(SELECT COUNT(*) FROM song_views WHERE song_views.song_id = "Song"."song_id")'), 'DESC']],
            limit
        });

        return await Promise.all(songs.map(song => this.enrichSongData2(song)));
    }
}

module.exports = new SongService();