import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../CSS/AIWorkDetail.css";

const AIWorkdetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`https://ai.mfu.ac.th/wp-json/wp/v2/posts/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="word-detail-page">
                <div className="loading">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <p>Loading content...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="word-detail-page">
                <div className="error">
                    <div className="error-content">
                        <span className="error-icon">⚠️</span>
                        <p>Error loading content</p>
                        <small>{error}</small>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="word-detail-page">
                <div className="no-post">
                    <div className="no-post-content">
                        <span className="no-post-icon">📝</span>
                        <p>Post not found</p>
                        <small>The requested content could not be found</small>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="word-detail-page">
            <div className="word-detail-container">
                <div className="word-detail-inner">
                    <h1 className="word-detail-title">
                        {post.title.rendered}
                    </h1>
                    
                    {post.yoast_head_json?.og_image?.[0]?.url && (
                        <img 
                            src={post.yoast_head_json.og_image[0].url} 
                            alt="Post Thumbnail" 
                            className="word-detail-image"
                            loading="lazy"
                        />
                    )}
                    
                    <div
                        className="word-detail-content2"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AIWorkdetail;