import React, { useState } from 'react';
import '../../CSS/sharing.css';

const SharingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const categories = [
    { id: 1, title: 'Prompt', content: 'Here are some prompts.' },
    { id: 2, title: 'Use Case', content: 'Explore use cases for AI.' },
    { id: 3, title: 'Blog', content: 'Read insightful blog posts.' },
    { id: 4, title: 'Video', content: 'Watch interesting videos.' },
  ];

  return (
    <div className="sharing-page">
      <h1>Explore Content</h1>
      <div className="category-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-box"
            onClick={() => handleCategoryClick(category)}
          >
            <h2>{category.title}</h2>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="category-content">
          <h2>{selectedCategory.title}</h2>
          <p>{selectedCategory.content}</p>
        </div>
      )}
    </div>
  );
};

export default SharingPage;
