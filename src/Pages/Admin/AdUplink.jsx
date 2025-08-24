// src/components/AdUplink.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../CSS/Aduplink.css';

const API_URL = "https://ai.mfu.ac.th/strapi/api/posts";
const USER_URL = "https://ai.mfu.ac.th/strapi/api/users/me";

const getToken = () => sessionStorage.getItem("admin_jwt");

const fetchLinkMetadata = async (url) => {
  try {
    const response = await axios.get(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`
    );
    return {
      title:       response.data.data.title       || "Untitled",
      description: response.data.data.description || "No description available",
      image:       response.data.data.image?.url   || "/api/placeholder/300/200"
    };
  } catch (err) {
    console.error("Error fetching link metadata:", err.message);
    return {
      title:       url,
      description: "Unable to fetch metadata",
      image:       "/api/placeholder/300/200"
    };
  }
};

const AdUplink = () => {
  const [user, setUser]               = useState(null);
  const [links, setLinks]             = useState([]);
  const [linkInput, setLinkInput]     = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null);
  const navigate = useNavigate();

  const fetchUserAndLinks = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized");

      const [userRes, linksRes] = await Promise.all([
        axios.get(USER_URL, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(API_URL,  { headers: { Authorization: `Bearer ${token}` } })
      ]);

      console.log("User response:", userRes.data);

      // Map API response to local shape, using numeric `id`
      const formattedLinks = linksRes.data.data.map(item => ({
        id:         item.id,
        documentId: item.documentId,
        url:        item.url,
        name:       item.name,
        metadata:   item.metadata,
        hidden:     item.hidden   || false,
        createdAt:  item.createdAt || item.attributes?.createdAt || new Date().toISOString()
      }));
      
      // Sort links by creation date, newest first
      formattedLinks.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      console.log("Fetched links:", formattedLinks);

      setUser(userRes.data);
      setLinks(formattedLinks);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.message === "Unauthorized" || err.response?.status === 401) {
        sessionStorage.removeItem("admin_jwt");
        navigate("/admin-login", { replace: true });
      } else {
        setError("Failed to load data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkUpload = async () => {
    if (!linkInput.trim()) {
      alert("Please enter a valid link.");
      return;
    }
    setIsUploading(true);

    try {
      const metadata = await fetchLinkMetadata(linkInput);
      const response = await axios.post(
        API_URL,
        { data: {
            name:     metadata.title,
            url:      linkInput,
            metadata: metadata,
            hidden:   false
          }
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      console.log("Upload response:", response.data);

      const newItem = {
        id:         response.data.data.id,
        documentId: response.data.data.documentId,
        url:        response.data.data.url,
        name:       response.data.data.name,
        metadata:   response.data.data.metadata,
        hidden:     response.data.data.hidden,
        createdAt:  response.data.data.createdAt || new Date().toISOString()
      };
      // Add new links to the beginning of the array
      setLinks(prev => [newItem, ...prev]);
      setLinkInput("");
    } catch (err) {
      console.error("Error uploading link:", err.response?.data?.error);
      alert(`Error uploading link: ${err.response?.data?.error?.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLink = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      const response = await axios.delete(
        `${API_URL}/${documentId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      console.log("Delete response status:", response.status);
      setLinks(prev => prev.filter(link => link.documentId !== documentId));
    } catch (err) {
      console.error("Error deleting link:", err.response?.data?.error);
      alert(`Error deleting link: ${err.response?.data?.error?.message}`);
    }
  };

  const handleToggleVisibility = async (documentId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
  
      // Optimistically update the local state before making the request
      setLinks(prev =>
        prev.map(link =>
          link.documentId === documentId ? { ...link, hidden: newStatus } : link
        )
      );
  
      // Make the request to update the visibility in the backend
      const response = await axios.put(
        `${API_URL}/${documentId}`,
        { data: { hidden: newStatus } },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
  
      console.log("Update response:", response.data);
  
    } catch (err) {
      console.error("Error updating link visibility:", err.response?.data?.error);
      alert(`Error updating link: ${err.response?.data?.error?.message}`);
  
      // Revert the state back if there is an error
      setLinks(prev =>
        prev.map(link =>
          link.documentId === documentId ? { ...link, hidden: currentStatus } : link
        )
      );
    }
  };
  

  useEffect(() => {
    fetchUserAndLinks();
  }, [navigate]);

  if (isLoading) return <p>Loading...</p>;
  if (error)     return <p className="error">{error}</p>;

  return (
    <div className="adminUploadPage">
      <h1>Upload Special Content</h1>

      <div className="uploadSection">
        <input
          type="text"
          value={linkInput}
          onChange={e => setLinkInput(e.target.value)}
          placeholder="Enter link to upload"
          disabled={isUploading}
          className="linkInput"
        />
        <button
          onClick={handleLinkUpload}
          disabled={isUploading}
          className="uploadButton"
        >
          {isUploading ? "Uploading..." : "Upload Link"}
        </button>
      </div>

      <div className="linkGrid">
        {links.length > 0 ? (
          links.map(link => {
            const { documentId, url, metadata, hidden } = link;
            return (
              <div key={documentId} className={`linkCard ${hidden ? 'hidden-link' : ''}`}>
                <div className="thumbnailContainer">
                  <img
                    src={metadata.image}
                    alt={metadata.title}
                    className="linkThumbnail"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/300/200";
                    }}
                  />
                  {hidden && <div className="hiddenOverlay">Hidden</div>}
                </div>
                <div className="linkDetails">
                  <h3 className="linkTitle">{metadata.title}</h3>
                  {metadata.description && (
                    <p className="linkDescription">
                      {metadata.description.slice(0, 100)}
                      {metadata.description.length > 100 ? "…" : ""}
                    </p>
                  )}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkUrl"
                  >
                    Visit Link
                  </a>
                  <div className="actionButtons">
                    <button
                      onClick={() => handleToggleVisibility(documentId, hidden)}
                      className={`visibilityButton ${hidden ? 'show' : 'hide'}`}
                    >
                      {hidden ? "Show Link" : "Hide Link"}
                    </button>
                    <button
                      onClick={() => handleDeleteLink(documentId)}
                      className="deleteButton"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No links available.</p>
        )}
      </div>
    </div>
  );
};

export default AdUplink;