import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/SpecialBlog.css";

// Allowed domain for regular users
const ALLOWED_DOMAIN = "lamduan.mfu.ac.th";
const API_URL = "https://ai.mfu.ac.th/strapi/api/posts";

const SpecialBlog = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      

      const sortedPosts = [...response.data.data].sort((a, b) => {
        const dateA = a.createdAt || a.attributes?.createdAt || '0';
        const dateB = b.createdAt || b.attributes?.createdAt || '0';
        return new Date(dateB) - new Date(dateA);
      });
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const adminToken = sessionStorage.getItem("admin_jwt");

    // If no user or admin token, redirect to login
    if (!storedUser && !adminToken) {
      alert("Please log in to access this content.");
      navigate("/login", { replace: true });
      setIsLoading(false);
      return;
    }

    if (adminToken) {
      setUser({ isAdmin: true, name: "Admin" });
      setIsLoading(false);
      return;
    }

    if (storedUser && storedUser.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setUser(storedUser);
    } else {
      alert(`Access Denied: Only @${ALLOWED_DOMAIN} emails or administrators can access this content.`);
      navigate("/login", { replace: true });
    }

    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();

      const interval = setInterval(() => {
        fetchPosts();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);


  if (isLoading || loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }


  if (!user) return null;

  if (error) return <div className="error">{error}</div>;


  return (
    <div className="container">
      <h1>Special Blog Page</h1>
      <br></br>

      
      <div className="grid">
        {posts.length > 0 ? (
          posts
            .filter((post) => !post.hidden) 
            .map((post) => {
              const { id, url, metadata } = post;
              return (
                <div key={id} className="card">
                  <div className="image-container">
                    <img
                      src={metadata.image ? metadata.image : "/api/placeholder/300/200"}
                      alt={metadata.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/300/200";
                      }}
                    />
                  </div>
                  <div className="content">
                    <h2 className="title">{metadata.title}</h2>
                    <p className="description">
                      {metadata.description
                        ? metadata.description.substring(0, 100)
                        : "No description available"}
                      {metadata.description?.length > 100 ? "..." : ""}
                    </p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="link">
                      Visit Link
                    </a>
                  </div>
                </div>
              );
            })
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontSize: '18px', color: '#666' }}>
            No posts available.
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecialBlog;