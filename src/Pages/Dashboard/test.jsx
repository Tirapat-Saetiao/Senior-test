import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hep from '../../components/Hep/Hep';
import { apiService } from '../../api/apiService';
import '../../CSS/test.css';

const Test = () => {
  const [userData, setUserData] = useState(null);
  const [isStudent, setIsStudent] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Refs for handling image loading
  const imageRefs = useRef([]);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
      // Check user type based on email domain
      if (storedUser.email.endsWith("@lamduan.mfu.ac.th")) {
        setIsStudent(true);
        // Fetch student data including posts
        fetchStudentData(storedUser.email);
      } else if (storedUser.email.endsWith("@mfu.ac.th")) {
        setIsStaff(true);
        // Fetch staff data if needed
        // fetchStaffData(storedUser.email);
      }
    }
  }, []);

  const fetchStudentData = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the student-specific API
      const studentData = await apiService.student.fetchStudentData(email);
      setStudentData(studentData);
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load posts and codings. Please try again later.');
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

  // If not logged in, show the landing page
  if (!userData) {
    return <Hep />;
  }

  // Ensure each image in the coding tools is correctly loaded
  const handleImageError = (index) => {
    imageRefs.current[index].style.display = 'none'; // Hide the image if it fails to load
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to MFU AI Portal</h1>
        <div className="user-info">
          <p>Welcome, {userData?.name || 'User'}</p>
          <p className="email">{userData?.email}</p>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* Student-specific cards */}
       

        {/* Staff-specific cards */}
        {isStaff && (
          <>
            <div className="dashboard-card" onClick={() => navigate('/workflow')}>
              <h3>Staff Workflow</h3>
              <p>Manage AI workflow processes</p>
            </div>
            <div className="dashboard-card staff-specific">
              <h3>Staff Management</h3>
              <p>AI tools and resources for staff members</p>
            </div>
          </>
        )}
      </div>

      {/* Student-specific posts section */}
      {isStudent && (
        <div className="posts-section">
          <h2>Latest Posts & Updates</h2>
          
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading posts...</p>
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
                            ref={(el) => imageRefs.current[index] = el}
                            onError={() => handleImageError(index)} // Handle image errors
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
      )}

      {/* Displaying Coding Tools (Codings Data) */}
      {studentData && studentData.codings && studentData.codings.length > 0 && (
        <div className="codings-section">
          <h2>AI Coding Tools</h2>
          <div className="codings-grid">
            {studentData.codings.map((coding, index) => (
              <div key={coding.id || coding.documentId || index} className="coding-card">
                {coding.picture?.formats?.medium && (
                  <div className="coding-image">
                    <img 
                      src={coding.picture.formats.medium.url} 
                      alt={coding.name || 'Coding Tool Image'}
                      ref={(el) => imageRefs.current[index] = el}
                      onError={() => handleImageError(index)} // Handle image errors
                    />
                  </div>
                )}
                <div className="coding-content">
                  <h3>{coding.name || 'Untitled Coding Tool'}</h3>
                  <p className="coding-description">
                    {truncateDescription(coding.description)}
                  </p>
                  <a href={coding.link} target="_blank" rel="noopener noreferrer" className="coding-link">
                    Learn More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
