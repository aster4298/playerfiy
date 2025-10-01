I'll create a complete "Playerfy" web application that allows users to play their local music files. This will be a modern, feature-rich music player with a beautiful interface.

## Project Structure

```
playerfy/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── icons/
│   └── images/
└── README.md
```

## HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playerfy - Your Personal Music Player</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">
                <i class="fas fa-music"></i>
                <h1>Playerfy</h1>
            </div>
            <div class="header-controls">
                <button class="btn-header" id="upload-btn">
                    <i class="fas fa-upload"></i>
                    Add Music
                </button>
                <button class="btn-header" id="theme-toggle">
                    <i class="fas fa-moon"></i>
                </button>
                <button class="btn-header" id="volume-btn">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-section">
                <h3>
                    <i class="fas fa-home"></i>
                    Library
                </h3>
                <ul class="sidebar-menu">
                    <li class="menu-item active" data-view="all">
                        <i class="fas fa-music"></i>
                        All Songs
                        <span class="count" id="total-songs">0</span>
                    </li>
                    <li class="menu-item" data-view="recently-added">
                        <i class="fas fa-clock"></i>
                        Recently Added
                    </li>
                    <li class="menu-item" data-view="favorites">
                        <i class="fas fa-heart"></i>
                        Favorites
                        <span class="count" id="favorites-count">0</span>
                    </li>
                    <li class="menu-item" data-view="most-played">
                        <i class="fas fa-fire"></i>
                        Most Played
                    </li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>
                    <i class="fas fa-list"></i>
                    Playlists
                </h3>
                <ul class="playlist-menu" id="playlist-menu">
                    <li class="create-playlist" id="create-playlist">
                        <i class="fas fa-plus"></i>
                        Create Playlist
                    </li>
                </ul>
            </div>

            <!-- Volume Control -->
            <div class="volume-control">
                <div class="volume-slider-container">
                    <i class="fas fa-volume-down"></i>
                    <input type="range" id="volume-slider" min="0" max="100" value="70" class="volume-slider">
                    <i class="fas fa-volume-up"></i>
                </div>
                <div class="volume-percentage">70%</div>
            </div>
        </aside>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Upload Zone -->
            <div class="upload-zone" id="upload-zone">
                <div class="upload-content">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h2>Drop your music files here</h2>
                    <p>Or click to browse and select files</p>
                    <div class="supported-formats">
                        Supports: MP3, WAV, OGG, M4A, FLAC
                    </div>
                    <input type="file" id="file-input" multiple accept="audio/*" style="display: none;">
                </div>
            </div>

            <!-- Music Library -->
            <div class="music-library" id="music-library" style="display: none;">
                <!-- Search Bar -->
                <div class="search-container">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="search-input" placeholder="Search songs, artists, albums...">
                        <button class="search-clear" id="search-clear" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="library-controls">
                        <button class="btn-control" id="shuffle-all">
                            <i class="fas fa-random"></i>
                            Shuffle All
                        </button>
                        <button class="btn-control" id="sort-btn">
                            <i class="fas fa-sort"></i>
                            Sort
                        </button>
                        <select id="sort-select" class="sort-select">
                            <option value="title">Title</option>
                            <option value="artist">Artist</option>
                            <option value="album">Album</option>
                            <option value="duration">Duration</option>
                            <option value="date-added">Date Added</option>
                        </select>
                    </div>
                </div>

                <!-- Song List -->
                <div class="song-list-container">
                    <div class="song-list-header">
                        <div class="header-col title">Title</div>
                        <div class="header-col artist">Artist</div>
                        <div class="header-col album">Album</div>
                        <div class="header-col duration">Duration</div>
                        <div class="header-col actions">Actions</div>
                    </div>
                    <div class="song-list" id="song-list">
                        <!-- Songs will be populated here -->
                    </div>
                </div>
            </div>

            <!-- Currently Playing View -->
            <div class="now-playing-full" id="now-playing-full" style="display: none;">
                <div class="now-playing-header">
                    <button class="btn-back" id="close-now-playing">
                        <i class="fas fa-chevron-down"></i>
                        <span>Back to Library</span>
                    </button>
                    <div class="now-playing-title">Now Playing</div>
                    <button class="btn-header" id="more-options">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                
                <div class="now-playing-content">
                    <div class="album-art-large">
                        <img id="current-album-art-large" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-size='40' font-family='Arial'%3E♪%3C/text%3E%3C/svg%3E" alt="Album Art">
                        <div class="art-overlay">
                            <button class="play-overlay" id="play-overlay-large">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="track-info-large">
                        <h2 id="current-title-large">Select a song to play</h2>
                        <p id="current-artist-large">Unknown Artist</p>
                        <p id="current-album-large">Unknown Album</p>
                    </div>
                    
                    <div class="track-actions">
                        <button class="action-btn" id="add-to-favorites-large">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn" id="add-to-playlist-large">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="action-btn" id="share-track">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Music Player -->
    <div class="music-player" id="music-player">
        <audio id="audio-player" preload="metadata"></audio>
        
        <div class="player-content">
            <!-- Track Info -->
            <div class="track-info">
                <div class="album-art">
                    <img id="current-album-art" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3E♪%3C/text%3E%3C/svg%3E" alt="Album Art">
                </div>
                <div class="track-details">
                    <div class="track-title" id="current-title">Select a song to play</div>
                    <div class="track-artist" id="current-artist">Unknown Artist</div>
                </div>
                <button class="btn-favorite" id="add-to-favorites">
                    <i class="fas fa-heart"></i>
                </button>
            </div>

            <!-- Player Controls -->
            <div class="player-controls">
                <div class="control-buttons">
                    <button class="control-btn" id="shuffle-btn">
                        <i class="fas fa-random"></i>
                    </button>
                    <button class="control-btn" id="prev-btn">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="control-btn main-control" id="play-pause-btn">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="control-btn" id="next-btn">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <button class="control-btn" id="repeat-btn">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
                
                <div class="progress-container">
                    <span class="time-current" id="current-time">0:00</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                            <div class="progress-handle" id="progress-handle"></div>
                        </div>
                    </div>
                    <span class="time-total" id="total-time">0:00</span>
                </div>
            </div>

            <!-- Additional Controls -->
            <div class="additional-controls">
                <button class="control-btn" id="queue-btn">
                    <i class="fas fa-list"></i>
                </button>
                <button class="control-btn" id="lyrics-btn">
                    <i class="fas fa-align-left"></i>
                </button>
                <div class="volume-control-mini">
                    <button class="control-btn" id="volume-btn-mini">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <button class="control-btn" id="expand-player">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Queue Sidebar -->
    <div class="queue-sidebar" id="queue-sidebar">
        <div class="queue-header">
            <h3>Queue</h3>
            <button class="btn-close" id="close-queue">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="queue-content">
            <div class="queue-tabs">
                <button class="queue-tab active" data-tab="up-next">Up Next</button>
                <button class="queue-tab" data-tab="history">History</button>
            </div>
            <div class="queue-list" id="queue-list">
                <!-- Queue items will be populated here -->
            </div>
        </div>
    </div>

    <!-- Context Menu -->
    <div class="context-menu" id="context-menu">
        <div class="context-item" data-action="play">
            <i class="fas fa-play"></i>
            Play
        </div>
        <div class="context-item" data-action="add-to-queue">
            <i class="fas fa-plus"></i>
            Add to Queue
        </div>
        <div class="context-item" data-action="add-to-favorites">
            <i class="fas fa-heart"></i>
            Add to Favorites
        </div>
        <div class="context-item" data-action="add-to-playlist">
            <i class="fas fa-list"></i>
            Add to Playlist
        </div>
        <hr class="context-divider">
        <div class="context-item" data-action="show-info">
            <i class="fas fa-info-circle"></i>
            Song Info
        </div>
        <div class="context-item" data-action="remove">
            <i class="fas fa-trash"></i>
            Remove from Library
        </div>
    </div>

    <!-- Modals -->
    <div class="modal-overlay" id="modal-overlay">
        <!-- Playlist Creation Modal -->
        <div class="modal" id="playlist-modal">
            <div class="modal-header">
                <h3>Create New Playlist</h3>
                <button class="btn-close" id="close-playlist-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <input type="text" id="playlist-name" placeholder="Playlist name" maxlength="50">
                <textarea id="playlist-description" placeholder="Description (optional)" maxlength="200"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="cancel-playlist">Cancel</button>
                <button class="btn-primary" id="create-playlist-btn">Create</button>
            </div>
        </div>

        <!-- Song Info Modal -->
        <div class="modal" id="song-info-modal">
            <div class="modal-header">
                <h3>Song Information</h3>
                <button class="btn-close" id="close-info-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="info-grid" id="song-info-content">
                    <!-- Song info will be populated here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Notification Toast -->
    <div class="toast-container" id="toast-container">
        <!-- Toasts will be added here dynamically -->
    </div>

    <script src="script.js"></script>
