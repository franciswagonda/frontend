import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const SupervisorDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [reviewAction, setReviewAction] = useState('');

    useEffect(() => {
        fetchPendingProjects();
    }, []);

    const fetchPendingProjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/projects/faculty/my-projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Supervisors now see all projects from their department
            setProjects(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (project, action) => {
        setSelectedProject(project);
        setReviewAction(action);
        setShowModal(true);
    };

    const handleReview = async () => {
        if (!selectedProject) return;

        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:5000/api/projects/${selectedProject.id}/review`,
                { status: reviewAction, feedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`Project ${reviewAction} successfully!`);
            setShowModal(false);
            setFeedback('');
            fetchPendingProjects();
        } catch (error) {
            console.error(error);
            setMessage('Error reviewing project');
        }
    };

    const pendingCount = projects.filter(p => p.status === 'pending').length;
    const approvedCount = projects.filter(p => p.status === 'approved').length;
    const rejectedCount = projects.filter(p => p.status === 'rejected').length;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #051738ff 0%, #1e1f72ff 100%)', paddingBottom: '40px' }}>
            <Container className="pt-4">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="text-white mb-2">Supervisor Dashboard</h2>
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

                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #ffc107' }}>
                            <Card.Body>
                                <h3 className="mb-0 text-warning">{pendingCount}</h3>
                                <small className="text-muted">Pending Review</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #28a745' }}>
                            <Card.Body>
                                <h3 className="mb-0 text-success">{approvedCount}</h3>
                                <small className="text-muted">Approved</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #dc3545' }}>
                            <Card.Body>
                                <h3 className="mb-0 text-danger">{rejectedCount}</h3>
                                <small className="text-muted">Rejected</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Projects Table */}
                <Card className="shadow">
                    <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                        <h5 className="mb-0">Assigned Projects</h5>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : projects.length === 0 ? (
                            <Alert variant="info">No projects assigned to you yet.</Alert>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Student</th>
                                        <th>Category</th>
                                        <th>Technologies</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => (
                                        <tr key={project.id}>
                                            <td><strong>{project.title}</strong></td>
                                            <td>{project.Student?.name || 'Unknown'}</td>
                                            <td><Badge bg="info">{project.category}</Badge></td>
                                            <td><small>{project.technologies}</small></td>
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
                                                {project.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            className="me-2"
                                                            onClick={() => openReviewModal(project, 'approved')}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => openReviewModal(project, 'rejected')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {project.status !== 'pending' && (
                                                    <small className="text-muted">Reviewed</small>
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

            {/* Review Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#051738ff', color: 'white' }}>
                    <Modal.Title>
                        {reviewAction === 'approved' ? 'Approve Project' : 'Reject Project'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Project:</strong> {selectedProject?.title}</p>
                    <p><strong>Student:</strong> {selectedProject?.Student?.name}</p>
                    <Form.Group className="mt-3">
                        <Form.Label>Feedback {reviewAction === 'rejected' && '(Required)'}:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder={reviewAction === 'approved' 
                                ? 'Optional: Provide feedback or suggestions...' 
                                : 'Please provide a reason for rejection...'}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant={reviewAction === 'approved' ? 'success' : 'danger'}
                        onClick={handleReview}
                        disabled={reviewAction === 'rejected' && !feedback.trim()}
                    >
                        {reviewAction === 'approved' ? 'Approve Project' : 'Reject Project'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SupervisorDashboard;
