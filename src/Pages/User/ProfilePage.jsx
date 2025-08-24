import React from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/ProfilePage.css"; 

const ProfilePage = ({ userData, onLogout }) => {


  if (!userData) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <img src={userData.picture} alt="Profile" className="profile-pic" />
        <h3>{userData.name}</h3>
        <p>Email: {userData.email}</p>
      </div>
    
    </div>
  );
};

export default ProfilePage;