</body>
</html>
```

## CSS Styles (styles.css)

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Light theme colors */
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --background-color: #ffffff;
    --surface-color: #f8fafc;
    --card-color: #ffffff;
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
    --text-muted: #a0aec0;
    --border-color: #e2e8f0;
    --hover-color: #f7fafc;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.1);
    
    /* Player specific */
    --player-height: 90px;
    --sidebar-width: 280px;
    --header-height: 70px;
}

[data-theme="dark"] {
    --background-color: #0d1117;
    --surface-color: #161b22;
    --card-color: #21262d;
    --text-primary: #f0f6fc;
    --text-secondary: #8b949e;
    --text-muted: #6e7681;
    --border-color: #30363d;
    --hover-color: #262c36;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.3);
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background-color);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    transition: all 0.3s ease;
}

/* Header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 2rem;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo i {
    font-size: 1.8rem;
    color: var(--primary-color);
}

.logo h1 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.btn-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.btn-header:hover {
    background: var(--hover-color);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

/* Main Content */
.main-content {
    display: flex;
    margin-top: var(--header-height);
    margin-bottom: var(--player-height);
    min-height: calc(100vh - var(--header-height) - var(--player-height));
}

/* Sidebar */
.sidebar {
    width: var(--sidebar-width);
    background-color: var(--surface-color);
    border-right: 1px solid var(--border-color);
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.sidebar-section h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.sidebar-menu, .playlist-menu {
    list-style: none;
}

.menu-item, .create-playlist {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 0.25rem;
}

.menu-item:hover, .create-playlist:hover {
    background-color: var(--hover-color);
}

.menu-item.active {
    background-color: var(--primary-color);
    color: white;
}

.menu-item i, .create-playlist i {
    margin-right: 0.75rem;
    font-size: 0.9rem;
}

.count {
    background-color: var(--text-muted);
    color: var(--background-color);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.menu-item.active .count {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

/* Volume Control */
.volume-control {
    margin-top: auto;
    padding: 1rem;
    background-color: var(--card-color);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
}

.volume-slider-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.volume-slider {
    flex: 1;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
}

.volume-percentage {
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* Content Area */
.content-area {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

/* Upload Zone */
.upload-zone {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    border: 2px dashed var(--border-color);
    border-radius: 1rem;
    background-color: var(--card-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-zone:hover {
    border-color: var(--primary-color);
    background-color: var(--hover-color);
}

.upload-zone.drag-over {
    border-color: var(--primary-color);
    background-color: var(--hover-color);
    transform: scale(1.02);
}

.upload-content {
    text-align: center;
    padding: 3rem;
}

.upload-content i {
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
}

.upload-content h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.upload-content p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.supported-formats {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-style: italic;
}

/* Music Library */
.search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
}

.search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
}

.search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}

.search-box input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--card-color);
    color: var(--text-primary);
    font-size: 0.95rem;
    outline: none;
    transition: all 0.2s ease;
}

.search-box input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-clear {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
}

.library-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.btn-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.btn-control:hover {
    background: var(--hover-color);
    border-color: var(--primary-color);
}

.sort-select {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--card-color);
    color: var(--text-primary);
    cursor: pointer;
}

/* Song List */
.song-list-container {
    background-color: var(--card-color);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.song-list-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 100px 100px;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: var(--hover-color);
    border-bottom: 1px solid var(--border-color);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
}

.song-list {
    max-height: 60vh;
    overflow-y: auto;
}

.song-item {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 100px 100px;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.2s ease;
    align-items: center;
}

.song-item:hover {
    background-color: var(--hover-color);
}

.song-item.playing {
    background-color: rgba(102, 126, 234, 0.1);
    border-left: 3px solid var(--primary-color);
}

.song-title {
    font-weight: 500;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.play-indicator {
    color: var(--primary-color);
    font-size: 0.9rem;
}

.song-artist, .song-album {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.song-duration {
    color: var(--text-muted);
    font-size: 0.85rem;
    text-align: right;
}

.song-actions {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.song-item:hover .song-actions {
    opacity: 1;
}

.action-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.action-btn:hover {
    color: var(--primary-color);
    background-color: rgba(102, 126, 234, 0.1);
}

.action-btn.active {
    color: var(--primary-color);
}

/* Now Playing Full View */
.now-playing-full {
    padding: 2rem;
    text-align: center;
}

.now-playing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
}

.btn-back {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.9rem;
    transition: color 0.2s ease;
}

.btn-back:hover {
    color: var(--primary-color);
}

.now-playing-title {
    font-size: 1.2rem;
    font-weight: 600;
}

.now-playing-content {
    max-width: 500px;
    margin: 0 auto;
}

.album-art-large {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto 2rem;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
}

.album-art-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.art-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.album-art-large:hover .art-overlay {
    opacity: 1;
}

.play-overlay {
    background: var(--primary-color);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.play-overlay:hover {
    transform: scale(1.1);
}

.track-info-large {
    margin-bottom: 2rem;
}

.track-info-large h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.track-info-large p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.track-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.track-actions .action-btn {
    background: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.2s ease;
}

.track-actions .action-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
}

/* Music Player */
.music-player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--player-height);
    background-color: var(--surface-color);
    border-top: 1px solid var(--border-color);
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.player-content {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    height: 100%;
    padding: 0 1.5rem;
    align-items: center;
}

/* Track Info in Player */
.track-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
}

.album-art {
    width: 56px;
    height: 56px;
    border-radius: 0.5rem;
    overflow: hidden;
    flex-shrink: 0;
}

.album-art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.track-details {
    min-width: 0;
    flex: 1;
}

.track-title {
    font-weight: 500;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-artist {
    color: var(--text-secondary);
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.btn-favorite {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.btn-favorite:hover,
.btn-favorite.active {
    color: var(--primary-color);
}

/* Player Controls */
.player-controls {
    text-align: center;
}

.control-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.control-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    color: var(--primary-color);
    background-color: rgba(102, 126, 234, 0.1);
}

.control-btn.active {
    color: var(--primary-color);
}

.main-control {
    background-color: var(--primary-color);
    color: white;
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
}

.main-control:hover {
    background-color: var(--secondary-color);
    color: white;
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-muted);
}

.progress-bar-container {
    flex: 1;
    position: relative;
    height: 4px;
    background-color: var(--border-color);
    border-radius: 2px;
    cursor: pointer;
}

.progress-fill {
    height: 100%;
    background-color: var(--primary-color);
    border-radius: 2px;
    transition: width 0.1s ease;
}

.progress-handle {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background-color: var(--primary-color);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.progress-bar-container:hover .progress-handle {
    opacity: 1;
}

/* Additional Controls */
.additional-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
}

.volume-control-mini {
    position: relative;
}

/* Queue Sidebar */
.queue-sidebar {
    position: fixed;
    right: -350px;
    top: var(--header-height);
    width: 350px;
    height: calc(100vh - var(--header-height) - var(--player-height));
    background-color: var(--surface-color);
    border-left: 1px solid var(--border-color);
    transition: right 0.3s ease;
    z-index: 999;
}

.queue-sidebar.open {
    right: 0;
}

.queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.queue-header h3 {
    font-size: 1.2rem;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.btn-close:hover {
    color: var(--text-primary);
    background-color: var(--hover-color);
}

.queue-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
}

.queue-tab {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.queue-tab.active {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
}

.queue-list {
    padding: 1rem;
    max-height: calc(100% - 120px);
    overflow-y: auto;
}

.queue-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-bottom: 0.5rem;
}

.queue-item:hover {
    background-color: var(--hover-color);
}

.queue-item.playing {
    background-color: rgba(102, 126, 234, 0.1);
}

.queue-album-art {
    width: 40px;
    height: 40px;
    border-radius: 0.25rem;
    overflow: hidden;
    flex-shrink: 0;
}

.queue-album-art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.queue-track-info {
    flex: 1;
    min-width: 0;
}

.queue-track-title {
    font-weight: 500;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.queue-track-artist {
    color: var(--text-secondary);
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Context Menu */
.context-menu {
    position: fixed;
    background-color: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    box-shadow: var(--shadow-lg);
    z-index: 2000;
    min-width: 200px;
    display: none;
}

.context-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 0.9rem;
}

.context-item:hover {
    background-color: var(--hover-color);
}

.context-divider {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 0.5rem 0;
}

/* Modals */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    backdrop-filter: blur(4px);
}

.modal-overlay.active {
    display: flex;
}

.modal {
    background-color: var(--card-color);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-lg);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
}

.modal-body {
    padding: 1.5rem;
}

.modal-body input,
.modal-body textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--surface-color);
    color: var(--text-primary);
    font-size: 0.95rem;
    margin-bottom: 1rem;
    resize: vertical;
}

.modal-body input:focus,
.modal-body textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.btn-primary,
.btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: var(--secondary-color);
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--hover-color);
    color: var(--text-primary);
}

.info-grid {
    display: grid;
    gap: 1rem;
}

.info-item {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
    align-items: center;
}

.info-label {
    font-weight: 500;
    color: var(--text-secondary);
}

.info-value {
    color: var(--text-primary);
}

/* Toast Notifications */
.toast-container {
    position: fixed;
    top: var(--header-height);
    right: 1rem;
    z-index: 4000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
}

.toast {
    background-color: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 300px;
    animation: slideInRight 0.3s ease;
    pointer-events: auto;
}

.toast.success {
    border-left: 4px solid #10b981;
}

.toast.error {
    border-left: 4px solid #ef4444;
}

.toast.info {
    border-left: 4px solid var(--primary-color);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsive Design */
@media (max-width: 1024px) {
    :root {
        --sidebar-width: 250px;
    }
    
    .sidebar {
        width: var(--sidebar-width);
        padding: 1.5rem 0.75rem;
    }
    
    .content-area {
        padding: 1.5rem;
    }
}

@media (max-width: 768px) {
    :root {
        --sidebar-width: 60px;
        --player-height: 80px;
    }
    
    .sidebar {
        padding: 1rem 0.5rem;
        overflow-x: hidden;
    }
    
    .sidebar-section h3,
    .menu-item span:not(.count),
    .create-playlist span,
    .volume-control {
        display: none;
    }
    
    .menu-item,
    .create-playlist {
        justify-content: center;
    }
    
    .menu-item i,
    .create-playlist i {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .content-area {
        padding: 1rem;
    }
    
    .player-content {
        grid-template-columns: 1fr auto;
        gap: 1rem;
    }
    
    .additional-controls {
        display: none;
    }
    
    .track-info {
        min-width: 0;
    }
    
    .control-buttons {
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .progress-container {
        font-size: 0.75rem;
        gap: 0.5rem;
    }
    
    .song-list-header,
    .song-item {
        grid-template-columns: 2fr 1fr auto;
        gap: 0.5rem;
        padding: 1rem;
    }
    
    .song-list-header .artist,
    .song-list-header .album,
    .song-item .song-artist,
    .song-item .song-album {
        display: none;
    }
    
    .header-content {
        padding: 0 1rem;
    }
    
    .logo h1 {
        display: none;
    }
    
    .search-container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .library-controls {
        width: 100%;
        justify-content: space-between;
    }
}

@media (max-width: 480px) {
    .upload-content {
        padding: 2rem 1rem;
    }
    
    .upload-content h2 {
        font-size: 1.4rem;
    }
    
    .upload-content i {
        font-size: 3rem;
    }
    
    .album-art-large {
        width: 250px;
        height: 250px;
    }
    
    .track-info-large h2 {
        font-size: 1.5rem;
    }
    
    .queue-sidebar {
        width: 100%;
        right: -100%;
    }
    
    .modal {
        width: 95%;
        margin: 1rem;
    }
}

/* Loading Animations */
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--surface-color);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}

/* Focus Styles */
button:focus-visible,
input:focus-visible,
select:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    :root {
        --border-color: #000000;
        --text-muted: #666666;
    }
    
    [data-theme="dark"] {
        --border-color: #ffffff;
        --text-muted: #cccccc;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## JavaScript Functionality (script.js)

```javascript
class Playerfy {
    constructor() {
        this.songs = [];
        this.currentSong = null;
        this.currentIndex = -1;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 0; // 0: off, 1: all, 2: one
        this.queue = [];
        this.history = [];
        this.favorites = JSON.parse(localStorage.getItem('playerfy-favorites') || '[]');
        this.playlists = JSON.parse(localStorage.getItem('playerfy-playlists') || '[]');
        this.currentView = 'all';
        this.searchQuery = '';
        this.sortBy = 'title';
        this.isDarkTheme = localStorage.getItem('playerfy-theme') === 'dark';
        
        this.audioPlayer = document.getElementById('audio-player');
        this.progressBar = document.getElementById('progress-bar');
        this.progressFill = document.getElementById('progress-fill');
        this.progressHandle = document.getElementById('progress-handle');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.updateUI();
        this.applyTheme();
        this.setupAudioEvents();
        this.setupKeyboardShortcuts();
    }
    
    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('file-input');
        const uploadZone = document.getElementById('upload-zone');
        const uploadBtn = document.getElementById('upload-btn');
        
