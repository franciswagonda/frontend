import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError(error.response?.data?.message || 'Failed to load dashboard stats');
            // Set default empty stats to prevent infinite loading
            setStats({
                totalProjects: 0,
                totalViews: 0,
                totalUsers: 0,
                activeUsers: 0,
                projectsByStatus: [],
                projectsByFaculty: [],
                trendingTechnologies: [],
                activeInnovators: [],
                recentActivity: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0e72acff 0%, #0cbde5ff 100%)', paddingBottom: '40px' }}>
            <Container className="pt-4">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="text-white mb-2">System Administrator Dashboard</h2>
                        <p className="text-white-50 mb-0">UCU Innovators Hub - Overview & Analytics</p>
                    </div>
                    <Button 
                        variant="outline-light"
                        size="sm"
                        onClick={() => navigate('/change-password')}
                    >
                        <i className="bi bi-key me-2"></i>Change Password
                    </Button>
                </div>

                {error && <Alert variant="warning" dismissible onClose={() => setError('')}>{error}</Alert>}

                {/* Top Stats Cards */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #0d6efd' }}>
                            <Card.Body>
                                <h2 className="mb-0 text-white">{stats.totalProjects}</h2>
                                <small className="text-muted">Total Projects</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #28a745' }}>
                            <Card.Body>
                                <h2 className="mb-0 text-success">{stats.totalViews}</h2>
                                <small className="text-muted">Total Views</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #ffc107' }}>
                            <Card.Body>
                                <h2 className="mb-0 text-warning">{stats.approvalRate}%</h2>
                                <small className="text-muted">Approval Rate</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #e91e63' }}>
                            <Card.Body>
                                <h2 className="mb-0" style={{ color: '#e91e63' }}>{stats.totalUsers || 0}</h2>
                                <small className="text-muted">Total Users</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Charts Row */}
                <Row className="mb-4">
                    {/* Projects by Status */}
                    <Col md={6}>
                        <Card className="shadow">
                            <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                                <h5 className="mb-0">Projects by Status</h5>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={stats.projectsByStatus}
                                            dataKey="count"
                                            nameKey="status"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {stats.projectsByStatus.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        entry.status === 'approved' ? '#28a745' :
                                                        entry.status === 'pending' ? '#ffc107' : '#dc3545'
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Projects by Faculty */}
                    <Col md={6}>
                        <Card className="shadow">
                            <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                                <h5 className="mb-0">Projects by Faculty</h5>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.projectsByFaculty}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="faculty" angle={-20} textAnchor="end" height={80} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#0d6efd" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Trending Technologies & Active Innovators */}
                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="shadow">
                            <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                                <h5 className="mb-0">Trending Technologies</h5>
                            </Card.Header>
                            <Card.Body>
                                {stats.trendingTech?.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.trendingTech} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#198754" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center">No data available</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="shadow">
                            <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                                <h5 className="mb-0">Most Active Innovators</h5>
                            </Card.Header>
                            <Card.Body style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {stats.activeInnovators?.length > 0 ? (
                                    <Table striped hover size="sm">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Student</th>
                                                <th>Projects</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.activeInnovators.map((innovator, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{innovator.studentName}</td>
                                                    <td><Badge bg="primary">{innovator.projectCount}</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-muted text-center">No data available</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Recent Activity */}
                <Card className="shadow">
                    <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                        <h5 className="mb-0">Recent Activity</h5>
                    </Card.Header>
                    <Card.Body>
                        {stats.recentProjects?.length > 0 ? (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Project Title</th>
                                        <th>Student</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentProjects.map(p => (
                                        <tr key={p.id}>
                                            <td><strong>{p.title}</strong></td>
                                            <td>{p.Student?.name}</td>
                                            <td><Badge bg="info">{p.category}</Badge></td>
                                            <td>
                                                <Badge bg={
                                                    p.status === 'approved' ? 'success' :
                                                    p.status === 'rejected' ? 'danger' : 'warning'
                                                }>
                                                    {p.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-muted text-center">No recent activity</p>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdminDashboard;
