-- Admin user
INSERT INTO users (email, password_hash, display_name, role, preferences)
VALUES 
(
    'admin@chordbase.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: admin123
    'Admin User',
    'admin',
    '{"default_instrument": "guitar", "default_capo": 0, "scroll_speed": 50}'::jsonb
);

-- Regular users
INSERT INTO users (email, password_hash, display_name, role, preferences)
VALUES 
(
    'john@example.com',
    '$2b$10$examplehash1',
    'John Doe',
    'user',
    '{"default_instrument": "ukulele", "default_capo": 2, "scroll_speed": 40}'::jsonb
),
(
    'jane@example.com',
    '$2b$10$examplehash2',
    'Jane Smith',
    'user',
    '{"default_instrument": "guitar", "default_capo": 0, "scroll_speed": 60}'::jsonb
);

-- Verify
SELECT user_id, email, display_name, role FROM users;
SELECT * FROM users
INSERT INTO genres (name)
VALUES 
    ('Rock'),
    ('Pop'),
    ('Folk'),
    ('Blues'),
    ('Country'),
    ('Jazz');

-- Verify
SELECT * FROM genres;

INSERT INTO artists (name)
VALUES 
    ('The Beatles'),
    ('Ed Sheeran'),
    ('Taylor Swift'),
    ('Bob Dylan'),
    ('John Mayer');

-- Verify
SELECT * FROM artists;

-- Get genre IDs first
SELECT genre_id, name FROM genres;

-- Insert songs (giả sử Rock = 1, Pop = 2, Folk = 3)
INSERT INTO songs (title, genre_id, duration_sec)
VALUES 
    ('Let It Be', 1, 243),  -- Rock
    ('Shape of You', 2, 233),  -- Pop
    ('Thinking Out Loud', 2, 281),  -- Pop
    ('Blowin in the Wind', 3, 168);  -- Folk

-- Verify
SELECT song_id, title, genre_id FROM songs;

-----------------------------------------------------5.5 Link Songs to Artists
-- Get song and artist IDs
SELECT song_id, title FROM songs;
SELECT artist_id, name FROM artists;

-- Link songs (adjust IDs based on your inserts)
INSERT INTO song_artists (song_id, artist_id)
VALUES 
    (1, 1),  -- Let It Be - The Beatles
    (2, 2),  -- Shape of You - Ed Sheeran
    (3, 2),  -- Thinking Out Loud - Ed Sheeran
    (4, 4);  -- Blowin in the Wind - Bob Dylan

-- Verify with JOIN
SELECT s.title, a.name as artist
FROM songs s
JOIN song_artists sa ON s.song_id = sa.song_id
JOIN artists a ON sa.artist_id = a.artist_id;

------------------------------------------5.6 Insert Chord Sheets
-- User-uploaded chord sheet (pending approval)
INSERT INTO chord_sheets (song_id, uploader_id, content, original_key, status, ai_generated)
VALUES 
(
    1,  -- Let It Be
    2,  -- John Doe uploaded
    E'[C]When I find myself in [G]times of trouble
[Am]Mother Mary [F]comes to me
[C]Speaking words of [G]wisdom, let it [F]be [C]

[C]Let it [G]be, let it [Am]be, let it [F]be, let it [C]be
[G]Whisper words of [F]wisdom, let it [C]be',
    'C',
    'pending',
    false
);

-- AI-generated chord sheet (auto-approved)
INSERT INTO chord_sheets (song_id, uploader_id, content, original_key, status, ai_generated, is_canonical)
VALUES 
(
    2,  -- Shape of You
    NULL,  -- AI generated
    E'[Am]The club isn''t the best place to [F]find a lover
So the [C]bar is where I [G]go
[Am]Me and my friends at the [F]table doing shots
[C]Drinking fast and then we [G]talk slow',
    'Am',
    'approved',
    true,
    true
);

-- Another version from different user
INSERT INTO chord_sheets (song_id, uploader_id, content, original_key, status, ai_generated)
VALUES 
(
    2,  -- Shape of You (alternative version)
    3,  -- Jane Smith
    E'[Dm]The club isn''t the best place to [Bb]find a lover
So the [F]bar is where I [C]go',
    'Dm',
    'approved',
    false
);

-- Verify
SELECT cs.chord_sheet_id, s.title, u.display_name as uploader, 
       cs.original_key, cs.status, cs.ai_generated, cs.is_canonical
FROM chord_sheets cs
JOIN songs s ON cs.song_id = s.song_id
LEFT JOIN users u ON cs.uploader_id = u.user_id;

-----------------------------------------------------5.8 Insert Ratings
-- Users rate chord sheets
INSERT INTO ratings (user_id, chord_sheet_id, score)
VALUES 
    (2, 2, 5),  -- John rates AI version 5 stars
    (3, 2, 4),  -- Jane rates AI version 4 stars
    (2, 3, 3);  -- John rates Jane's version 3 stars

-- Calculate average rating per chord sheet
SELECT cs.chord_sheet_id, s.title, cs.original_key,
       COUNT(r.rating_id) as total_ratings,
       ROUND(AVG(r.score), 2) as avg_rating
