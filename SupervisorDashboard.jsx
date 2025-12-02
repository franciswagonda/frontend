import React, { useState } from 'react';

const SupervisorDashboard = () => {
  const [projects, setProjects] = useState([
    { id: 1, title: 'AI Chatbot', student: 'Isaac Kayemba', date: 'Jan 18, 2024' },
    { id: 2, title: 'Mobile Game', student: 'Fridah Lala', date: 'Jan 17, 2024' },
    { id: 3, title: 'IoT System', student: 'Beniter Alchemy', date: 'Jan 16, 2024' }
  ]);

  const handleApprove = (id) => {
    alert(`Project ${id} approved!`);
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleReject = (id) => {
    alert(`Project ${id} needs revision.`);
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Supervisor Dashboard</h1>
      
      <div style={styles.card}>
        <h2>Projects Pending Review ({projects.length})</h2>
        
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project.id} style={styles.projectCard}>
              <div>
                <h3>{project.title}</h3>
                <p><strong>Student:</strong> {project.student}</p>
                <p><strong>Submitted:</strong> {project.date}</p>
              </div>
              
              <div style={styles.buttons}>
                <button 
                  onClick={() => handleApprove(project.id)}
                  style={styles.approveBtn}
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => handleReject(project.id)}
                  style={styles.rejectBtn}
                >
                  ✗ Reject
                </button>
                <button style={styles.detailsBtn}>
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noProjects}>No projects to review! 🎉</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    marginBottom: '30px'
  },
  card: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  projectCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttons: {
    display: 'flex',
    gap: '10px'
  },
  approveBtn: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  rejectBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  detailsBtn: {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  noProjects: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '18px'
  }
};

export default SupervisorDashboard;