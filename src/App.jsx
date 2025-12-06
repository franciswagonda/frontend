
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
// Registration removed: users are provisioned by admin
import UserManagement from './pages/UserManagement';
import DashboardRouter from './pages/DashboardRouter';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

// Redirect authenticated users away from public pages
function PublicRoute({ children }) {
    const { user } = useContext(AuthContext);
    return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppContent() {
    const location = useLocation();
    const hideNavbarRoutes = ['/login', '/forgot-password', '/reset-password'];

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && 
             !location.pathname.startsWith('/reset-password/') && <Navigation />}
            <Routes>
                <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                {/* Removed public registration route */}
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
            </Routes>
        </>
    );
}

export default App;
