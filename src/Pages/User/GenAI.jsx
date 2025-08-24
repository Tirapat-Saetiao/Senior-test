import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../CSS/GenAI.css';

const GenAI = () => {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'playlists', 'videos'
  
  // YouTube API key
  const YOUTUBE_API_KEY = 'AIzaSyBqY_lo1999QXobZCr6xDRavpvoMvVbhVE';

  const fetchYouTubeData = async (videoId) => {
    try {
      // Using YouTube Data API v3 for comprehensive video data
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      
      if (response.data.items && response.data.items.length > 0) {
        const videoData = response.data.items[0].snippet;
        const stats = response.data.items[0].statistics;
        
        return {
          title: videoData.title || 'Untitled Video',
          channelTitle: videoData.channelTitle || 'Unknown Channel',
          publishedat: videoData.publishedat,
          description: videoData.description || '',
          thumbnail: videoData.thumbnails.high?.url || 
                    videoData.thumbnails.medium?.url || 
                    videoData.thumbnails.default?.url || 
                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          viewCount: stats.viewCount || '0',
          likeCount: stats.likeCount || '0'
        };
      } else {
        // Fallback if video not found
        return {
          title: 'Video not available',
          channelTitle: 'Unknown Channel',
          publishedat: '',
          description: '',
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          viewCount: '0',
          likeCount: '0'
        };
      }
    } catch (error) {
      console.error(`Error fetching data for video ${videoId}:`, error);
      
      // Fallback to oEmbed API if YouTube API fails
      try {
        const oembedResponse = await axios.get(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );
        return {
          title: oembedResponse.data.title || 'Untitled Video',
          channelTitle: oembedResponse.data.author_name || 'Unknown Channel',
          publishedat: '',
          description: '',
          thumbnail: oembedResponse.data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          viewCount: '0',
          likeCount: '0'
        };
      } catch (oembedError) {
        console.error(`oEmbed fallback also failed for video ${videoId}:`, oembedError);
        return {
          title: 'Untitled Video',
          channelTitle: 'Unknown Channel',
          publishedat: '',
          description: '',
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          viewCount: '0',
          likeCount: '0'
        };
      }
    }
  };

  const fetchPlaylistData = async (playlistId) => {
    try {
      // Get playlist info
      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`
      );
      
      if (playlistResponse.data.items && playlistResponse.data.items.length > 0) {
        const playlistData = playlistResponse.data.items[0].snippet;
        
        // Get playlist items (videos)
        const itemsResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        
        const videos = itemsResponse.data.items?.map(item => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/0.jpg`,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt
        })) || [];

        return {
          title: playlistData.title || 'Untitled Playlist',
          description: playlistData.description || '',
          channelTitle: playlistData.channelTitle || 'Unknown Channel',
          thumbnail: playlistData.thumbnails?.high?.url || playlistData.thumbnails?.default?.url,
          videoCount: videos.length,
          videos: videos
        };
      } else {
        return {
          title: 'Playlist not available',
          description: '',
          channelTitle: 'Unknown Channel',
          thumbnail: `https://img.youtube.com/vi/${playlistId}/hqdefault.jpg`,
          videoCount: 0,
          videos: []
        };
      }
    } catch (error) {
      console.error(`Error fetching playlist data for ${playlistId}:`, error);
      return {
        title: 'Untitled Playlist',
        description: '',
        channelTitle: 'Unknown Channel',
        thumbnail: `https://img.youtube.com/vi/${playlistId}/hqdefault.jpg`,
        videoCount: 0,
        videos: []
      };
    }
  };

  const formatViewCount = (count) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Fetch videos and playlists from your Strapi API
        const [videosResponse, playlistsResponse] = await Promise.all([
          axios.get('https://ai.mfu.ac.th/strapi/api/videos'),
          axios.get('https://ai.mfu.ac.th/strapi/api/playlists').catch(() => ({ data: { data: [] } }))
        ]);

        const videosData = videosResponse.data.data;
        const playlistsData = playlistsResponse.data.data;

        // Fetch comprehensive data for videos
        const videosWithData = await Promise.all(
          videosData.map(async (video) => {
            const youtubeData = await fetchYouTubeData(video.videoId);
            return {
              ...video,
              ...youtubeData
            };
          })
        );

        // Fetch comprehensive data for playlists
        const playlistsWithData = await Promise.all(
          playlistsData.map(async (playlist) => {
            const playlistData = await fetchPlaylistData(playlist.playlistId);
            return {
              ...playlist,
              ...playlistData
            };
          })
        );

        // Filter videos: only show videos that are NOT part of any playlist
        const individualVideos = videosWithData.filter(video => 
          !video.playlistId && !video.playlistTitle
        );

        setVideos(individualVideos);
        setPlaylists(playlistsWithData);
      } catch (error) {
        console.error('Error loading content:', error);
        // If there's an error, still show the content with minimal data
        try {
          const [videosResponse, playlistsResponse] = await Promise.all([
            axios.get('https://ai.mfu.ac.th/strapi/api/videos'),
            axios.get('https://ai.mfu.ac.th/strapi/api/playlists').catch(() => ({ data: { data: [] } }))
          ]);
          
          const allVideos = videosResponse.data.data.map(video => ({
            ...video,
            title: 'Untitled Video',
            channelTitle: 'Unknown Channel',
            thumbnail: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
            viewCount: '0',
            publishedat: ''
          }));

          // Filter individual videos
          const individualVideos = allVideos.filter(video => 
            !video.playlistId && !video.playlistTitle
          );

          setVideos(individualVideos);
          
          setPlaylists(playlistsResponse.data.data.map(playlist => ({
            ...playlist,
            title: 'Untitled Playlist',
            channelTitle: 'Unknown Channel',
            thumbnail: `https://img.youtube.com/vi/${playlist.playlistId}/hqdefault.jpg`,
            videoCount: 0,
            videos: []
          })));
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setVideos([]);
          setPlaylists([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Determine what content to show based on active tab
  const showPlaylists = activeTab === 'all' || activeTab === 'playlists';
  const showVideos = activeTab === 'all' || activeTab === 'videos';

  if (videos.length === 0 && playlists.length === 0) {
    return (
      <div className="ai-portal genai-section">
        <div className="no-content-message">
          <h3>No Content Available</h3>
          <p>Videos and playlists will appear here when they're added.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-portal genai-section">
      <br></br>
      <h1 className="section-title">AI Content</h1>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span className="tab-text">All</span>
          <span className="tab-count">({playlists.length + videos.length})</span>
        </button>
        
        {playlists.length > 0 && (
          <button 
            className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlists')}
          >

            <span className="tab-text">Playlists</span>
            <span className="tab-count">({playlists.length})</span>
          </button>
        )}
        
        {videos.length > 0 && (
          <button 
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >

            <span className="tab-text">Videos</span>
            <span className="tab-count">({videos.length})</span>
          </button>
        )}
      </div>
      
      {/* Content Area */}
      <div className="content-container">
        {/* Playlists Section */}
        {playlists.length > 0 && showPlaylists && (
          <div className="content-section">
            {activeTab !== 'playlists' && <h2 className="section-subtitle"> Playlists</h2>}
            <div className="playlist-grid">
              {playlists.map(playlist => (
                <div key={playlist.id} className="playlist-card">
                  <a
                    href={`https://www.youtube.com/playlist?list=${playlist.playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="playlist-thumb-link"
                    aria-label={`View playlist: ${playlist.title}`}
                  >
                    <div className="playlist-thumb-container">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="playlist-thumb"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${playlist.playlistId}/hqdefault.jpg`;
                        }}
                      />

                      <div className="playlist-stats">
                        <span className="video-count"> {playlist.videoCount} videos</span>
                      </div>
                    </div>
                  </a>
                  <div className="playlist-info">
                    <h3 className="playlist-title">{playlist.title}</h3>
                    <div className="playlist-meta">
                      <p className="channel-name">📺 {playlist.channelTitle}</p>
                    </div>
                    {playlist.description && (
                      <p className="playlist-description">
                        {playlist.description.length > 100 
                          ? `${playlist.description.substring(0, 100)}...` 
                          : playlist.description}
                      </p>
                    )}
                    {playlist.videos && playlist.videos.length > 0 && (
                      <div className="playlist-preview">
                        <p className="preview-title">Recent videos:</p>
                        <div className="preview-videos">
                          {playlist.videos.slice(0, 3).map((video, index) => (
                            <div key={index} className="preview-video">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="preview-thumb"
                              />
                              <span className="preview-title-text">{video.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && showVideos && (
          <div className="content-section">
            {activeTab !== 'videos' && <h2 className="section-subtitle">Videos</h2>}
            <div className="video-grid">
              {videos.map(video => (
                <div key={video.id} className="video-card">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-thumb-link"
                    aria-label={`Watch video: ${video.title}`}
                  >
                    <div className="video-thumb-container">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="video-thumb"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                        }}
                      />
                      <div className="play-button" />
                      {video.viewCount && parseInt(video.viewCount) > 0 && (
                        <div className="video-stats">
                          <span className="view-count">👁 {formatViewCount(video.viewCount)}</span>
                        </div>
                      )}
                    </div>
                  </a>
                  <div className="video-info">
                    <h2 className="video-title">{video.title}</h2>
                    <div className="video-meta">
                      <p className="channel-name">📺 {video.channelTitle}</p>
                      {video.publishedat && (
                        <p className="publish-date">📅 {formatDate(video.publishedat)}</p>
                      )}
                    </div>
                    {video.description && (
                      <p className="video-description">
                        {video.description.length > 100 
                          ? `${video.description.substring(0, 100)}...` 
                          : video.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenAI;