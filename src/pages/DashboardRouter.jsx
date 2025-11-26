import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import SupervisorDashboard from './dashboards/SupervisorDashboard';
import FacultyAdminDashboard from './dashboards/FacultyAdminDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    console.log('DashboardRouter - User:', user);
    console.log('DashboardRouter - User role:', user?.role);

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">Please login to access the dashboard.</div>
            </div>
        );
    }

    // Route to the appropriate dashboard based on user role
    switch (user.role) {
        case 'student':
            return <StudentDashboard />;
        case 'supervisor':
            return <SupervisorDashboard />;
        case 'faculty_admin':
            return <FacultyAdminDashboard />;
        case 'admin':
            return <AdminDashboard />;
        default:
            return (
                <div className="container mt-5">
                    <div className="alert alert-danger">Invalid user role.</div>
                </div>
            );
    }
};

export default Dashboard;