        uploadBtn.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));
        
        // Drag and drop
        uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadZone.addEventListener('drop', this.handleDrop.bind(this));
        uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        
        // Player controls
        document.getElementById('play-pause-btn').addEventListener('click', this.togglePlayPause.bind(this));
        document.getElementById('next-btn').addEventListener('click', this.nextTrack.bind(this));
        document.getElementById('prev-btn').addEventListener('click', this.previousTrack.bind(this));
        document.getElementById('shuffle-btn').addEventListener('click', this.toggleShuffle.bind(this));
        document.getElementById('repeat-btn').addEventListener('click', this.toggleRepeat.bind(this));
        
        // Progress bar
        this.progressBar.addEventListener('click', this.handleProgressClick.bind(this));
        this.progressBar.addEventListener('mousedown', this.handleProgressMouseDown.bind(this));
        
        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Search
        document.getElementById('search-input').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('search-clear').addEventListener('click', this.clearSearch.bind(this));
        
        // Sort
        document.getElementById('sort-select').addEventListener('change', (e) => this.setSortBy(e.target.value));
        document.getElementById('shuffle-all').addEventListener('click', this.shuffleAll.bind(this));
        
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', this.toggleTheme.bind(this));
        
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => this.setView(item.dataset.view));
        });
        
        // Queue
        document.getElementById('queue-btn').addEventListener('click', this.toggleQueue.bind(this));
        document.getElementById('close-queue').addEventListener('click', this.closeQueue.bind(this));
        
        // Favorites
        document.getElementById('add-to-favorites').addEventListener('click', this.toggleFavorite.bind(this));
        document.getElementById('add-to-favorites-large').addEventListener('click', this.toggleFavorite.bind(this));
        
        // Full screen player
        document.getElementById('expand-player').addEventListener('click', this.showFullPlayer.bind(this));
        document.getElementById('close-now-playing').addEventListener('click', this.hideFullPlayer.bind(this));
        
        // Playlist creation
        document.getElementById('create-playlist').addEventListener('click', this.showPlaylistModal.bind(this));
        document.getElementById('create-playlist-btn').addEventListener('click', this.createPlaylist.bind(this));
        document.getElementById('cancel-playlist').addEventListener('click', this.hidePlaylistModal.bind(this));
        document.getElementById('close-playlist-modal').addEventListener('click', this.hidePlaylistModal.bind(this));
        
        // Modal overlay
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideAllModals();
            }
        });
        
        // Context menu
        document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        document.addEventListener('click', this.hideContextMenu.bind(this));
    }
    
    setupAudioEvents() {
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            document.getElementById('total-time').textContent = this.formatTime(this.audioPlayer.duration);
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            if (!this.isDragging) {
                const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
                this.progressFill.style.width = progress + '%';
                this.progressHandle.style.left = progress + '%';
                document.getElementById('current-time').textContent = this.formatTime(this.audioPlayer.currentTime);
            }
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.handleTrackEnd();
        });
        
        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showToast('Error playing audio file', 'error');
        });
        
        this.audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButtonState();
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButtonState();
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.nextTrack();
                    }
                    break;
                case 'ArrowLeft':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.previousTrack();
                    }
                    break;
                case 'ArrowUp':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.increaseVolume();
                    }
                    break;
                case 'ArrowDown':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.decreaseVolume();
                    }
                    break;
                case 'KeyS':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleShuffle();
                    }
                    break;
                case 'KeyR':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleRepeat();
                    }
                    break;
                case 'KeyF':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('search-input').focus();
                    }
                    break;
            }
        });
    }
    
    async handleFileUpload(files) {
        const supportedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/flac', 'audio/mpeg'];
        const newSongs = [];
        
        for (const file of files) {
            if (supportedTypes.some(type => file.type.startsWith('audio/')) || 
                file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
                
                try {
                    const songData = await this.extractMetadata(file);
                    newSongs.push(songData);
                } catch (error) {
                    console.error('Error processing file:', file.name, error);
                    this.showToast(`Error processing ${file.name}`, 'error');
                }
            }
        }
        
        if (newSongs.length > 0) {
            this.songs.push(...newSongs);
            this.saveSongs();
            this.updateUI();
            this.showLibrary();
            this.showToast(`Added ${newSongs.length} song(s) to library`, 'success');
        } else {
            this.showToast('No valid audio files found', 'error');
        }
    }
    
    async extractMetadata(file) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const url = URL.createObjectURL(file);
            
            audio.addEventListener('loadedmetadata', () => {
                const song = {
                    id: this.generateId(),
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    artist: 'Unknown Artist',
                    album: 'Unknown Album',
                    duration: audio.duration,
                    file: file,
                    url: url,
                    dateAdded: new Date().toISOString(),
                    playCount: 0,
                    albumArt: null
                };
                
                // Try to extract metadata using Web Audio API or ID3 tags
                this.tryExtractAdvancedMetadata(file, song).then(() => {
                    resolve(song);
                }).catch(() => {
                    resolve(song); // Resolve with basic metadata if advanced fails
                });
            });
            
            audio.addEventListener('error', () => {
                URL.revokeObjectURL(url);
                reject(new Error('Could not load audio file'));
            });
            
            audio.src = url;
        });
    }
    
    async tryExtractAdvancedMetadata(file, song) {
        // This is a simplified version - in a real app, you'd use a library like jsmediatags
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                // Basic ID3 tag parsing would go here
                // For now, we'll just use the filename
            };
            reader.readAsArrayBuffer(file.slice(0, 1024)); // Read first 1KB for metadata
        } catch (error) {
            console.warn('Could not extract advanced metadata:', error);
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.handleFileUpload(files);
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Audio playback methods
    async playSong(song) {
        if (this.currentSong === song && !this.audioPlayer.paused) {
            return;
        }
        
        this.currentSong = song;
        this.currentIndex = this.songs.findIndex(s => s.id === song.id);
        
        try {
            this.audioPlayer.src = song.url;
            await this.audioPlayer.play();
            
            // Update play count
            song.playCount = (song.playCount || 0) + 1;
            this.saveSongs();
            
            // Add to history
            this.addToHistory(song);
            
            // Update UI
            this.updateCurrentSongDisplay();
            this.updatePlayingState();
            
        } catch (error) {
            console.error('Error playing song:', error);
            this.showToast('Error playing song', 'error');
        }
    }
    
    togglePlayPause() {
        if (!this.currentSong) {
            if (this.songs.length > 0) {
                this.playSong(this.songs[0]);
            }
            return;
        }
        
        if (this.audioPlayer.paused) {
            this.audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
                this.showToast('Error playing audio', 'error');
            });
        } else {
            this.audioPlayer.pause();
        }
    }
    
    nextTrack() {
        if (this.songs.length === 0) return;
        
        let nextIndex;
        
        if (this.queue.length > 0) {
            const nextSong = this.queue.shift();
            this.playSong(nextSong);
            this.updateQueueDisplay();
            return;
        }
        
        if (this.isShuffle) {
            nextIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            nextIndex = (this.currentIndex + 1) % this.songs.length;
        }
        
        this.playSong(this.songs[nextIndex]);
    }
    
    previousTrack() {
        if (this.songs.length === 0) return;
        
        // If we're more than 3 seconds into the song, restart it
        if (this.audioPlayer.currentTime > 3) {
            this.audioPlayer.currentTime = 0;
            return;
        }
        
        let prevIndex;
        
        if (this.isShuffle) {
            prevIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            prevIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        }
        
        this.playSong(this.songs[prevIndex]);
    }
    
    handleTrackEnd() {
        switch (this.repeatMode) {
            case 2: // Repeat one
                this.audioPlayer.currentTime = 0;
                this.audioPlayer.play();
                break;
            case 1: // Repeat all
                this.nextTrack();
                break;
            default: // No repeat
                if (this.queue.length > 0 || 
                    (this.isShuffle) || 
                    (this.currentIndex < this.songs.length - 1)) {
                    this.nextTrack();
                } else {
                    this.isPlaying = false;
                    this.updatePlayButtonState();
                }
                break;
        }
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        document.getElementById('shuffle-btn').classList.toggle('active', this.isShuffle);
        this.showToast(`Shuffle ${this.isShuffle ? 'on' : 'off'}`, 'info');
    }
    
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        const repeatBtn = document.getElementById('repeat-btn');
        const icon = repeatBtn.querySelector('i');
        
        repeatBtn.classList.remove('active');
        icon.className = 'fas fa-redo';
        
        switch (this.repeatMode) {
            case 1: // Repeat all
                repeatBtn.classList.add('active');
                this.showToast('Repeat all', 'info');
                break;
            case 2: // Repeat one
                repeatBtn.classList.add('active');
                icon.className = 'fas fa-redo-alt';
                this.showToast('Repeat one', 'info');
                break;
            default:
                this.showToast('Repeat off', 'info');
                break;
        }
    }
    
    setVolume(value) {
        this.audioPlayer.volume = value / 100;
        document.querySelector('.volume-percentage').textContent = `${value}%`;
        
        // Update volume icon
        const volumeIcon = document.querySelector('#volume-btn-mini i');
        if (value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (value < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
        
        localStorage.setItem('playerfy-volume', value);
    }
    
    increaseVolume() {
        const current = this.audioPlayer.volume * 100;
        const newVolume = Math.min(100, current + 10);
        this.setVolume(newVolume);
        document.getElementById('volume-slider').value = newVolume;
    }
    
    decreaseVolume() {
        const current = this.audioPlayer.volume * 100;
        const newVolume = Math.max(0, current - 10);
        this.setVolume(newVolume);
        document.getElementById('volume-slider').value = newVolume;
    }
    
    // Progress bar methods
    handleProgressClick(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.seekTo(percent);
    }
    
    handleProgressMouseDown(e) {
        this.isDragging = true;
        document.addEventListener('mousemove', this.handleProgressMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleProgressMouseUp.bind(this));
    }
    
    handleProgressMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        
        this.progressFill.style.width = percent * 100 + '%';
        this.progressHandle.style.left = percent * 100 + '%';
        
        if (this.audioPlayer.duration) {
            document.getElementById('current-time').textContent = 
                this.formatTime(this.audioPlayer.duration * percent);
        }
    }
    
    handleProgressMouseUp(e) {
        if (!this.isDragging) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekTo(percent);
        
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleProgressMouseMove.bind(this));
        document.removeEventListener('mouseup', this.handleProgressMouseUp.bind(this));
    }
    
    seekTo(percent) {
        if (this.audioPlayer.duration) {
            this.audioPlayer.currentTime = this.audioPlayer.duration * percent;
        }
    }
    
    // UI update methods
    updateCurrentSongDisplay() {
        if (!this.currentSong) {
            document.getElementById('current-title').textContent = 'Select a song to play';
            document.getElementById('current-artist').textContent = 'Unknown Artist';
            document.getElementById('current-title-large').textContent = 'Select a song to play';
            document.getElementById('current-artist-large').textContent = 'Unknown Artist';
            document.getElementById('current-album-large').textContent = 'Unknown Album';
            return;
        }
        
        const song = this.currentSong;
        document.getElementById('current-title').textContent = song.title;
        document.getElementById('current-artist').textContent = song.artist;
        document.getElementById('current-title-large').textContent = song.title;
        document.getElementById('current-artist-large').textContent = song.artist;
        document.getElementById('current-album-large').textContent = song.album;
        
        // Update album art
        if (song.albumArt) {
            document.getElementById('current-album-art').src = song.albumArt;
            document.getElementById('current-album-art-large').src = song.albumArt;
        }
        
        // Update page title
        document.title = `${song.title} - ${song.artist} | Playerfy`;
    }
    
    updatePlayButtonState() {
        const playBtns = document.querySelectorAll('#play-pause-btn i, #play-overlay-large i');
        playBtns.forEach(icon => {
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        });
    }
    
    updatePlayingState() {
        // Update song list
        document.querySelectorAll('.song-item').forEach(item => {
            const songId = item.dataset.songId;
            item.classList.toggle('playing', songId === this.currentSong?.id);
            
            const playIndicator = item.querySelector('.play-indicator');
            if (songId === this.currentSong?.id) {
                playIndicator.innerHTML = this.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
                playIndicator.style.display = 'block';
            } else {
                playIndicator.style.display = 'none';
            }
        });
        
        // Update favorites button
        const isFavorite = this.favorites.includes(this.currentSong?.id);
        document.querySelectorAll('.btn-favorite, #add-to-favorites-large').forEach(btn => {
            btn.classList.toggle('active', isFavorite);
        });
    }
    
    updateUI() {
        this.updateSongList();
        this.updateCounts();
        this.updatePlayingState();
    }
    
    updateSongList() {
        const songList = document.getElementById('song-list');
        const filteredSongs = this.getFilteredSongs();
        
        if (filteredSongs.length === 0) {
            songList.innerHTML = '<div class="no-songs">No songs found</div>';
            return;
        }
        
        songList.innerHTML = filteredSongs.map(song => `
            <div class="song-item" data-song-id="${song.id}">
                <div class="song-title">
                    <div class="play-indicator" style="display: none;">
                        <i class="fas fa-play"></i>
                    </div>
                    ${song.title}
                </div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-album">${song.album}</div>
                <div class="song-duration">${this.formatTime(song.duration)}</div>
                <div class="song-actions">
                    <button class="action-btn play-btn" title="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="action-btn favorite-btn ${this.favorites.includes(song.id) ? 'active' : ''}" title="Add to favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn more-btn" title="More options">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to song items
        songList.querySelectorAll('.song-item').forEach(item => {
            const songId = item.dataset.songId;
            const song = this.songs.find(s => s.id === songId);
            
            item.addEventListener('dblclick', () => this.playSong(song));
            item.querySelector('.play-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSong(song);
            });
            
            item.querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSongFavorite(song.id);
            });
            
            item.querySelector('.more-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showContextMenu(e, song);
            });
        });
    }
    
    updateCounts() {
        document.getElementById('total-songs').textContent = this.songs.length;
        document.getElementById('favorites-count').textContent = this.favorites.length;
    }
    
    getFilteredSongs() {
        let filtered = [...this.songs];
        
        // Apply view filter
        switch (this.currentView) {
            case 'recently-added':
                filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 50);
                break;
            case 'favorites':
                filtered = filtered.filter(song => this.favorites.includes(song.id));
                break;
            case 'most-played':
                filtered = filtered.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
                break;
        }
        
        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(song =>
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query) ||
                song.album.toLowerCase().includes(query)
            );
        }
        
        // Apply sort
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'artist':
                    return a.artist.localeCompare(b.artist);
                case 'album':
                    return a.album.localeCompare(b.album);
                case 'duration':
                    return a.duration - b.duration;
                case 'date-added':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                default:
                    return 0;
            }
        });
        
        return filtered;
    }
    
    // Search and filter methods
    handleSearch(query) {
        this.searchQuery = query;
        this.updateSongList();
        
        const clearBtn = document.getElementById('search-clear');
        clearBtn.style.display = query ? 'block' : 'none';
    }
    
    clearSearch() {
        document.getElementById('search-input').value = '';
        this.handleSearch('');
    }
    
    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.updateSongList();
    }
    
    setView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
        
        this.updateSongList();
    }
    
    shuffleAll() {
        if (this.songs.length === 0) return;
        
        const shuffled = [...this.songs].sort(() => Math.random() - 0.5);
        this.playSong(shuffled[0]);
        this.queue = shuffled.slice(1);
        this.isShuffle = true;
        document.getElementById('shuffle-btn').classList.add('active');
        this.updateQueueDisplay();
        this.showToast('Shuffling all songs', 'info');
    }
    
    // Queue methods
    addToQueue(song) {
        this.queue.push(song);
        this.updateQueueDisplay();
        this.showToast(`Added "${song.title}" to queue`, 'info');
    }
    
    removeFromQueue(index) {
        this.queue.splice(index, 1);
        this.updateQueueDisplay();
    }
    
    addToHistory(song) {
        this.history = this.history.filter(s => s.id !== song.id);
        this.history.unshift(song);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        this.saveHistory();
    }
    
    toggleQueue() {
        const queueSidebar = document.getElementById('queue-sidebar');
        queueSidebar.classList.toggle('open');
        this.updateQueueDisplay();
    }
    
    closeQueue() {
        document.getElementById('queue-sidebar').classList.remove('open');
    }
    
    updateQueueDisplay() {
        const queueList = document.getElementById('queue-list');
        const activeTab = document.querySelector('.queue-tab.active').dataset.tab;
        
        let items = [];
        if (activeTab === 'up-next') {
            items = this.queue;
        } else {
            items = this.history;
        }
        
        if (items.length === 0) {
            queueList.innerHTML = '<div class="empty-queue">Nothing here yet</div>';
            return;
        }
        
        queueList.innerHTML = items.map((song, index) => `
            <div class="queue-item" data-song-id="${song.id}" data-index="${index}">
                <div class="queue-album-art">
                    <img src="${song.albumArt || this.getDefaultAlbumArt()}" alt="Album Art">
                </div>
                <div class="queue-track-info">
                    <div class="queue-track-title">${song.title}</div>
                    <div class="queue-track-artist">${song.artist}</div>
                </div>
                <button class="action-btn remove-from-queue" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        
        // Add event listeners
        queueList.querySelectorAll('.queue-item').forEach(item => {
            const songId = item.dataset.songId;
            const song = items.find(s => s.id === songId);
            
            item.addEventListener('click', () => {
                if (activeTab === 'up-next') {
                    const index = parseInt(item.dataset.index);
                    this.queue.splice(index, 1);
                    this.playSong(song);
                    this.updateQueueDisplay();
                } else {
                    this.playSong(song);
                }
            });
            
            const removeBtn = item.querySelector('.remove-from-queue');
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (activeTab === 'up-next') {
                        this.removeFromQueue(parseInt(item.dataset.index));
                    } else {
                        const index = this.history.findIndex(s => s.id === songId);
                        this.history.splice(index, 1);
                        this.saveHistory();
                        this.updateQueueDisplay();
                    }
                });
            }
        });
        
        // Queue tab switching
        document.querySelectorAll('.queue-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.queue-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.updateQueueDisplay();
            });
        });
    }
    
    // Favorites methods
    toggleFavorite() {
        if (!this.currentSong) return;
        this.toggleSongFavorite(this.currentSong.id);
    }
    
    toggleSongFavorite(songId) {
        const index = this.favorites.indexOf(songId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.favorites.push(songId);
            this.showToast('Added to favorites', 'info');
        }
        
        this.saveFavorites();
        this.updateUI();
    }
    
    // Playlist methods
    showPlaylistModal() {
        document.getElementById('modal-overlay').classList.add('active');
        document.getElementById('playlist-modal').style.display = 'block';
        document.getElementById('playlist-name').focus();
    }
    
    hidePlaylistModal() {
        document.getElementById('modal-overlay').classList.remove('active');
        document.getElementById('playlist-modal').style.display = 'none';
        document.getElementById('playlist-name').value = '';
        document.getElementById('playlist-description').value = '';
    }
    
    createPlaylist() {
        const name = document.getElementById('playlist-name').value.trim();
        if (!name) return;
        
        const playlist = {
            id: this.generateId(),
            name: name,
            description: document.getElementById('playlist-description').value.trim(),
            songs: [],
            dateCreated: new Date().toISOString()
        };
        
        this.playlists.push(playlist);
        this.savePlaylists();
        this.updatePlaylistsUI();
        this.hidePlaylistModal();
        this.showToast(`Playlist "${name}" created`, 'success');
    }
    
    updatePlaylistsUI() {
        const playlistMenu = document.getElementById('playlist-menu');
        const createBtn = playlistMenu.querySelector('.create-playlist');
        
        // Remove existing playlist items
        playlistMenu.querySelectorAll('.playlist-item').forEach(item => item.remove());
        
        // Add playlist items
        this.playlists.forEach(playlist => {
            const item = document.createElement('li');
            item.className = 'menu-item playlist-item';
            item.innerHTML = `
                <i class="fas fa-list"></i>
                ${playlist.name}
                <span class="count">${playlist.songs.length}</span>
            `;
            
            item.addEventListener('click', () => this.showPlaylist(playlist.id));
            playlistMenu.insertBefore(item, createBtn);
        });
    }
    
    // Context menu methods
    handleContextMenu(e) {
        const songItem = e.target.closest('.song-item');
        if (!songItem) {
            this.hideContextMenu();
            return;
        }
        
        e.preventDefault();
        const songId = songItem.dataset.songId;
        const song = this.songs.find(s => s.id === songId);
        this.showContextMenu(e, song);
    }
    
    showContextMenu(e, song) {
        const menu = document.getElementById('context-menu');
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        
        // Update menu items based on song
        menu.querySelectorAll('.context-item').forEach(item => {
            item.onclick = () => this.handleContextAction(item.dataset.action, song);
        });
    }
    
    hideContextMenu() {
        document.getElementById('context-menu').style.display = 'none';
    }
    
   handleContextAction(action, song) {
    switch (action) {
        case 'play':
            this.playSong(song);
            break;
        case 'add-to-queue':
            this.addToQueue(song);
            break;
        case 'add-to-favorites':
            this.toggleSongFavorite(song.id);
            break;
        case 'add-to-playlist':
            this.showPlaylistModal(); // You can expand to allow adding to a specific playlist
            break;
        case 'show-info':
            this.showSongInfo(song);
            break;
        case 'remove':
            this.removeSong(song.id);
            break;
        default:
            break;
    }
    this.hideContextMenu();
}

