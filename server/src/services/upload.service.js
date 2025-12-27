// server/src/services/upload.service.js - VERSION 2
const { Song, Artist, ChordSheet, User, Genre } = require('../models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

class UploadService {
    /**
     * Search songs for autocomplete
     * Returns songs with basic info for selection
     */
    async searchSongsForUpload(query, limit = 10) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const songs = await Song.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${query.trim()}%`
                },
                is_deleted: false
            },
            include: [
                {
                    model: Artist,
                    as: 'artists',
                    attributes: ['artist_id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: Genre,
                    as: 'genre',
                    attributes: ['genre_id', 'name']
                }
            ],
            limit,
            order: [['title', 'ASC']]
        });

        return songs.map(song => ({
            song_id: song.song_id,
            title: song.title,
            artists: song.artists.map(a => ({
                artist_id: a.artist_id,
                name: a.name
            })),
            genre: song.genre ? {
                genre_id: song.genre.genre_id,
                name: song.genre.name
            } : null
        }));
    }

    /**
     * Get all available genres for dropdown
     */
    async getAllGenres() {
        const genres = await Genre.findAll({
            attributes: ['genre_id', 'name'],
            order: [['name', 'ASC']]
        });
        return genres;
    }

    /**
     * Upload chord sheet for a song
     * Supports both existing song and new song creation
     */
    async uploadChordSheet(data) {
        const {
            // For existing song
            song_id,
            // For new song
            songname,
            author,
            genre_id,
            // Chord sheet data
            key,
            content,
            uploader_id
        } = data;

        const transaction = await sequelize.transaction();

        try {
            let song;

            // ===== CASE 1: Song ID provided (user selected existing song) =====
            if (song_id) {
                song = await Song.findOne({
                    where: {
                        song_id,
                        is_deleted: false
                    },
                    include: [
                        {
                            model: Artist,
                            as: 'artists',
                            through: { attributes: [] }
                        },
                        {
                            model: Genre,
                            as: 'genre'
                        }
                    ],
                    transaction
                });

                if (!song) {
                    throw new Error('Selected song not found');
                }

                console.log(`✅ Using existing song: "${song.title}" (ID: ${song.song_id})`);
            }
            // ===== CASE 2: Create new song =====
            else {
                // Validate required fields for new song
                if (!songname || !author) {
                    throw new Error('Song name and artist are required for new songs');
                }

                console.log(`📝 Creating new song: "${songname}"`);

                // Create or find artist
                const artist = await this.findOrCreateArtist(author.trim(), transaction);
                
                // Create song
                song = await Song.create({
                    title: songname.trim(),
                    genre_id: genre_id || null,
                    duration_sec: null
                }, { transaction });

                // Link song to artist
                await song.addArtist(artist, { transaction });

                // Reload with associations
                song = await Song.findByPk(song.song_id, {
                    include: [
                        {
                            model: Artist,
                            as: 'artists',
                            through: { attributes: [] }
                        },
                        {
                            model: Genre,
                            as: 'genre'
                        }
                    ],
                    transaction
                });

                console.log(`✅ Created new song: "${song.title}" (ID: ${song.song_id})`);
            }

            // ===== Validate uploader =====
            if (uploader_id) {
                const uploader = await User.findByPk(uploader_id);
                if (!uploader || uploader.is_deleted) {
                    throw new Error('Uploader not found');
                }
            }

            // ===== Create chord sheet =====
            const chordSheet = await ChordSheet.create({
                song_id: song.song_id,
                uploader_id: uploader_id || null,
                content: content.trim(),
                original_key: key ? key.trim().toUpperCase() : null,
                status: 'pending',
                ai_generated: false,
                is_canonical: false
            }, { transaction });

            console.log(`✅ Created chord sheet (ID: ${chordSheet.chord_sheet_id})`);

            // Commit transaction
            await transaction.commit();

            // Return full details
            return await this.getChordSheetDetails(chordSheet.chord_sheet_id);

        } catch (error) {
            await transaction.rollback();
            console.error('❌ Upload failed:', error);
            throw error;
        }
    }

    /**
     * Find or create artist
     */
    async findOrCreateArtist(artistName, transaction) {
        let artist = await Artist.findOne({
            where: {
                name: { [Op.iLike]: artistName },
                is_deleted: false
            },
            transaction
        });

        if (!artist) {
            artist = await Artist.create({
                name: artistName
            }, { transaction });
            
            console.log(`✅ Created new artist: "${artist.name}" (ID: ${artist.artist_id})`);
        } else {
            console.log(`✅ Found existing artist: "${artist.name}" (ID: ${artist.artist_id})`);
        }

        return artist;
    }

    /**
     * Get full chord sheet details
     */
    async getChordSheetDetails(chord_sheet_id) {
        const chordSheet = await ChordSheet.findByPk(chord_sheet_id, {
            include: [
                {
                    model: Song,
                    as: 'song',
                    include: [
                        {
                            model: Artist,
                            as: 'artists',
                            through: { attributes: [] }
                        },
                        {
                            model: Genre,
                            as: 'genre'
                        }
                    ]
                },
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['user_id', 'display_name', 'email']
                }
            ]
        });

        return chordSheet;
    }

    /**
     * Get all chord sheets by uploader
     */
    async getChordSheetsByUploader(uploader_id, options = {}) {
        const {
            page = 1,
            limit = 20,
            status = null
        } = options;

        const offset = (page - 1) * limit;

        const where = {
            uploader_id,
            is_deleted: false
        };

        if (status) {
            where.status = status;
        }

        const { count, rows } = await ChordSheet.findAndCountAll({
            where,
            include: [
                {
                    model: Song,
                    as: 'song',
                    include: [
                        {
                            model: Artist,
                            as: 'artists',
                            through: { attributes: [] }
                        },
                        {
                            model: Genre,
                            as: 'genre'
                        }
                    ]
                }
            ],
            offset,
            limit,
            order: [['created_at', 'DESC']]
        });

        return {
            chord_sheets: rows,
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    /**
     * Update chord sheet
     */
    async updateChordSheet(chord_sheet_id, uploader_id, updates) {
        const chordSheet = await ChordSheet.findOne({
            where: {
                chord_sheet_id,
                uploader_id,
                is_deleted: false
            }
        });

        if (!chordSheet) {
            throw new Error('Chord sheet not found or you do not have permission');
        }

        if (chordSheet.status !== 'pending') {
            throw new Error('Cannot update chord sheet after approval/rejection');
        }

        const allowedFields = ['content', 'original_key'];
        const updateData = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                updateData[field] = updates[field];
            }
        });

        await chordSheet.update(updateData);

        return await this.getChordSheetDetails(chord_sheet_id);
    }

    /**
     * Delete chord sheet
     */
    async deleteChordSheet(chord_sheet_id, uploader_id) {
        const chordSheet = await ChordSheet.findOne({
            where: {
                chord_sheet_id,
                uploader_id,
                is_deleted: false
            }
        });

        if (!chordSheet) {
            throw new Error('Chord sheet not found or you do not have permission');
        }

        await chordSheet.update({
            is_deleted: true,
            deleted_at: new Date()
        });

        return { message: 'Chord sheet deleted successfully' };
    }

    // ===== ADMIN FUNCTIONS =====

    async getPendingChordSheets(options = {}) {
        const { page = 1, limit = 20 } = options;
        const offset = (page - 1) * limit;

        const { count, rows } = await ChordSheet.findAndCountAll({
            where: {
                status: 'pending',
                is_deleted: false
            },
            include: [
                {
                    model: Song,
                    as: 'song',
                    include: [
                        {
                            model: Artist,
                            as: 'artists',
                            through: { attributes: [] }
                        }
                    ]
                },
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['user_id', 'display_name', 'email']
                }
            ],
            offset,
            limit,
            order: [['created_at', 'ASC']]
        });

        return {
            chord_sheets: rows,
            pagination: {
                page,
                limit,
                total: count,
                total_pages: Math.ceil(count / limit)
            }
        };
    }

    async moderateChordSheet(chord_sheet_id, admin_id, action) {
        if (!['approve', 'reject'].includes(action)) {
            throw new Error('Invalid action');
        }

        const chordSheet = await ChordSheet.findOne({
            where: {
                chord_sheet_id,
                is_deleted: false
            }
        });

        if (!chordSheet) {
            throw new Error('Chord sheet not found');
        }

        await chordSheet.update({
            status: action === 'approve' ? 'approved' : 'rejected',
            approved_by: admin_id,
            approved_at: new Date()
        });

        return await this.getChordSheetDetails(chord_sheet_id);
    }
}

module.exports = new UploadService();