import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../CSS/Upload.css';

const AdminUpload = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [playlistLink, setPlaylistLink] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showPlaylistPreview, setShowPlaylistPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [playlistPreviewData, setPlaylistPreviewData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('single'); // 'single' or 'playlist'

  const navigate = useNavigate();
  const token = sessionStorage.getItem('admin_jwt');
  
  // YouTube API key
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
      return;
    }

    axios
      .get('https://ai.mfu.ac.th/strapi/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        sessionStorage.removeItem('admin_jwt');
        sessionStorage.removeItem('admin_user');
        navigate('/admin-login');
      });
  }, [navigate, token]);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractPlaylistId = (url) => {
    const regex = /[?&]list=([^#\&\?]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVideoPreview = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const videoData = data.items[0].snippet;
        return {
          title: videoData.title,
          thumbnail: videoData.thumbnails.high?.url || videoData.thumbnails.default?.url || `https://img.youtube.com/vi/${videoId}/0.jpg`,
          description: videoData.description,
          channelTitle: videoData.channelTitle,
          publishedAt: videoData.publishedAt
        };
      } else {
        return {
          title: 'Video not found or private',
          thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
          description: '',
          channelTitle: 'Unknown',
          publishedAt: ''
        };
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
      return {
        title: 'Error loading video data',
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        description: '',
        channelTitle: 'Unknown',
        publishedAt: ''
      };
    }
  };

  const getPlaylistPreview = async (playlistId) => {
    try {
      // Get playlist info
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`
      );
      const playlistData = await playlistResponse.json();

      if (!playlistData.items || playlistData.items.length === 0) {
        throw new Error('Playlist not found');
      }

      const playlist = playlistData.items[0].snippet;

      // Get playlist items (videos)
      const itemsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
      );
      const itemsData = await itemsResponse.json();

      const videos = itemsData.items?.map(item => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/0.jpg`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
      })) || [];

      return {
        playlistId,
        title: playlist.title,
        description: playlist.description,
        channelTitle: playlist.channelTitle,
        thumbnail: playlist.thumbnails?.high?.url || playlist.thumbnails?.default?.url,
        videoCount: videos.length,
        videos
      };
    } catch (error) {
      console.error('Error fetching playlist data:', error);
      throw error;
    }
  };

  const handlePrepareUpload = async () => {
    if (!videoLink.trim()) {
      alert('Please enter a YouTube link.');
      return;
    }

    const videoId = extractVideoId(videoLink);
    if (!videoId || videoId.length !== 11) {
      alert('Invalid YouTube link format.');
      return;
    }

    const preview = await getVideoPreview(videoId);
    setPreviewData({ videoId, url: videoLink, ...preview });
    setShowPreview(true);
  };

  const handlePreparePlaylistUpload = async () => {
    if (!playlistLink.trim()) {
      alert('Please enter a YouTube playlist link.');
      return;
    }

    const playlistId = extractPlaylistId(playlistLink);
    if (!playlistId) {
      alert('Invalid YouTube playlist link format.');
      return;
    }

    try {
      const playlistPreview = await getPlaylistPreview(playlistId);
      setPlaylistPreviewData(playlistPreview);
      setShowPlaylistPreview(true);
    } catch (error) {
      alert('Error loading playlist. Please check the link and try again.');
    }
  };

  const confirmUpload = async () => {
    setIsUploading(true);
    try {
      const response = await axios.post(
        'https://ai.mfu.ac.th/strapi/api/videos',
        {
          data: {
            videoId: previewData.videoId,
            url: previewData.url,
            title: previewData.title,
            thumbnail: previewData.thumbnail,
            channelTitle: previewData.channelTitle,
            publishedAt: previewData.publishedAt
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.data) {
        setVideos((prev) => [...prev, response.data.data]);
      }
      setVideoLink('');
      setShowPreview(false);
      setPreviewData(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading video.');
    } finally {
      setIsUploading(false);
    }
  };

  const confirmPlaylistUpload = async () => {
    setIsUploading(true);
    try {
      // First, try to create the playlist entry (this might fail if collection doesn't exist)
      let playlistResponse = null;
      try {
        playlistResponse = await axios.post(
          'https://ai.mfu.ac.th/strapi/api/playlists',
          {
            data: {
              playlistId: playlistPreviewData.playlistId,
              title: playlistPreviewData.title,
              description: playlistPreviewData.description,
              channelTitle: playlistPreviewData.channelTitle,
              thumbnail: playlistPreviewData.thumbnail,
              videoCount: playlistPreviewData.videoCount
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (playlistError) {
        console.warn('Could not create playlist entry:', playlistError);
      }

      // Upload all videos from the playlist
      const uploadPromises = playlistPreviewData.videos.map(async (video) => {
        return axios.post(
          'https://ai.mfu.ac.th/strapi/api/videos',
          {
            data: {
              videoId: video.videoId,
              url: video.url,
              title: video.title,
              thumbnail: video.thumbnail,
              channelTitle: video.channelTitle,
              publishedAt: video.publishedAt,
              playlistId: playlistPreviewData.playlistId,
              playlistTitle: playlistPreviewData.title
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      });

      const responses = await Promise.all(uploadPromises);
      const newVideos = responses.map(response => response.data.data).filter(Boolean);
      
      setVideos((prev) => [...prev, ...newVideos]);
      
      // Update playlists state if playlist was created successfully
      if (playlistResponse && playlistResponse.data.data) {
        setPlaylists((prev) => {
          const existingIndex = prev.findIndex(p => p.playlistId === playlistPreviewData.playlistId);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = playlistResponse.data.data;
            return updated;
          } else {
            return [...prev, playlistResponse.data.data];
          }
        });
      }
      
      setPlaylistLink('');
      setShowPlaylistPreview(false);
      setPlaylistPreviewData(null);
      
      alert(`Successfully uploaded ${newVideos.length} videos from the playlist!`);
    } catch (error) {
      console.error('Playlist upload error:', error);
      alert('Error uploading playlist. Some videos may have been uploaded successfully.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Fetch videos
      axios
        .get('https://ai.mfu.ac.th/strapi/api/videos', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setVideos(res.data.data || []))
        .catch((err) => console.error('Error fetching videos:', err));

      // Fetch playlists (with error handling if collection doesn't exist)
      axios
        .get('https://ai.mfu.ac.th/strapi/api/playlists', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Group playlists by channel and keep only one per channel
          const playlistsData = res.data.data || [];
          const uniqueByChannel = playlistsData.reduce((acc, playlist) => {
            const channelTitle = playlist.channelTitle;
            if (!acc[channelTitle]) {
              acc[channelTitle] = playlist;
            }
            return acc;
          }, {});
          setPlaylists(Object.values(uniqueByChannel));
        })
        .catch((err) => {
          console.warn('Playlists collection not found or no permissions. Creating playlists from existing videos...');
          // Fallback: Create playlist data from existing videos
          const videosWithPlaylists = videos.filter(v => v.playlistId && v.playlistTitle);
          const playlistMap = {};
          
          videosWithPlaylists.forEach(video => {
            if (!playlistMap[video.channelTitle]) {
              playlistMap[video.channelTitle] = {
                playlistId: video.playlistId,
                title: video.playlistTitle,
                channelTitle: video.channelTitle,
                thumbnail: video.thumbnail,
                videoCount: videosWithPlaylists.filter(v => v.playlistId === video.playlistId).length,
                description: `Playlist from ${video.channelTitle}`,
                documentId: `temp-${video.playlistId}` // Temporary ID for display
              };
            }
          });
          
          setPlaylists(Object.values(playlistMap));
        });
    }
  }, [token, videos]);

  const handlePlaylistClick = (playlistId) => {
    const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    window.open(playlistUrl, '_blank');
  };

  const handleDeleteByDocumentId = async (documentId) => {
    try {
      if (uploadMode === 'single') {
        // Delete video
        const searchRes = await axios.get(
          `https://ai.mfu.ac.th/strapi/api/videos?filters[documentId][$eq]=${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const videoData = searchRes.data.data[0];
        if (!videoData) {
          alert('Video not found.');
          return;
        }

        await axios.delete(`https://ai.mfu.ac.th/strapi/api/videos/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVideos((prev) => prev.filter((v) => v.documentId !== documentId));
      } else {
        // Delete playlist and all its videos
        const playlistToDelete = playlists.find(p => p.documentId === documentId);
        if (!playlistToDelete) {
          alert('Playlist not found.');
          return;
        }

        // Delete all videos from this playlist
        const videosInPlaylist = videos.filter(v => v.playlistId === playlistToDelete.playlistId);
        const deleteVideoPromises = videosInPlaylist.map(video => 
          axios.delete(`https://ai.mfu.ac.th/strapi/api/videos/${video.documentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        await Promise.all(deleteVideoPromises);

        // Try to delete the playlist (might fail if collection doesn't exist)
        try {
          await axios.delete(`https://ai.mfu.ac.th/strapi/api/playlists/${documentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (playlistDeleteError) {
          console.warn('Could not delete playlist entry:', playlistDeleteError);
        }

        setPlaylists((prev) => prev.filter((p) => p.documentId !== documentId));
        setVideos((prev) => prev.filter((v) => v.playlistId !== playlistToDelete.playlistId));
        
        alert(`Deleted playlist and ${videosInPlaylist.length} videos.`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete ${uploadMode === 'single' ? 'video' : 'playlist'}.`);
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Upload Manager...</p>
      </div>
    );
  }

  return (
    <div className="admin-upload-page">
      <div className="upload-section">
        <div className="section-header">
          <h2 className="section-title">Upload Video</h2>
        </div>
        
        {/* Upload Mode Selector */}
        <div className="upload-mode-selector">
          <button 
            className={`mode-button ${uploadMode === 'single' ? 'active' : ''}`}
            onClick={() => setUploadMode('single')}
          >
            <span className="mode-icon">🎥</span>
            Single Video
          </button>
          <button 
            className={`mode-button ${uploadMode === 'playlist' ? 'active' : ''}`}
            onClick={() => setUploadMode('playlist')}
          >
            <span className="mode-icon">📋</span>
            Playlist
          </button>
        </div>

        {/* Single Video Upload */}
        {uploadMode === 'single' && (
          <div className="upload-controls">
            <div className="input-group">
              <input
                type="text"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePrepareUpload()}
                placeholder="Enter YouTube video URL"
                className="url-input"
              />
              <button onClick={handlePrepareUpload} className="add-button">
                Add Video
              </button>
            </div>
          </div>
        )}

        {/* Playlist Upload */}
        {uploadMode === 'playlist' && (
          <div className="upload-controls">
            <div className="input-group">
              <input
                type="text"
                value={playlistLink}
                onChange={(e) => setPlaylistLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePreparePlaylistUpload()}
                placeholder="Enter YouTube playlist URL"
                className="url-input"
              />
              <button onClick={handlePreparePlaylistUpload} className="add-button">
                Add Playlist
              </button>
            </div>
          </div>
        )}

        <div className="content-grid">
          {uploadMode === 'single' ? (
            // Show individual videos
            videos.filter(v => v.documentId).map((video) => (
              <div key={video.documentId} className="content-card video-card">
                <div className="video-thumbnail">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title="YouTube Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="content-info">
                  <h4 className="content-title">{video.title}</h4>
                  <p className="channel-info">{video.channelTitle}</p>
                </div>
                <button 
                  onClick={() => handleDeleteByDocumentId(video.documentId)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            // Show playlists (one per channel)
            playlists.filter(p => p.documentId).map((playlist) => (
              <div key={playlist.documentId} className="content-card playlist-card">
                <div 
                  className="playlist-thumbnail clickable" 
                  onClick={() => handlePlaylistClick(playlist.playlistId)}
                  title="Click to view playlist on YouTube"
                >
                  <img src={playlist.thumbnail} alt={playlist.title} />
                  <div className="playlist-overlay">
                    <span className="video-count">{playlist.videoCount} videos</span>
                  </div>
                  <div className="click-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21V9M10 14L21 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div 
                  className="content-info clickable" 
                  onClick={() => handlePlaylistClick(playlist.playlistId)}
                  title="Click to view playlist on YouTube"
                >
                  <h4 className="content-title">{playlist.title}</h4>
                  <p className="channel-info">{playlist.channelTitle}</p>
                  {playlist.description && (
                    <p className="content-description">
                      {playlist.description.length > 100 
                        ? `${playlist.description.substring(0, 100)}...` 
                        : playlist.description}
                    </p>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteByDocumentId(playlist.documentId);
                  }}
                  className="delete-button"
                >
                  Delete Playlist
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Single Video Preview Modal */}
      {showPreview && previewData && (
        <div className="preview-modal">
          <div className="preview-content">
            <h3 className="modal-title">Confirm Video Upload</h3>
            <h4 className="video-title">{previewData.title}</h4>
            {previewData.channelTitle && (
              <p className="video-channel"><strong>Channel:</strong> {previewData.channelTitle}</p>
            )}
            <img src={previewData.thumbnail} alt="Video Thumbnail" className="preview-thumbnail" />
            {previewData.description && (
              <p className="video-description">
                {previewData.description.length > 200 
                  ? `${previewData.description.substring(0, 200)}...` 
                  : previewData.description}
              </p>
            )}
            <div className="preview-buttons">
              <button onClick={confirmUpload} disabled={isUploading} className="confirm-button">
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button onClick={() => setShowPreview(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Preview Modal */}
      {showPlaylistPreview && playlistPreviewData && (
        <div className="preview-modal playlist-modal">
          <div className="preview-content">
            <h3 className="modal-title">Confirm Playlist Upload</h3>
            <h4 className="video-title">{playlistPreviewData.title}</h4>
            <p className="video-channel"><strong>Channel:</strong> {playlistPreviewData.channelTitle}</p>
            <p className="video-count-info"><strong>Videos:</strong> {playlistPreviewData.videoCount}</p>
            {playlistPreviewData.thumbnail && (
              <img src={playlistPreviewData.thumbnail} alt="Playlist Thumbnail" className="preview-thumbnail" />
            )}
            {playlistPreviewData.description && (
              <p className="video-description">
                {playlistPreviewData.description.length > 200 
                  ? `${playlistPreviewData.description.substring(0, 200)}...` 
                  : playlistPreviewData.description}
              </p>
            )}
            
            <div className="playlist-videos-preview">
              <h5>Videos in this playlist:</h5>
              <div className="video-list">
                {playlistPreviewData.videos.slice(0, 5).map((video, index) => (
                  <div key={video.videoId} className="video-item">
                    <img src={video.thumbnail} alt={video.title} />
                    <span>{video.title}</span>
                  </div>
                ))}
                {playlistPreviewData.videos.length > 5 && (
                  <p className="more-videos">... and {playlistPreviewData.videos.length - 5} more videos</p>
                )}
              </div>
            </div>

            <div className="preview-buttons">
              <button onClick={confirmPlaylistUpload} disabled={isUploading} className="confirm-button">
                {isUploading ? 'Uploading Playlist...' : `Upload ${playlistPreviewData.videoCount} Videos`}
              </button>
              <button onClick={() => setShowPlaylistPreview(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpload;