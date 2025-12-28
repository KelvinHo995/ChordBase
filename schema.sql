-- Optional extensions
CREATE EXTENSION IF NOT EXISTS citext;

--------------------------------------------------
-- USERS, ARTISTS, GENRES
--------------------------------------------------

CREATE TABLE users (
    user_id        BIGSERIAL PRIMARY KEY,
    email          CITEXT UNIQUE NOT NULL,
    password_hash  TEXT NOT NULL,
    display_name   VARCHAR(100) NOT NULL,
    bio            TEXT,
    role           VARCHAR(20) NOT NULL DEFAULT 'user', -- user/admin
    status         VARCHAR(20) NOT NULL DEFAULT 'active',
    preferences    JSONB,              -- default instrument, capo, scroll speed, ...
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at     TIMESTAMPTZ
);

CREATE TABLE password_resets (
    reset_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    reset_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE artists (
    artist_id   BIGSERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE genres (
    genre_id   BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------
-- SONGS, SONG–ARTISTS
--------------------------------------------------

CREATE TABLE songs (
    song_id     BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    genre_id    BIGINT REFERENCES genres(genre_id),
    duration_sec INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE song_artists (
    song_id   BIGINT NOT NULL REFERENCES songs(song_id),
    artist_id BIGINT NOT NULL REFERENCES artists(artist_id),
    PRIMARY KEY (song_id, artist_id)
);

--------------------------------------------------
-- CHORD SHEETS, AI GENERATIONS, RATINGS
--------------------------------------------------

CREATE TABLE chord_sheets (
    chord_sheet_id BIGSERIAL PRIMARY KEY,
    song_id        BIGINT NOT NULL REFERENCES songs(song_id),
    uploader_id    BIGINT REFERENCES users(user_id), -- NULL nếu AI
    content        TEXT NOT NULL,                    -- plain text + chord markers
    original_key   VARCHAR(20),
    status         VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending/approved/rejected
    is_canonical   BOOLEAN NOT NULL DEFAULT FALSE,
    ai_generated   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at    TIMESTAMPTZ,
    approved_by    BIGINT REFERENCES users(user_id),
    is_deleted     BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at     TIMESTAMPTZ
);

-- Lưu history các lần AI generate cho 1 song
CREATE TABLE ai_generations (
    ai_generation_id BIGSERIAL PRIMARY KEY,
    song_id          BIGINT NOT NULL REFERENCES songs(song_id),
    requested_by     BIGINT REFERENCES users(user_id),
    chord_sheet_id   BIGINT REFERENCES chord_sheets(chord_sheet_id),
    prompt           TEXT,
    model_name       VARCHAR(100),
    status           VARCHAR(20) NOT NULL DEFAULT 'success', -- success/failed
    metrics          JSONB, -- lưu thêm số chord đúng, confidence, ...
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ratings (
    rating_id      BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(user_id),
    chord_sheet_id BIGINT NOT NULL REFERENCES chord_sheets(chord_sheet_id),
    score          SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, chord_sheet_id)
);

--------------------------------------------------
-- COMMENTS (NESTED), FAVORITES, PLAYLISTS
--------------------------------------------------

CREATE TABLE comments (
    comment_id        BIGSERIAL PRIMARY KEY,
    chord_sheet_id    BIGINT NOT NULL REFERENCES chord_sheets(chord_sheet_id),
    user_id           BIGINT NOT NULL REFERENCES users(user_id),
    content           TEXT NOT NULL,
    parent_comment_id BIGINT REFERENCES comments(comment_id),
    depth             SMALLINT NOT NULL DEFAULT 0,
    thread_root_id    BIGINT, -- set bằng app hoặc trigger
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted        BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at        TIMESTAMPTZ
);

-- Optional: đảm bảo thread_root_id tham chiếu comments
ALTER TABLE comments
    ADD CONSTRAINT fk_comments_thread_root
    FOREIGN KEY (thread_root_id) REFERENCES comments(comment_id);

CREATE INDEX idx_comments_sheet_thread
    ON comments (chord_sheet_id, thread_root_id, created_at);

CREATE INDEX idx_comments_parent
    ON comments (parent_comment_id);

-- Playlists
CREATE TABLE playlists (
    playlist_id BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT NOT NULL REFERENCES users(user_id),
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    is_public   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_deleted  BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE playlist_songs (
    playlist_id BIGINT NOT NULL REFERENCES playlists(playlist_id),
    song_id     BIGINT NOT NULL REFERENCES songs(song_id),
    position    INTEGER,
    added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (playlist_id, song_id)
);

-- Favorites (song-level)
CREATE TABLE favorite_songs (
    user_id    BIGINT NOT NULL REFERENCES users(user_id),
    song_id    BIGINT NOT NULL REFERENCES songs(song_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);

--------------------------------------------------
-- FOLLOWS, NOTIFICATIONS
--------------------------------------------------

CREATE TABLE user_follows (
    follow_id        BIGSERIAL PRIMARY KEY,
    follower_id      BIGINT NOT NULL REFERENCES users(user_id),
    target_user_id   BIGINT REFERENCES users(user_id),
    target_artist_id BIGINT REFERENCES artists(artist_id),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        (target_user_id IS NOT NULL AND target_artist_id IS NULL) OR
        (target_user_id IS NULL AND target_artist_id IS NOT NULL)
    )
);

CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(user_id),
    type            VARCHAR(50) NOT NULL, -- e.g. NEW_UPLOAD, COMMENT_REPLY, MODERATION_UPDATE
    payload         JSONB,                -- chứa song_id, chord_sheet_id, v.v.
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------
-- ANALYTICS (VIEW HISTORY, USER ACTIVITY)
--------------------------------------------------

-- mỗi lần user mở trang chi tiết bài hát
CREATE TABLE song_views (
    song_view_id BIGSERIAL PRIMARY KEY,
    song_id      BIGINT NOT NULL REFERENCES songs(song_id),
    user_id      BIGINT REFERENCES users(user_id), -- NULL nếu guest
    viewed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source       VARCHAR(50)  -- search, playlist, recommendation, ...
);

-- log hành vi khác (transpose, auto-scroll, print, favorite, ...)
CREATE TABLE user_activity (
    activity_id   BIGSERIAL PRIMARY KEY,
    user_id       BIGINT REFERENCES users(user_id),
    song_id       BIGINT REFERENCES songs(song_id),
    chord_sheet_id BIGINT REFERENCES chord_sheets(chord_sheet_id),
    activity_type VARCHAR(50) NOT NULL, -- TRANSPOSE, AUTO_SCROLL_START, PRINT, FAVORITE_ADD, ...
    metadata      JSONB,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------
-- INDEX GỢI Ý CHO PERFORMANCE & SEARCH
--------------------------------------------------

-- chỉ số cho lookup theo bài hát còn active
CREATE INDEX idx_songs_not_deleted
    ON songs (title)
    WHERE is_deleted = FALSE;

CREATE INDEX idx_chords_song_not_deleted
    ON chord_sheets (song_id)
    WHERE is_deleted = FALSE;

CREATE INDEX idx_ratings_sheet
    ON ratings (chord_sheet_id);

CREATE INDEX idx_favorite_user
    ON favorite_songs (user_id);

CREATE INDEX idx_playlist_owner
    ON playlists (owner_id)
    WHERE is_deleted = FALSE;

CREATE INDEX idx_song_views_song_time
    ON song_views (song_id, viewed_at);

CREATE INDEX idx_user_activity_type_time
    ON user_activity (activity_type, created_at);
