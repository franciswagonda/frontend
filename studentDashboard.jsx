import React from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
    const myProjects = [
        { id: 1, title: "Smart Campus App", status: "In Progress" },
        { id: 2, title: "E-Learning Platform", status: "Completed" },
        { id: 3, title: "Campus Navigation System", status: "Not Started" },
    ];

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Student Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your projects and view your progress.</p>
            </div>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/submit" className="btn-primary">+ New Project</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ color: '#f39c12' }}>1</h3>
                    <p>Needs Revision</p>
                </div>
                <div className="card">
                    <h3 style={{ color: '#27ae60' }}>2</h3>
                    <p>Approved Projects</p>
                </div>
            </div>
            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>My Projects</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', padding: '0.5rem' }}>Title</th>
                            <th style={{ borderBottom: '2px solid #ddd', textAlign: 'left', padding: '0.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myProjects.map((project) => (
                            <tr key={project.id}>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>{project.title}</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>{project.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDashboard;


