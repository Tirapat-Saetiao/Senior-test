import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { GOOGLE_CLIENT_ID, authUtils, MESSAGES } from "./constants/config";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminUplode from './Pages/Admin/AdminUplode';
import AdUplink from "./Pages/Admin/AdUplink";
import Linkuplode from "./Pages/Admin/Linkuplode";
import PrivateRoute from './Pages/Admin/PrivateRoute';
import AIArticle from "./Pages/User/AIArticle";
import AIWork from "./Pages/User/AIWork";
import AIWorkdetail from "./Pages/User/AIWorkdetail";
import Contact from "./Pages/User/Contact";
import GenAI from "./Pages/User/GenAI";
import LandingPage from "./Pages/User/LandingPage";
import Home from "./Pages/User/Home";
import LoginPage from "./Pages/User/Login";
import ProfilePage from "./Pages/User/ProfilePage";
import SpecialBlog from "./Pages/User/SpecialBlog";
import Tools from "./Pages/User/Tools";
import Workflow from "./Pages/User/Workflow";
import ProtectedRoute from "./ProtectedRoute";
import Button from "./Pages/User/button";


const clientId = GOOGLE_CLIENT_ID;

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const adminToken = sessionStorage.getItem("admin_jwt");

    if ((storedUser && authUtils.isEmailAllowed(storedUser.email)) || adminToken) {
      setLoggedIn(true);
      setUserData(storedUser || null);
      
      // Only redirect to home if user is already logged in AND hasn't been redirected yet
      // Also check if we're currently on the landing page to avoid unnecessary redirects
      if (storedUser && !adminToken && !hasRedirected ) {
        navigate("/home");
        setHasRedirected(true);
      }
    } else {
      // Ensure user is logged out if no valid session
      setLoggedIn(false);
      setUserData(null);
    }
    setInitialized(true);
  }, [navigate, hasRedirected]);

  const handleLogin = (user) => {
    if (authUtils.isEmailAllowed(user.email)) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setLoggedIn(true);
      setUserData(user);
      setHasRedirected(false); // Reset redirect flag for new login
      
      // Redirect to home page for all users
      navigate("/home");
      setHasRedirected(true);
    } else {
      alert(MESSAGES.ACCESS_DENIED);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("admin_jwt");
    sessionStorage.removeItem("admin_user");
    setLoggedIn(false);
    setUserData(null);
    setHasRedirected(false); // Reset redirect flag
    navigate("/login", { replace: true }); // Redirect to landing page, not home
    setTimeout(() => setIsLoggingOut(false), 500);
  };

  return (
    <div className="App">
      <Button />
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
      {initialized && (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ai-article" element={<AIArticle />} />
          <Route path="/ai-work" element={<AIWork />} />
          <Route path="/gen-ai" element={<GenAI />} />
          <Route path="/workflow" element={<Workflow />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/login" element={
            loggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } />
          <Route path="/post/:id" element={<AIWorkdetail />} />
          <Route path="/profile" element={
            <ProtectedRoute isLoggingOut={isLoggingOut}>
              <ProfilePage userData={userData} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          <Route path="/admin-login" element={<AdminLogin setLoggedIn={setLoggedIn} />} />
          <Route path="/admin-uplode" element={<PrivateRoute><AdminUplode /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/AdUplink" element={<PrivateRoute><AdUplink /></PrivateRoute>} />
          <Route path="/Linkuplode" element={<PrivateRoute><Linkuplode /></PrivateRoute>} />
          <Route path="/special-blog" element={
            <ProtectedRoute isLoggingOut={isLoggingOut}>
              <SpecialBlog />
            </ProtectedRoute>
          } />
          
          
          
        </Routes>
      )}
      <Footer />
    </div>
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default AppWithRouter;
