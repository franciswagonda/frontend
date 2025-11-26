import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        technologies: '',
        github_link: '',
        image_url: ''
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = [
        'Agricultural Biotechnology',
        'Precision Agriculture',
        'Soil & Water Conservation',
        'Food Processing & Safety',
        'Robotics & Automation',
        'Mechanical & Civil Engineering',
        'Electrical & Electronics',
        'Product Design & Development',
        'Health Informatics',
        'Medical Equipment Development',
        'Community Health',
        'Laboratory Research',
        'Software Development',
        'Cloud Computing & Cybersecurity',
        'Mobile App Development',
        'AI & Machine Learning',
        'Environmental Conservation',
        'Renewable Energy',
        'Educational Technology',
        'Business Analytics',
        'Smart Cities',
        'Interdisciplinary Projects',
        'Other'
    ];

    useEffect(() => {
        fetchMyProjects();
    }, []);

    const fetchMyProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching projects with token:', token ? 'exists' : 'missing');
            const res = await axios.get('http://localhost:5000/api/projects/my-projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Projects fetched:', res.data);
            console.log('Number of projects:', res.data.length);
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            console.error('Error response:', err.response?.data);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (file) {
            data.append('document', file);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/projects', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('Project submitted successfully! It will be reviewed by your supervisor.');
            setShowForm(false);
            setFormData({ title: '', description: '', category: '', technologies: '', github_link: '', image_url: '' });
            setFile(null);
            fetchMyProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting project');
        } finally {
            setLoading(false);
        }
    };

    const statusCounts = {
        pending: projects.filter(p => p.status === 'pending').length,
        approved: projects.filter(p => p.status === 'approved').length,
        rejected: projects.filter(p => p.status === 'rejected').length
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #051738ff 0%, #1e1f72ff 100%)', paddingBottom: '40px' }}>
            <Container className="pt-4">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="text-white mb-2">Student Dashboard</h2>
                        <p className="text-white-50 mb-0">Welcome back, {user?.name}!</p>
                    </div>
                    <Button 
                        variant="outline-light"
                        size="sm"
                        onClick={() => navigate('/change-password')}
                    >
                        <i className="bi bi-key me-2"></i>Change Password
                    </Button>
                </div>

                {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

                {/* Quick Stats */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #0d6efd' }}>
                            <Card.Body>
                                <h3 className="mb-0">{projects.length}</h3>
                                <small className="text-muted">Total Projects</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #ffc107' }}>
                            <Card.Body>
                                <h3 className="mb-0">{statusCounts.pending}</h3>
                                <small className="text-muted">Pending Review</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #28a745' }}>
                            <Card.Body>
                                <h3 className="mb-0">{statusCounts.approved}</h3>
                                <small className="text-muted">Approved</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #dc3545' }}>
                            <Card.Body>
                                <h3 className="mb-0">{statusCounts.rejected}</h3>
                                <small className="text-muted">Rejected</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Submit New Project Button */}
                <Card className="mb-4 shadow">
                    <Card.Body>
                        <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={() => setShowForm(!showForm)} 
                            disabled={loading}
                            style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            {showForm ? 'Cancel Submission' : 'Submit New Project'}
                        </Button>
                    </Card.Body>
                </Card>

                {/* Project Submission Form */}
                {showForm && (
                    <Card className="mb-4 shadow">
                        <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                            <h5 className="mb-0">Submit New Innovation Project</h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project Title *</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleChange} 
                                        placeholder="Enter your project title"
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description *</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange}
                                        placeholder="Describe your innovation project..."
                                        required 
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category *</Form.Label>
                                            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Technologies Used *</Form.Label>
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

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>GitHub Repository</Form.Label>
                                            <Form.Control 
                                                type="url" 
                                                name="github_link" 
                                                value={formData.github_link} 
                                                onChange={handleChange} 
                                                placeholder="https://github.com/username/repo"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Project Image URL</Form.Label>
                                            <Form.Control 
                                                type="url" 
                                                name="image_url" 
                                                value={formData.image_url} 
                                                onChange={handleChange} 
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Project Documentation (PDF)</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        accept=".pdf" 
                                        onChange={handleFileChange}
                                    />
                                    <Form.Text className="text-muted">Upload your project documentation (optional)</Form.Text>
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                                >
                                    {loading ? 'Submitting...' : 'Submit Project for Review'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                )}

                {/* My Projects List */}
                <Card className="shadow">
                    <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                        <h5 className="mb-0">My Projects</h5>
                    </Card.Header>
                    <Card.Body>
                        {projects.length === 0 ? (
                            <Alert variant="info">
                                You haven't submitted any projects yet. Click "Submit New Project" to get started!
                            </Alert>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                        <th>Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => (
                                        <tr key={project.id}>
                                            <td><strong>{project.title}</strong></td>
                                            <td>{project.category}</td>
                                            <td>
                                                <Badge bg={
                                                    project.status === 'approved' ? 'success' :
                                                    project.status === 'rejected' ? 'danger' : 'warning'
                                                }>
                                                    {project.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {project.feedback ? (
                                                    <small className="text-muted">{project.feedback}</small>
                                                ) : (
                                                    <small className="text-muted">No feedback yet</small>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default StudentDashboard;