FROM chord_sheets cs
JOIN songs s ON cs.song_id = s.song_id
LEFT JOIN ratings r ON cs.chord_sheet_id = r.chord_sheet_id
GROUP BY cs.chord_sheet_id, s.title, cs.original_key;



-------------------------------------------------- 5.9 Insert Comments
-- Top-level comments
INSERT INTO comments (chord_sheet_id, user_id, content, depth, thread_root_id)
VALUES 
(
    2,  -- Shape of You AI version
    2,  -- John
    'Great chord sheet! Very accurate.',
    0,
    NULL
);

-- Get the comment_id for reply
SELECT comment_id FROM comments WHERE content LIKE 'Great chord sheet%';
-- Assume it's comment_id = 1

-- Reply to John's comment
INSERT INTO comments (chord_sheet_id, user_id, content, parent_comment_id, depth, thread_root_id)
VALUES 
(
    2,
    3,  -- Jane
    'I agree! Much better than the manual versions.',
    1,  -- Parent is John's comment
    1,  -- Depth 1 (first level reply)
    1   -- Thread root is comment 1
);

-- Verify with nested structure
SELECT 
    c.comment_id,
    c.depth,
    u.display_name,
    c.content,
    c.parent_comment_id
FROM comments c
JOIN users u ON c.user_id = u.user_id
ORDER BY c.thread_root_id, c.depth, c.created_at;

------------------------------------------------------ 5.10 Insert Favorites & Playlists
-- Favorite songs
INSERT INTO favorite_songs (user_id, song_id)
VALUES 
    (2, 1),  -- John favorites Let It Be
    (2, 2),  -- John favorites Shape of You
    (3, 2);  -- Jane favorites Shape of You

-- Create playlists
INSERT INTO playlists (owner_id, name, description, is_public)
VALUES 
    (2, 'My Favorites', 'Songs I love to play', true),
    (3, 'Practice List', 'Songs for guitar practice', false);

-- Add songs to playlists
INSERT INTO playlist_songs (playlist_id, song_id, position)
VALUES 
    (1, 1, 1),  -- Let It Be in John's playlist, position 1
    (1, 2, 2),  -- Shape of You in John's playlist, position 2
    (2, 2, 1);  -- Shape of You in Jane's playlist

-- Verify playlists with songs
SELECT 
    p.name as playlist_name,
    u.display_name as owner,
    s.title as song_title,
    ps.position
FROM playlists p
JOIN users u ON p.owner_id = u.user_id
JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
JOIN songs s ON ps.song_id = s.song_id
ORDER BY p.playlist_id, ps.position;

-------------------------------------------------- 5.11 Insert Follows
-- Users follow artists
INSERT INTO user_follows (follower_id, target_user_id, target_artist_id)
VALUES 
    (2, NULL, 2),  -- John follows Ed Sheeran
    (3, NULL, 1),  -- Jane follows The Beatles
    (3, 2, NULL);  -- Jane follows John (user)

-- Verify follows
SELECT 
    u1.display_name as follower,
    COALESCE(u2.display_name, a.name) as following,
    CASE 
        WHEN uf.target_user_id IS NOT NULL THEN 'user'
        ELSE 'artist'
    END as follow_type
FROM user_follows uf
JOIN users u1 ON uf.follower_id = u1.user_id
LEFT JOIN users u2 ON uf.target_user_id = u2.user_id
LEFT JOIN artists a ON uf.target_artist_id = a.artist_id;


------------------------------------------------ 5.12 Insert Notifications
-- Create notifications
INSERT INTO notifications (user_id, type, payload, is_read)
VALUES 
(
    2,  -- For John
    'NEW_UPLOAD',
    '{"song_id": 2, "chord_sheet_id": 2, "message": "New chord sheet for Shape of You"}'::jsonb,
    false
),
(
    3,  -- For Jane
    'COMMENT_REPLY',
    '{"comment_id": 2, "reply_by": "John Doe", "song_title": "Shape of You"}'::jsonb,
    false
);

-- Verify notifications
SELECT 
    u.display_name,
    n.type,
    n.payload,
    n.is_read,
    n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.user_id
ORDER BY n.created_at DESC;


-------------------------------------------------- 5.13 Insert Analytics Data
-- Song views
INSERT INTO song_views (song_id, user_id, source)
VALUES 
    (1, 2, 'search'),
    (2, 2, 'search'),
    (2, 3, 'recommendation'),
    (1, NULL, 'search');  -- Guest view

-- User activities
INSERT INTO user_activity (user_id, song_id, chord_sheet_id, activity_type, metadata)
VALUES 
(
    2,
    2,
    2,
    'TRANSPOSE',
    '{"from_key": "Am", "to_key": "Cm", "semitones": 3}'::jsonb
),
(
    2,
    2,
    2,
    'AUTO_SCROLL_START',
    '{"scroll_speed": 45}'::jsonb
),
(
    3,
    1,
    1,
    'PRINT',
    '{"format": "pdf"}'::jsonb
);