showSongInfo(song) {
    const modalOverlay = document.getElementById('modal-overlay');
    const infoModal = document.getElementById('song-info-modal');
    document.getElementById('song-info-content').innerHTML = `
        <div class="info-item">
            <div class="info-label">Title</div>
            <div class="info-value">${song.title}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Artist</div>
            <div class="info-value">${song.artist}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Album</div>
            <div class="info-value">${song.album}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Duration</div>
            <div class="info-value">${this.formatTime(song.duration)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Date Added</div>
            <div class="info-value">${new Date(song.dateAdded).toLocaleString()}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Play Count</div>
            <div class="info-value">${song.playCount || 0}</div>
        </div>
        <div class="info-item">
            <div class="info-label">File Size</div>
            <div class="info-value">${this.formatFileSize(song.file.size)}</div>
        </div>
    `;
    modalOverlay.classList.add('active');
    infoModal.style.display = 'block';

    document.getElementById('close-info-modal').onclick = () => {
        modalOverlay.classList.remove('active');
        infoModal.style.display = 'none';
    };
}

removeSong(songId) {
    this.songs = this.songs.filter(song => song.id !== songId);
    this.saveSongs();
    this.updateUI();
    this.showToast('Song removed from library', 'info');
}

hideAllModals() {
    document.getElementById('playlist-modal').style.display = 'none';
    document.getElementById('song-info-modal').style.display = 'none';
    document.getElementById('modal-overlay').classList.remove('active');
}

