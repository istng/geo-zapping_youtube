// YouTube video management
class YouTubeManager {
    constructor(videoContainerId) {
        this.videoContainer = document.getElementById(videoContainerId);
        this.currentVideoIndex = 0;
        this.currentPlayer = null;
        
        // List of videos with their IDs and timestamps
        this.videos = [
            {
                id: '8G9mEwdp8Vs',
                si: '7Q-V3wKojDNA6wkL',
                timestamp: 0
            },
            {
                id: 'T0kTiKCC3UI',
                si: 'someParam1',
                timestamp: 0
            },
            {
                id: 'jyAnVNn1fm8',
                si: 'someParam3',
                timestamp: 0
            }
        ];
        
        // Initialize YouTube API
        this.loadYouTubeAPI();
        
        // Set up keyboard controls
        this.setupKeyboardControls();
        
        // Set up add video dialog
        this.setupAddVideoDialog();
    }
    
    // Load the YouTube IFrame API
    loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // Replace any existing content with a div for the YouTube player
        this.videoContainer.innerHTML = '<div id="youtube-player"></div>';
        
        // Define the callback for when the API is ready
        window.onYouTubeIframeAPIReady = () => this.createYouTubePlayer();
    }
    
    // Create the YouTube player
    createYouTubePlayer() {
        const video = this.videos[this.currentVideoIndex];
        this.currentPlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: video.id,
            playerVars: {
                'autoplay': 1,
                'controls': 1,
                'start': Math.floor(video.timestamp),
                'loop': 1,
                'playlist': video.id
            },
            events: {
                'onStateChange': (event) => this.onPlayerStateChange(event)
            }
        });
    }
    
    // Save timestamp when video state changes
    onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING || 
            event.data == YT.PlayerState.PAUSED) {
            this.videos[this.currentVideoIndex].timestamp = this.currentPlayer.getCurrentTime();
        }
    }
    
    // Change to a specific video
    changeVideo(index) {
        // Save current timestamp before changing
        if (this.currentPlayer && this.currentPlayer.getCurrentTime) {
            this.videos[this.currentVideoIndex].timestamp = this.currentPlayer.getCurrentTime();
        }
        
        this.currentVideoIndex = index;
        const video = this.videos[this.currentVideoIndex];
        
        if (this.currentPlayer && this.currentPlayer.loadVideoById) {
            this.currentPlayer.loadVideoById({
                videoId: video.id,
                startSeconds: video.timestamp
            });
        }
    }
    
    // Go to previous video
    previousVideo() {
        const newIndex = (this.currentVideoIndex - 1 + this.videos.length) % this.videos.length;
        this.changeVideo(newIndex);
    }
    
    // Go to next video
    nextVideo() {
        const newIndex = (this.currentVideoIndex + 1) % this.videos.length;
        this.changeVideo(newIndex);
    }
    
    // Set up keyboard controls for video navigation
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                this.previousVideo();
            } else if (event.key === 'ArrowDown') {
                this.nextVideo();
            }
        });
    }
    
    // Set up the add video dialog
    setupAddVideoDialog() {
        const addButton = document.getElementById('add-video-button');
        const dialog = document.getElementById('video-dialog');
        const urlsTextarea = document.getElementById('video-urls');
        const addUrlButton = document.getElementById('add-url-button');
        const cancelButton = document.getElementById('cancel-button');
        
        // Show dialog when add button is clicked
        addButton.addEventListener('click', () => {
            dialog.style.display = 'block';
            urlsTextarea.focus();
        });
        
        // Hide dialog when cancel is clicked
        cancelButton.addEventListener('click', () => {
            dialog.style.display = 'none';
            urlsTextarea.value = '';
        });
        
        // Add videos when add button in dialog is clicked
        addUrlButton.addEventListener('click', () => {
            this.processMultipleUrls(urlsTextarea.value);
            dialog.style.display = 'none';
            urlsTextarea.value = '';
        });
        
        // Also allow pressing Ctrl+Enter to add videos
        urlsTextarea.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && event.ctrlKey) {
                this.processMultipleUrls(urlsTextarea.value);
                dialog.style.display = 'none';
                urlsTextarea.value = '';
            }
        });
    }
    
    // Process multiple URLs from textarea
    processMultipleUrls(text) {
        // Split by newlines and filter out empty lines
        const urls = text.split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);
        
        if (urls.length === 0) return;
        
        let addedCount = 0;
        let lastAddedIndex = -1;
        
        // Process each URL
        urls.forEach(url => {
            const result = this.addVideoFromUrl(url, false); // Don't switch to video yet
            if (result.added) {
                addedCount++;
                lastAddedIndex = result.index;
            }
        });
        
        // Show summary notification
        if (addedCount > 0) {
            this.showNotification(`Added ${addedCount} new videos! (${this.videos.length} videos total)`);
            
            // Switch to the last added video
            if (lastAddedIndex >= 0) {
                this.changeVideo(lastAddedIndex);
            }
        } else {
            this.showNotification('No new videos were added.');
        }
    }
    
    // Extract video ID from YouTube URL
    extractVideoId(url) {
        // Handle different YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Add a new video from URL
    addVideoFromUrl(url, switchToVideo = true) {
        const videoId = this.extractVideoId(url);
        let result = { added: false, index: -1 };
        
        if (videoId) {
            // Check if video already exists in the list
            const exists = this.videos.some(video => video.id === videoId);
            
            if (!exists) {
                // Add new video to the list
                this.videos.push({
                    id: videoId,
                    si: 'userAdded',
                    timestamp: 0
                });
                
                result.added = true;
                result.index = this.videos.length - 1;
                
                // Show notification and switch if requested
                if (switchToVideo) {
                    this.showNotification(`Video added! (${this.videos.length} videos total)`);
                    this.changeVideo(result.index);
                }
            } else {
                // Find the index of the existing video
                const index = this.videos.findIndex(video => video.id === videoId);
                result.index = index;
                
                // Show notification and switch if requested
                if (switchToVideo) {
                    this.showNotification('Video already in list. Switching to it.');
                    this.changeVideo(index);
                }
            }
        } else if (switchToVideo) {
            this.showNotification('Invalid YouTube URL. Please try again.');
        }
        
        return result;
    }
    
    // Show a temporary notification
    showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('yt-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'yt-notification';
            notification.style.position = 'fixed';
            notification.style.top = '70px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            notification.style.color = 'white';
            notification.style.padding = '10px 15px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '5';
            notification.style.transition = 'opacity 0.5s';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }
} 