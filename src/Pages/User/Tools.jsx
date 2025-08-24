import React, { useState, useEffect } from 'react';
import '../../CSS/Tools.css';

const Tools = () => {
  const [researches, setResearches] = useState([]);
  const [images, setImages] = useState([]);
  const [codings, setCodings] = useState([]);
  const [texts, setTexts] = useState([]);
  const [chatbots, setChatbots] = useState([]);
  const [meet, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('research');
  const STRAPI_DOMAIN = process.env.REACT_APP_STRAPI_DOMAIN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resRes, resImg, resCod, resTxt, resChat, resMeet] = await Promise.all([
          fetch(`${STRAPI_DOMAIN}/strapi/api/researchs?populate=*`),
          fetch(`${STRAPI_DOMAIN}/strapi/api/images?populate=*`),
          fetch(`${STRAPI_DOMAIN}/strapi/api/codings?populate=*`),
          fetch(`${STRAPI_DOMAIN}/strapi/api/text-and-contents?populate=*`),
          fetch(`${STRAPI_DOMAIN}/strapi/api/chatbots?populate=*`),
          fetch(`${STRAPI_DOMAIN}/strapi/api/meetings?populate=*`)
        ]);

        if (!resRes.ok || !resImg.ok || !resCod.ok || !resTxt.ok || !resChat.ok || !resMeet.ok) {
          throw new Error('Failed to fetch some resources');
        }

        const [researchData, imagesData, codingsData, textsData, chatbotsData, meetData] = await Promise.all([
          resRes.json(),
          resImg.json(),
          resCod.json(),
          resTxt.json(),
          resChat.json(),
          resMeet.json()
        ]);

        setResearches(researchData.data || []);
        setImages(imagesData.data || []);
        setCodings(codingsData.data || []);
        setTexts(textsData.data || []);
        setChatbots(chatbotsData.data || []);
        setMeets(meetData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (item) => {
    if (item.imageUrl) return item.imageUrl;

    const pic = item.picture || item.image || item;
    
    // Try to get the highest quality image available
    if (pic?.formats) {
      // Priority order: large > medium > small > thumbnail
      if (pic.formats.large?.url) {
        return `${STRAPI_DOMAIN}/strapi${pic.formats.large.url}`;
      }
      if (pic.formats.medium?.url) {
        return `${STRAPI_DOMAIN}/strapi${pic.formats.medium.url}`;
      }
      if (pic.formats.small?.url) {
        return `${STRAPI_DOMAIN}/strapi${pic.formats.small.url}`;
      }
      if (pic.formats.thumbnail?.url) {
        return `${STRAPI_DOMAIN}/strapi${pic.formats.thumbnail.url}`;
      }
    }
    
    return pic?.url ? `${STRAPI_DOMAIN}/strapi${pic.url}` : null;
  };

  const sections = [
    { key: 'research', title: 'Research', data: researches },
    { key: 'coding', title: 'Coding', data: codings },
    { key: 'images', title: 'Images', data: images },
    { key: 'texts', title: 'Text & Content', data: texts },
    { key: 'chatbots', title: 'Chat-Bot', data: chatbots },
    { key: 'meetings', title: 'Meeting AI', data: meet }
  ];

  const FloatingElements = () => (
    <div className="floating-container">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="floating-element"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          <div className="floating-particle"></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-outer"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  const totalTools = sections.reduce((acc, section) => acc + section.data.length, 0);

  return (
    <div className="tools-container">
      <FloatingElements />
      
      <div className="tools-wrapper">
        {/* Header */}
        <div className="tools-header" style={{ marginBottom: '2rem' }}>
          <br></br>
          <h1 className="section-title"> AI Tools Hub </h1>
        </div>

        <div className="tools-layout">
          {/* Sidebar Navigation */}
          <div className="sidebar">
            <div className="sidebar-card">
              <h2 className="sidebar-title">Categories</h2>
              <div className="category-list">
                {sections.map((section, index) => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`category-btn ${activeSection === section.key ? 'active' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="category-titles">{section.title}</span>
                    <span className="category-count">{section.data.length}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="stats-card">
              <h3 className="sidebar-title" style={{ marginBottom: '0.8rem' }}>Quick Stats</h3>
              <div className="stats-content">
                <div className="stat-item">
                  <span className="stat-label">Total Tools</span>
                  <span className="stat-value total">{totalTools}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Categories</span>
                  <span className="stat-value categories">{sections.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="content-card">
              {sections.map((section) => (
                <div
                  key={section.key}
                  className={`section-content ${activeSection === section.key ? 'active' : ''}`}
                >
                  <div className="section-header">
                    <div>
                    </div>
                  </div>

                  <div className="tools-grid">
                    {section.data.length > 0 ? section.data.map((item, index) => {
                      const imgUrl = getImageUrl(item);
                      return (
                        <div
                          key={item.id}
                          className="tool-card"
                          onClick={() => item.link && window.open(item.link, '_blank')}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="tool-content">
                            <div className="tool-icon-wrapper">
                              <div className="tool-icon">
                                {imgUrl ? (
                                  <img 
                                    src={imgUrl} 
                                    alt={item.title || item.name} 
                                    className="tool-image"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : null}
                              </div>
                            </div>
                            <div className="tool-info">
                              <h3 className="tool-title">
                                {item.title || item.name}
                              </h3>
                              <p className="tool-description">
                                {item.description || item.content || 'No description available'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="empty-state">
                        <p className="empty-text">No tools available in this category yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;