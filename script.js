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
                this
