import React, { useEffect, useState, useRef } from "react";
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
  
  // Refs for scroll animations
  const gptSectionRef = useRef(null);
  const blogSectionRef = useRef(null);
  const categoryRefs = useRef([]);

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


  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

 
    if (gptSectionRef.current) observer.observe(gptSectionRef.current);
    if (blogSectionRef.current) observer.observe(blogSectionRef.current);
    

    categoryRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });


    const cards = document.querySelectorAll('.gpt-card, .blog-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [gptTools, posts]);

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
      <section className="section scroll-animate" ref={gptSectionRef}>
        <h2 className="section-title">
          <span className="title-english">Explore GPT Tools</span>
          <span className="title-thai">GPT ที่พัฒนาเพื่อบุคลากร</span>
        </h2>
        <div className="gpt-cards">
          {gptTools.map((tool, index) => {
            const pic = tool.picture?.[0];
            const imageUrl = pic ? `https://ai.mfu.ac.th/strapi${pic.formats?.medium?.url || pic.url}` : null;
            return (
              <div
                key={tool.id}
                className="gpt-card scroll-animate"
                onClick={() => window.open(tool.Link, "_blank")}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="gpt-image-container">
                  {imageUrl && <img src={imageUrl} alt={tool.name} className="gpt-image" />}
                </div>
                <div className="gpt-card-content">
                  <h3 className="gpt-card-title">{tool.name}</h3>
                  <p className="gpt-card-description">{tool.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Blog Posts */}
      <section className="section scroll-animate" ref={blogSectionRef}>
        <h2 className="section-title">
          <span className="title-english">Latest Blogs</span>
          <span className="title-thai">บล็อกล่าสุด</span>
        </h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          CATEGORY_IDS.map((catId, categoryIndex) => {
            const catPosts = getPostsByCategory(catId);
            if (catPosts.length === 0) return null;
            return (
              <div 
                key={catId} 
                className="category-section scroll-animate"
                ref={el => categoryRefs.current[categoryIndex] = el}
                style={{ animationDelay: `${categoryIndex * 0.2}s` }}
              >
                <h3 className="category-title">
                  {getCategoryName(catId)}
                </h3>
                <div className="blog-grid">
                  {catPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="blog-card scroll-animate"
                      onClick={() => navigate(`/post/${post.id}`)}
                      style={{ 
                        cursor: "pointer",
                        animationDelay: `${(categoryIndex * 3 + index) * 0.1}s`
                      }}
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
                        <h4 className="blog-title">
                          {post.title?.rendered || "Untitled"}
                        </h4>
                        <div
                          className="blog-excerpt"
                          dangerouslySetInnerHTML={{
                            __html:
                              post?.excerpt?.rendered?.length > 0
                                ? post.excerpt.rendered.substring(0, 150) + "..."
                                : "No preview available",
                          }}
                        ></div>
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