// src/pages/AdminDashboard.jsx
import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Projects', value: '42', color: '#007bff' },
    { label: 'Students', value: '87', color: '#28a745' },
    { label: 'Supervisors', value: '15', color: '#ffc107' },
    { label: 'Approval Rate', value: '92%', color: '#17a2b8' }
  ];

  const recentActivities = [
    { action: 'New project submitted', user: 'KEJJE TEKA', time: '2 hours ago' },
    { action: 'Project approved', user: 'SIR LAWRENCE', time: '4 hours ago' },
    { action: 'User registered', user: 'FRANCIS PRECIOUS', time: '1 day ago' }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <h3 style={{ color: stat.color, fontSize: '2em' }}>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2>Quick Actions</h2>
        <div style={styles.actions}>
          <button style={styles.actionBtn}>👥 Manage Users</button>
          <button style={styles.actionBtn}>📊 View Reports</button>
          <button style={styles.actionBtn}>⚙ Settings</button>
          <button style={styles.actionBtn}>📧 Send Announcement</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.section}>
        <h2>Recent Activity</h2>
        <div style={styles.activityList}>
          {recentActivities.map((activity, index) => (
            <div key={index} style={styles.activityItem}>
              <div style={styles.activityIcon}>●</div>
              <div>
                <p style={styles.activityText}>{activity.action}</p>
                <p style={styles.activityMeta}>
                  by {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div style={styles.systemInfo}>
        <h3>System Information</h3>
        <p>Frontend: React 18 • Backend: Ready for integration</p>
        <p>Last updated: Today, 10:30 AM</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  title: {
    marginBottom: '30px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  section: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    background: '#f8f9fa',
    border: '1px solid #ddd',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  activityList: {
    marginTop: '15px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 0',
    borderBottom: '1px solid #eee'
  },
  activityIcon: {
    color: '#28a745',
    fontSize: '20px'
  },
  activityText: {
    fontWeight: 'bold',
    margin: 0
  },
  activityMeta: {
    color: '#666',
    margin: 0,
    fontSize: '14px'
  },
  systemInfo: {
    background: '#e9ecef',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
    textAlign: 'center'
  }
};

export default AdminDashboard;