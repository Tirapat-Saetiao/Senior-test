import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/AIArticle.css';

const AIArticle = () => {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const categoryId = 8; // Hardcoded ID for this example
  const navigate = useNavigate();
  const WORDPRESS_DOMAIN = process.env.REACT_APP_WORDPRESS_DOMAIN;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${WORDPRESS_DOMAIN}/wp-json/wp/v2/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch category details");
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${WORDPRESS_DOMAIN}/wp-json/wp/v2/posts?categories=${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchCategory();
    fetchPosts();
  }, [WORDPRESS_DOMAIN]); // Added dependency

  if (!category) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="category-details">
        <h2>{category.name}</h2>
      </div>

      <div className="blog-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="blog-card">
              <h2 className="blog-card-title">{post.title?.rendered}</h2>

              {post.yoast_head_json?.og_image?.[0]?.url && (
                <img
                  src={post.yoast_head_json.og_image[0].url}
                  alt="Post"
                  className="blog-card-image"
                />
              )}

              <div
                className="blog-card-excerpt"
                dangerouslySetInnerHTML={{
                  __html:
                    post?.excerpt?.rendered.length > 150
                      ? post.excerpt.rendered.substring(0, 150) + "..."
                      : post.excerpt.rendered,
                }}
              ></div>

              {/* Read More Button */}
              <button
                className="read-more-button"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                Read More
              </button>
            </div>
          ))
        ) : (
          <p>No posts available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default AIArticle;