showFullPlayer() {
    document.getElementById('now-playing-full').style.display = 'block';
}

hideFullPlayer() {
    document.getElementById('now-playing-full').style.display = 'none';
}

getDefaultAlbumArt() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3E♪%3C/text%3E%3C/svg%3E";
}

// LocalStorage persistence methods
saveSongs() {
    localStorage.setItem('playerfy-songs', JSON.stringify(this.songs));
}
saveFavorites() {
    localStorage.setItem('playerfy-favorites', JSON.stringify(this.favorites));
}
saveHistory() {
    localStorage.setItem('playerfy-history', JSON.stringify(this.history));
}
savePlaylists() {
    localStorage.setItem('playerfy-playlists', JSON.stringify(this.playlists));
}
loadSavedData() {
    // Songs are loaded as files, so only persistent metadata can remain
    const songMeta = JSON.parse(localStorage.getItem('playerfy-songs') || '[]');
    this.songs = songMeta.map(meta => ({
        ...meta, file: null, url: null // Cannot restore actual file, only metadata
    }));
    this.favorites = JSON.parse(localStorage.getItem('playerfy-favorites') || '[]');
    this.playlists = JSON.parse(localStorage.getItem('playerfy-playlists') || '[]');
    this.history = JSON.parse(localStorage.getItem('playerfy-history') || '[]');
    this.updatePlaylistsUI();
}

applyTheme() {
    if (this.isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('playerfy-theme', this.isDarkTheme ? 'dark' : '');
    this.applyTheme();
}

showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.playerfy = new Playerfy();
});
