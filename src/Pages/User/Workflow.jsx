import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/AIArticle.css';


const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);


const PostCard = ({ post, navigate }) => (
  <div className="blog-card">
    <h2 className="blog-card-title">{post.title?.rendered}</h2>

    {post.yoast_head_json?.og_image?.[0]?.url && (
      <img
        src={post.yoast_head_json.og_image[0].url}
        alt="Post"
        className="blog-card-image"
        loading="lazy"
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

    <button
      className="read-more-button"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      Read More
    </button>
  </div>
);

const Workflow = () => {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categoryId = 6;
  const navigate = useNavigate();


  const fetchData = async (url, setData) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  /**
   * Fetch Category and Posts Data
   */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchData(`https://ai.mfu.ac.th/wp-json/wp/v2/categories/${categoryId}`, setCategory),
      fetchData(`https://ai.mfu.ac.th/wp-json/wp/v2/posts?categories=${categoryId}`, setPosts)
    ]).finally(() => setLoading(false));
  }, []);

  /**
   * Conditional Rendering
   */
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;
  if (!category) return <p>No category data available.</p>;

  return (
    <div className="workflow-container">
      <div className="category-details">
        <h2>{category.name}</h2>
      </div>

      <div className="blog-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} navigate={navigate} />
          ))
        ) : (
          <p>No posts available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Workflow;
