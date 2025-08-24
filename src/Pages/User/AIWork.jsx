import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/AIArticle.css';

const Wordhome = () => {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryId = 7; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`https://ai.mfu.ac.th/wp-json/wp/v2/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch category details");
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://ai.mfu.ac.th/wp-json/wp/v2/posts?categories=${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchCategory(), fetchPosts()]);
    };

    loadData();
  }, [categoryId]);


  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };


  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <div className="loading-category">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-category">
        <div className="loading-content">
          <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>⚠️</span>
          <p>Error loading content</p>
          <small style={{ color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
            {error}
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="wordhome-container">
      <div className="category-details">
        <h2>{category?.name || 'Blog Posts'}</h2>
      </div>

      <div className="blog-grid">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div 
              key={post.id} 
              className="blog-card"
              style={{ '--index': index }}
            >
              {post.yoast_head_json?.og_image?.[0]?.url && (
                <img
                  src={post.yoast_head_json.og_image[0].url}
                  alt={stripHtml(post.title?.rendered) || "Post thumbnail"}
                  className="blog-card-image"
                  loading="lazy"
                />
              )}

              <h2 className="blog-card-title">
                {post.title?.rendered ? stripHtml(post.title.rendered) : 'Untitled Post'}
              </h2>

              <div className="blog-card-excerpt">
                {post?.excerpt?.rendered ? (
                  <p>{truncateText(stripHtml(post.excerpt.rendered), 150)}</p>
                ) : (
                  <p>No excerpt available for this post.</p>
                )}
              </div>

              <button
                className="read-more-button"
                onClick={() => navigate(`/post/${post.id}`)}
                aria-label={`Read more about ${stripHtml(post.title?.rendered) || 'this post'}`}
              >
                Read More
              </button>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>No posts available for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wordhome;