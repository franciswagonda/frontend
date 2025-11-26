import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Badge } from 'react-bootstrap';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        technologies: '',
        github_link: '',
        supervisor_id: 1
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                if (user.role === 'admin') {
                    const res = await axios.get('http://localhost:5000/api/dashboard/stats', config);
                    setStats(res.data);
                } else if (user.role === 'supervisor') {
                    // Fetch pending projects for supervisor to review
                    const res = await axios.get('http://localhost:5000/api/projects', config);
                    setProjects(res.data.filter(p => p.status === 'pending' && p.supervisor_id === user.id));
                }
            } catch (error) {
                console.error(error);
                setMessage('Error loading data');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (file) {
            data.append('document', file);
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/projects', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('Project submitted successfully!');
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                category: '',
                technologies: '',
                github_link: '',
                supervisor_id: 1
            });
            setFile(null);
        } catch (error) {
            setMessage('Error submitting project');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (projectId, status, feedback = '') => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:5000/api/projects/${projectId}/review`,
                { status, feedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`Project ${status} successfully!`);
            // Remove from list
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (error) {
            setMessage('Error reviewing project');
            console.error(error);
        }
    };

    return (
        <Container className="mt-4">
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name} ({user?.role})</p>

            {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

            {/* Admin Dashboard */}
            {user?.role === 'admin' && stats && (
                <>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card className="text-center bg-primary text-white mb-3">
                                <Card.Body>
                                    <h3>{stats.totalProjects}</h3>
                                    <Card.Text>Total Projects</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="text-center bg-success text-white mb-3">
                                <Card.Body>
                                    <h3>{stats.totalViews}</h3>
                                    <Card.Text>Total Public Views</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="text-center bg-warning text-dark mb-3">
                                <Card.Body>
                                    <h3>{stats.approvalRate}%</h3>
                                    <Card.Text>Approval Rate</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={8}>
                            {/* Projects by Status Chart */}
                            <Card className="mb-3">
                                <Card.Header>Projects by Status</Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={stats.projectsByStatus}
                                                dataKey="count"
                                                nameKey="status"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {stats.projectsByStatus.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={entry.status === 'approved' ? '#28a745' : entry.status === 'pending' ? '#ffc107' : '#dc3545'}
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
                    </Row>

                    <Row className="mb-4">
                        {/* Projects by Faculty Chart */}
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Header>Projects by Faculty</Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stats.projectsByFaculty}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="faculty" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" fill="#0d6efd" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Trending Technologies */}
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Header>Trending Technologies</Card.Header>
                                <Card.Body>
                                    {stats.trendingTech?.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={stats.trendingTech} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="name" type="category" width={100} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" fill="#198754" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-muted">No data available</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        {/* Most Active Innovators */}
                        <Col md={6}>
                            <Card className="mb-4">
                                <Card.Header>Most Active Innovators</Card.Header>
                                <Card.Body>
                                    {stats.activeInnovators?.length > 0 ? (
                                        <Table striped bordered hover size="sm">
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
                                        <p className="text-muted">No data available</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Recent Activity */}
                        <Col md={6}>
                            <Card>
                                <Card.Header>Recent Activity</Card.Header>
                                <Card.Body>
                                    {stats.recentProjects?.length > 0 ? (
                                        <ul className="list-unstyled">
                                            {stats.recentProjects.map(p => (
                                                <li key={p.id} className="mb-2 pb-2 border-bottom">
                                                    <strong>{p.title}</strong>
                                                    <br />
                                                    <small className="text-muted">by {p.Student?.name}</small>
                                                    {' '}
                                                    <Badge bg={p.status === 'approved' ? 'success' : p.status === 'rejected' ? 'danger' : 'warning'}>
                                                        {p.status}
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted">No recent activity</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {/* Supervisor Dashboard */}
            {user?.role === 'supervisor' && (
                <div>
                    <h3 className="mb-3">Projects Pending Review</h3>
                    {loading ? (
                        <Alert variant="info">Loading...</Alert>
                    ) : projects.length === 0 ? (
                        <Alert variant="success">No projects pending review!</Alert>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Student</th>
                                    <th>Category</th>
                                    <th>Technologies</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(project => (
                                    <tr key={project.id}>
                                        <td>{project.title}</td>
                                        <td>{project.Student?.name}</td>
                                        <td><Badge bg="info">{project.category}</Badge></td>
                                        <td>{project.technologies}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="success"
                                                className="me-2"
                                                onClick={() => handleReview(project.id, 'approved')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => {
                                                    const feedback = prompt('Rejection reason:');
                                                    if (feedback) handleReview(project.id, 'rejected', feedback);
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}

            {/* Student Dashboard */}
            {/* Student Dashboard */}
            {user?.role === 'student' && (
                <>
                    <Button variant="success" className="mb-3" onClick={() => setShowForm(!showForm)} disabled={loading}>
                        {showForm ? 'Cancel' : 'Submit New Project'}
                    </Button>

                    {showForm && (
                        <Card className="mb-4 p-3">
                            <h4>Submit Project</h4>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Title</Form.Label>
                                    <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                                <option value="">Select Category</option>
                                                <option value="Agricultural Biotechnology">Agricultural Biotechnology</option>
                                                <option value="Precision Agriculture">Precision Agriculture</option>
                                                <option value="Soil & Water Conservation">Soil & Water Conservation</option>
                                                <option value="Food Processing & Safety">Food Processing & Safety</option>
                                                <option value="Robotics & Automation">Robotics & Automation</option>
                                                <option value="Mechanical & Civil Engineering">Mechanical & Civil Engineering</option>
                                                <option value="Electrical & Electronics">Electrical & Electronics</option>
                                                <option value="Product Design & Development">Product Design & Development</option>
                                                <option value="Health Informatics">Health Informatics</option>
                                                <option value="Medical Equipment Development">Medical Equipment Development</option>
                                                <option value="Community Health">Community Health</option>
                                                <option value="Laboratory Research">Laboratory Research</option>
                                                <option value="Software Development">Software Development</option>
                                                <option value="Cloud Computing & Cybersecurity">Cloud Computing & Cybersecurity</option>
                                                <option value="Mobile App Development">Mobile App Development</option>
                                                <option value="AI & Machine Learning">AI & Machine Learning</option>
                                                <option value="Environmental Conservation">Environmental Conservation</option>
                                                <option value="Renewable Energy">Renewable Energy</option>
                                                <option value="Educational Technology">Educational Technology</option>
                                                <option value="Business Analytics">Business Analytics</option>
                                                <option value="Smart Cities">Smart Cities</option>
                                                <option value="Interdisciplinary Projects">Interdisciplinary Projects</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Technologies (comma-separated)</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                name="technologies" 
                                                value={formData.technologies} 
                                                onChange={handleChange}
                                                placeholder="e.g. React, Node.js, MySQL"
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>GitHub Link (optional)</Form.Label>
                                    <Form.Control type="url" name="github_link" value={formData.github_link} onChange={handleChange} placeholder="https://github.com/username/repo" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Document (PDF)</Form.Label>
                                    <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
                                    <Form.Text className="text-muted">Optional: Upload project documentation</Form.Text>
                                </Form.Group>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Project'}
                                </Button>
                            </Form>
                        </Card>
                    )}
                </>
            )}
        </Container>
    );
};

export default Dashboard;
