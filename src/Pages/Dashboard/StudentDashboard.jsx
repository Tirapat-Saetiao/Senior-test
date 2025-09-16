import React, { useEffect, useState } from 'react';
import { apiService } from '../../api/apiService';
import '../../CSS/StudentDashboard.css';

const StudentDashboard = ({ userData }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData?.email) {
      fetchStudentData(userData.email);
    }
  }, [userData]);

  const fetchStudentData = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.student.fetchStudentData(email);
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load posts, AI tools, and content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (!description) return 'No description available';
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...'
      : description;
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to MFU AI Portal</h1>
        <div className="user-info">
          <p>Welcome, {userData?.name || 'Student'}</p>
          <p className="email">{userData?.email}</p>
          <span className="user-badge student-badge">Student</span>
        </div>
      </div>

      {/* Student-specific posts section */}
      <div className="posts-section">
        <h2>Latest Posts & Updates</h2>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading posts and AI tools...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              onClick={() => fetchStudentData(userData.email)} 
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && studentData && (
          <>
            {studentData.posts && studentData.posts.length > 0 ? (
              <div className="posts-grid">
                {studentData.posts.map((post, index) => (
                  <div key={post.id || post.documentId || index} className="post-card">
                    {post.metadata?.image && (
                      <div className="post-image">
                        <img 
                          src={post.metadata.image} 
                          alt={post.metadata?.title || post.name || 'Post image'}
                        />
                      </div>
                    )}

                    <div className="post-content">
                      <h3>{post.metadata?.title || post.name || 'Untitled Post'}</h3>
                      <p className="post-description">
                        {truncateDescription(post.metadata?.description)}
                      </p>
                      
                      <div className="post-meta">
                        {(post.createdAt || post.publishedAt) && (
                          <span className="post-date">
                            📅 {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                        )}
                        
                        {post.url && (
                          <a 
                            href={post.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="post-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Read More → 
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-posts">
                <p>No posts available at the moment.</p>
                <button 
                  onClick={() => fetchStudentData(userData.email)} 
                  className="refresh-btn"
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Tools & Codings section */}
      <div className="codings-section">
        <h2>AI Tools & Resources</h2>
        
        {!loading && !error && studentData && (
          <>
            {studentData.codings && studentData.codings.length > 0 ? (
              <div className="codings-grid">
                {studentData.codings.map((coding, index) => (
                  <div key={coding.id || coding.documentId || index} className="coding-card">
                    {(coding.picture?.url || coding.imageUrl) && (
                      <div className="coding-image">
                        <img 
                          src={coding.picture?.url ? `https://ai.mfu.ac.th/strapi${coding.picture.url}` : coding.imageUrl} 
                          alt={coding.name || 'AI Tool'}
                        />
                      </div>
                    )}

                    <div className="coding-content">
                      <h3>{coding.name || 'Untitled Tool'}</h3>
                      <p className="coding-description">
                        {truncateDescription(coding.description)}
                      </p>
                      
                      <div className="coding-meta">
                        {coding.publishedAt && (
                          <span className="coding-date">
                            📅 {formatDate(coding.publishedAt)}
                          </span>
                        )}
                        
                        {coding.link && (
                          <a 
                            href={coding.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="coding-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit Tool → 
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-codings">
                <p>No AI tools available at the moment.</p>
                <button 
                  onClick={() => fetchStudentData(userData.email)} 
                  className="refresh-btn"
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="codings-section">
        <h2>AI Tools & Resources</h2>
        
        {!loading && !error && studentData && (
          <>
            {studentData.research && studentData.research.length > 0 ? (
              <div className="codings-grid">
                {studentData.research.map((research, index) => (
                  <div key={research.id || research.documentId || index} className="coding-card">
                    {(research.picture?.url || research.imageUrl) && (
                      <div className="coding-image">
                        <img 
                          src={research.picture?.url ? `https://ai.mfu.ac.th/strapi${research.picture.url}` : research.imageUrl} 
                          alt={research.name || 'AI Tool'}
                        />
                      </div>
                    )}

                    <div className="coding-content">
                      <h3>{research.name || 'Untitled Tool'}</h3>
                      <p className="coding-description">
                        {truncateDescription(research.description)}
                      </p>
                      
                      <div className="coding-meta">
                        {research.publishedAt && (
                          <span className="coding-date">
                            📅 {formatDate(research.publishedAt)}
                          </span>
                        )}
                        
                        {research.link && (
                          <a 
                            href={research.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="coding-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit Tool → 
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-codings">
                <p>No AI tools available at the moment.</p>
                <button 
                  onClick={() => fetchStudentData(userData.email)} 
                  className="refresh-btn"
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
