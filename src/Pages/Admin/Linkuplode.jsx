import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../CSS/Linkuplode.css';

const API_BASE = 'https://ai.mfu.ac.th/strapi/api';

const CONTENT_TYPES = [
  { key: 'researchs', label: 'Research' },
  { key: 'codings', label: 'Coding' },
  { key: 'images', label: 'Images' },
  { key: 'text-and-contents', label: 'Texts & Contents' },
  { key: 'chatbots', label: 'Chat-Bot' }, 
  { key: 'meetings', label: 'Meeting AI' },
];

const Linkuplode = () => {
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('admin_jwt'));
  const [selectedType, setSelectedType] = useState(CONTENT_TYPES[0].key);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', link: '', imageUrl: '' });

  useEffect(() => {
    const storedToken = sessionStorage.getItem('admin_jwt');
    if (storedToken !== jwtToken) {
      setJwtToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (jwtToken) {
      fetchItems();
    }
  }, [selectedType, jwtToken]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${selectedType}?populate=*`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const flatItems = res.data.data.map((entry) => ({
        id: entry.id,
        ...entry,
        ...(entry.picture && { picture: entry.picture }),
      }));
      setItems(flatItems);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const addItem = async () => {
    // Simple validation
    if (!formData.name.trim()) {
      return;
    }

    try {
      const { name, description, link, imageUrl } = formData;
      const data = { name, description, link, imageUrl };

      await axios.post(
        `${API_BASE}/${selectedType}`,
        { data },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );

      setFormData({ name: '', description: '', link: '', imageUrl: '' });
      fetchItems();
    } catch (error) {
      console.error('Add item failed', error);
    }
  };

  const deleteItem = async (documentId, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(`${API_BASE}/${selectedType}/${documentId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        fetchItems();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="admin-manager">
      <h2>Admin Content Manager</h2>

      <div className="content-tabs">
        {CONTENT_TYPES.map((type) => (
          <button
            key={type.key}
            className={`content-tab ${selectedType === type.key ? 'active' : ''}`}
            onClick={() => setSelectedType(type.key)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="add-form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
        <button onClick={addItem}>
          Add Item
        </button>
      </div>

      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name || item.title}</h3>
            <p>{item.description || item.content}</p>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
              </a>
            )}
            {(item.imageUrl || item.picture?.formats?.medium?.url || item.picture?.url) && (
              <img
                src={
                  item.imageUrl
                    || `https://ai.mfu.ac.th/strapi${item.picture?.formats?.medium?.url}`
                    || `https://ai.mfu.ac.th/strapi${item.picture?.url}`
                }
                alt={item.name || item.title || 'Image'}
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
            <button 
              onClick={() => deleteItem(item.documentId, item.name || item.title)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Linkuplode;