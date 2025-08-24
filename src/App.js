import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import Home from "./Pages/User/Home";
import LoginPage from "./Pages/User/Login";
import ProfilePage from "./Pages/User/ProfilePage";
import SpecialBlog from "./Pages/User/SpecialBlog";
import Tools from "./Pages/User/Tools";
import Workflow from "./Pages/User/Workflow";
import ProtectedRoute from "./ProtectedRoute";
import StaffDash from "./Pages/User/StaffDash";
import StudenDash from "./Pages/User/StudenDash";


const clientId = "1051486378939-b9jdhnev5o10pvn2kgo6h5iu7h6757ej.apps.googleusercontent.com"

// ✅ Updated to support multiple domains
const allowedDomains = ["@lamduan.mfu.ac.th", "@mfu.ac.th"];
const isEmailAllowed = (email) =>
  allowedDomains.some((domain) => email.endsWith(domain));

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

    if ((storedUser && isEmailAllowed(storedUser.email)) || adminToken) {
      setLoggedIn(true);
      setUserData(storedUser || null);
      
      // Only redirect to appropriate dashboard if user is already logged in AND hasn't been redirected yet
      if (storedUser && !adminToken && !hasRedirected) {
        const userEmail = storedUser.email;
        if (userEmail.endsWith("@lamduan.mfu.ac.th")) {
          navigate("/student-dash");
          setHasRedirected(true);
        } else if (userEmail.endsWith("@mfu.ac.th")) {
          navigate("/staff-dash");
          setHasRedirected(true);
        }
      }
    }
    setInitialized(true);
  }, [navigate, hasRedirected]);

  const handleLogin = (user) => {
    if (isEmailAllowed(user.email)) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setLoggedIn(true);
      setUserData(user);
      setHasRedirected(false); // Reset redirect flag for new login
      
      // Redirect based on email domain
      if (user.email.endsWith("@lamduan.mfu.ac.th")) {
        navigate("/student-dash");
        setHasRedirected(true);
      } else if (user.email.endsWith("@mfu.ac.th")) {
        navigate("/staff-dash");
        setHasRedirected(true);
      }
    } else {
      alert("Access Denied: Only @lamduan.mfu.ac.th or @mfu.ac.th emails can log in.");
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
    navigate("/login", { replace: true });
    setTimeout(() => setIsLoggingOut(false), 500);
  };

  return (
    <div className="App">
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
      {initialized && (
        <Routes>
          <Route path="/" element={
            loggedIn && !hasRedirected ? (
              (() => {
                if (userData?.email?.endsWith("@lamduan.mfu.ac.th")) {
                  return <Navigate to="/student-dash" replace />;
                } else if (userData?.email?.endsWith("@mfu.ac.th")) {
                  return <Navigate to="/staff-dash" replace />;
                }
                return <Navigate to="/home" replace />;
              })()
            ) : (
              <Navigate to="/home" replace />
            )
          } />
          <Route path="/home" element={<Home />} />
          <Route path="/ai-article" element={<AIArticle />} />
          <Route path="/ai-work" element={<AIWork />} />
          <Route path="/gen-ai" element={<GenAI />} />
          <Route path="/workflow" element={<Workflow />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/login" element={
            loggedIn && !hasRedirected ? (
              (() => {
                if (userData?.email?.endsWith("@lamduan.mfu.ac.th")) {
                  return <Navigate to="/student-dash" replace />;
                } else if (userData?.email?.endsWith("@mfu.ac.th")) {
                  return <Navigate to="/staff-dash" replace />;
                }
                return <Navigate to="/home" replace />;
              })()
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
          <Route path="/student-dash" element={
            <ProtectedRoute isLoggingOut={isLoggingOut}>
              <StudenDash />
            </ProtectedRoute>
          } />
          <Route path="/staff-dash" element={
            <ProtectedRoute isLoggingOut={isLoggingOut}>
              <StaffDash />
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
