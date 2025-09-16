import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hep.css";

const CATEGORY_IDS = [4, 5, 6, 7, 8];

const Hep = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gptTools, setGptTools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("https://ai.mfu.ac.th/wp-json/wp/v2/posts").then((res) => res.json()),
      fetch("https://ai.mfu.ac.th/wp-json/wp/v2/categories").then((res) => res.json()),
      fetch("https://ai.mfu.ac.th/strapi/api/Chatgpts?populate=*").then((res) => res.json()),
    ])
      .then(([postsData, categoriesData, gptData]) => {
        setPosts(postsData);
        setCategories(categoriesData);
        setGptTools(gptData.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getPostsByCategory = (catId) =>
    posts.filter((post) => post.categories.includes(catId)).slice(0, 3);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : `Category ${id}`;
  };

  return (
    <div className="ai-portal">
      {/* Background overlay */}
      <div className="background-overlay" />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="ai-label">MFU AI Knowledge Hub</p>
          <div className="hero-text-wrapper">
            <h2 className="hero-text">AI PORTAL FOR MFU</h2>
            <h3 className="hero-text-thai">ศูนย์ความรู้ AI MFU</h3>
          </div>
        </div>
      </section>

      {/* GPT Tools */}
      <section className="section">
        <h2 className="section-title">
          <span className="title-english">Explore GPT Tools</span>
          <span className="title-thai">GPT ที่พัฒนาเพื่อบุคลากร</span>
        </h2>
        <div className="gpt-cards">
          {gptTools.map((tool) => {
            const pic = tool.picture?.[0];
            const imageUrl = pic ? `https://ai.mfu.ac.th/strapi${pic.formats?.medium?.url || pic.url}` : null;
            return (
              <div
                key={tool.id}
                className="gpt-card"
                onClick={() => window.open(tool.Link, "_blank")}
              >
                {imageUrl && (
                  <div className="gpt-image-container">
                    <img src={imageUrl} alt={tool.name} className="gpt-image" />
                  </div>
                )}
                <div className="gpt-card-content">
                  <h3 className="gpt-card-title">{tool.name}</h3>
                  <p className="gpt-card-description">{tool.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Blog Posts */}
      <section className="section">
        <h2 className="section-title">
          <span className="title-english">Latest Blogs</span>
          <span className="title-thai">บล็อกล่าสุด</span>
        </h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          CATEGORY_IDS.map((catId) => {
            const catPosts = getPostsByCategory(catId);
            if (catPosts.length === 0) return null;
            return (
              <div key={catId} className="category-section">
                <h3 className="category-title">{getCategoryName(catId)}</h3>
                <div className="blog-grid">
                  {catPosts.map((post) => (
                    <div
                      key={post.id}
                      className="blog-card"
                      onClick={() => navigate(`/post/${post.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {post.yoast_head_json?.og_image?.[0]?.url && (
                        <div className="blog-image-container">
                          <img
                            src={post.yoast_head_json.og_image[0].url}
                            alt="Thumbnail"
                            className="blog-img"
                          />
                        </div>
                      )}
                      <div className="blog-content">
                        <h4 className="blog-title">{post.title?.rendered || "Untitled"}</h4>
                        <div
                          className="blog-excerpt"
                          dangerouslySetInnerHTML={{
                            __html:
                              post?.excerpt?.rendered?.length > 0
                                ? post.excerpt.rendered.substring(0, 150) + "..."
                                : "No preview available",
                          }}
                        />
                        <div className="read-more">
                          <span className="read-more-english">Read More</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default Hep;