-- Verify analytics
SELECT 
    u.display_name,
    s.title,
    ua.activity_type,
    ua.metadata,
    ua.created_at
FROM user_activity ua
LEFT JOIN users u ON ua.user_id = u.user_id
LEFT JOIN songs s ON ua.song_id = s.song_id
ORDER BY ua.created_at DESC;

--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------
-- Thêm GIN index cho full-text search trên songs title
CREATE INDEX idx_songs_title_fulltext 
ON songs USING gin(to_tsvector('english', title));

-- Thêm GIN index cho chord content search
CREATE INDEX idx_chord_content_fulltext 
ON chord_sheets USING gin(to_tsvector('english', content));

-- Thêm trigram index cho fuzzy search (yêu cầu pg_trgm extension)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_songs_title_trgm 
ON songs USING gin(title gin_trgm_ops);

CREATE INDEX idx_artists_name_trgm 
ON artists USING gin(name gin_trgm_ops);

--------------------------------------Bước 6: Useful Test Queries
------------- 6.1 Search Songs by Title (Full-Text)
SELECT s.song_id, s.title, a.name as artist
FROM songs s
JOIN song_artists sa ON s.song_id = sa.song_id
JOIN artists a ON sa.artist_id = a.artist_id
WHERE to_tsvector('english', s.title) @@ plainto_tsquery('english', 'shape')
  AND s.is_deleted = false;

--------------- 6.2 Get Song with All Versions
SELECT 
    s.title,
    cs.chord_sheet_id,
    cs.original_key,
    COALESCE(u.display_name, 'AI Generated') as uploader,
    cs.status,
    cs.is_canonical,
    COUNT(r.rating_id) as total_ratings,
    ROUND(AVG(r.score), 2) as avg_rating
FROM songs s
JOIN chord_sheets cs ON s.song_id = cs.song_id
LEFT JOIN users u ON cs.uploader_id = u.user_id
LEFT JOIN ratings r ON cs.chord_sheet_id = r.chord_sheet_id
WHERE s.song_id = 2  -- Shape of You
  AND cs.is_deleted = false
GROUP BY s.title, cs.chord_sheet_id, cs.original_key, u.display_name, 
         cs.status, cs.is_canonical
ORDER BY cs.is_canonical DESC, avg_rating DESC NULLS LAST;

----------------------------------------- 6.3 Admin Dashboard - Pending Approvals
SELECT 
    cs.chord_sheet_id,
    s.title as song_title,
    a.name as artist_name,
    u.display_name as uploader,
    cs.original_key,
    cs.created_at
FROM chord_sheets cs
JOIN songs s ON cs.song_id = s.song_id
JOIN song_artists sa ON s.song_id = sa.song_id
JOIN artists a ON sa.artist_id = a.artist_id
JOIN users u ON cs.uploader_id = u.user_id
WHERE cs.status = 'pending'
  AND cs.is_deleted = false
ORDER BY cs.created_at ASC;


------------------------------------ 6.4 Popular Songs (Most Viewed)
SELECT 
    s.song_id,
    s.title,
    STRING_AGG(DISTINCT a.name, ', ') as artists,
    COUNT(DISTINCT sv.song_view_id) as total_views,
    COUNT(DISTINCT fs.user_id) as total_favorites
FROM songs s
JOIN song_artists sa ON s.song_id = sa.song_id
JOIN artists a ON sa.artist_id = a.artist_id
LEFT JOIN song_views sv ON s.song_id = sv.song_id
LEFT JOIN favorite_songs fs ON s.song_id = fs.song_id
WHERE s.is_deleted = false
GROUP BY s.song_id, s.title
ORDER BY total_views DESC, total_favorites DESC
LIMIT 10;

----------------------------------------- 6.5 User's Activity Summary
SELECT 
    u.display_name,
    COUNT(DISTINCT cs.chord_sheet_id) as sheets_uploaded,
    COUNT(DISTINCT r.rating_id) as ratings_given,
    COUNT(DISTINCT c.comment_id) as comments_made,
    COUNT(DISTINCT fs.song_id) as songs_favorited
FROM users u
LEFT JOIN chord_sheets cs ON u.user_id = cs.uploader_id AND cs.is_deleted = false
LEFT JOIN ratings r ON u.user_id = r.user_id
LEFT JOIN comments c ON u.user_id = c.user_id AND c.is_deleted = false
LEFT JOIN favorite_songs fs ON u.user_id = fs.user_id
WHERE u.user_id = 2  -- John
GROUP BY u.user_id, u.display_name;

-------------------------------------------6.6 Find Songs by Chord Progression
-- Find songs with C -> Am -> F -> G progression
SELECT DISTINCT 
    s.song_id,
    s.title,
    cs.original_key,
    cs.chord_sheet_id
FROM chord_sheets cs
JOIN songs s ON cs.song_id = s.song_id
WHERE cs.content LIKE '%[C]%[Am]%[F]%[G]%'
  AND cs.status = 'approved'
  AND cs.is_deleted = false;


---------------------------------Check Table Sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;