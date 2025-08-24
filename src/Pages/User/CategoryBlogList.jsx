import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../CSS/Catagories.css";

const CategoryBlogList = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://ai.mfu.ac.th/wp-json/wp/v2/categories/${id}`)
      .then((res) => res.json())
      .then((cat) => setCategoryName(cat.name));

    fetch(`https://ai.mfu.ac.th/wp-json/wp/v2/posts?categories=${id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, [id]);

  return (
    <div className="blog-page">
      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <h1 className="blog-page-title" data-text={categoryName}>
        {categoryName}
      </h1>

      <div className="blog-content">
        <div className="blog-grid">
          {posts.map((post) => (
            <div key={post.id} className="blog-card">
              {post.yoast_head_json?.og_image?.[0]?.url && (
                <img
                  src={post.yoast_head_json.og_image[0].url}
                  alt="Post"
                  className="blog-card-image"
                />
              )}
              
              <div className="blog-card-content">
                <h2 className="blog-card-title">{post.title?.rendered}</h2>

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
                  className="blog-card-button"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBlogList;