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
    const [showDetailsModal, setShowDetailsModal] = useState(false);
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
                        <p className="text-white mb-0">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            variant="outline-light"
                            size="sm"
                            onClick={() => navigate('/profile')}
                        >
                            <i className="bi bi-person-circle me-2"></i>My Profile
                        </Button>
                        <Button 
                            variant="outline-light"
                            size="sm"
                            onClick={() => navigate('/change-password')}
                        >
                            <i className="bi bi-key me-2"></i>Change Password
                        </Button>
                    </div>
                </div>

                {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}

                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #ffc107' }}>
                            <Card.Body>
                                <h3 className="mb-0 text-warning">{pendingCount}</h3>
                                <small className="text-dark">Pending Review</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #28a745' }}>
                            <Card.Body>
                                <h3 className="mb-0 text-success">{approvedCount}</h3>
                                <small className="text-dark">Approved</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #dc3545' }}>
                            <Card.Body>
                                <h3 className="mb-0 text-danger">{rejectedCount}</h3>
                                <small className="text-dark">Rejected</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Projects Table */}
                <Card className="shadow">
                    <Card.Header style={{ backgroundColor: '#87CEEB', color: 'white' }}>
                        <h4 className="mb-0" style={{ fontWeight: 'bold', letterSpacing: '0.3px' }}>Assigned Projects</h4>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-white" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : projects.length === 0 ? (
                            <Alert variant="dark" className="text-white">No projects assigned to you yet.</Alert>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Student</th>
                                        <th>Category</th>
                                        <th>Technologies</th>
                                        <th>Status</th>
                                        <th>Feedback</th>
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
                                            <td>
                                                {project.feedback ? (
                                                    <small>{project.feedback}</small>
                                                ) : (
                                                    <small>—</small>
                                                )}
                                            </td>
                                            <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="info"
                                                    className="me-2"
                                                    onClick={() => {
                                                        setSelectedProject(project);
                                                        setShowDetailsModal(true);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="me-2"
                                                    onClick={() => openReviewModal(project, 'approved')}
                                                >
                                                    {project.status === 'approved' ? 'Re-Approve' : 'Approve'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => openReviewModal(project, 'rejected')}
                                                >
                                                    {project.status === 'rejected' ? 'Re-Reject' : 'Reject'}
                                                </Button>
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

            {/* Project Details Modal */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#87CEEB', color: 'white' }}>
                    <Modal.Title>Project Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProject && (
                        <div>
                            <h5>{selectedProject.title}</h5>
                            <hr />
                            <p><strong>Student:</strong> {selectedProject.Student?.name}</p>
                            <p><strong>Category:</strong> {selectedProject.category}</p>
                            <p><strong>Technologies:</strong> {selectedProject.technologies}</p>
                            <p><strong>Status:</strong> <Badge bg={
                                selectedProject.status === 'approved' ? 'success' :
                                selectedProject.status === 'rejected' ? 'danger' : 'warning'
                            }>{selectedProject.status.toUpperCase()}</Badge></p>
                            <p><strong>Submitted:</strong> {new Date(selectedProject.createdAt).toLocaleString()}</p>
                            <hr />
                            <h6>Description:</h6>
                            <p>{selectedProject.description}</p>
                            {selectedProject.github_link && (
                                <p><strong>GitHub:</strong> <a href={selectedProject.github_link} target="_blank" rel="noopener noreferrer">{selectedProject.github_link}</a></p>
                            )}
                            {selectedProject.document_url && (
                                <div className="mb-3">
                                    <strong>Document: </strong>
                                    <Button 
                                        size="sm" 
                                        variant="primary" 
                                        onClick={() => {
                                            const url = selectedProject.document_url.startsWith('http') 
                                                ? selectedProject.document_url 
                                                : `http://localhost:5000/${selectedProject.document_url}`;
                                            window.open(url, '_blank');
                                        }}
                                    >
                                        <i className="bi bi-file-earmark-text me-1"></i>View Document
                                    </Button>
                                </div>
                            )}
                            {selectedProject.feedback && (
                                <>
                                    <hr />
                                    <h6>Feedback:</h6>
                                    <p className="text-muted">{selectedProject.feedback}</p>
                                </>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SupervisorDashboard;
