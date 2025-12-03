import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const FacultyAdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student', department_id: '', alternativeEmail: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.faculty_id) {
            fetchFacultyData();
        }
    }, [user]);

    const fetchFacultyData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            console.log('Fetching data for faculty_id:', user.faculty_id);
            
            // Fetch users in my faculty
            const usersRes = await axios.get('http://localhost:5000/api/users', config);
            setUsers(usersRes.data);

            // Fetch departments in my faculty
            const deptUrl = `http://localhost:5000/api/departments?faculty_id=${user.faculty_id}`;
            console.log('Fetching departments from:', deptUrl);
            const deptRes = await axios.get(deptUrl);
            console.log('Departments fetched:', deptRes.data);
            console.log('Departments count:', deptRes.data.length);
            setDepartments(deptRes.data);

            // Fetch projects in my faculty
            const projectsRes = await axios.get('http://localhost:5000/api/projects/faculty/my-projects', config);
            setProjects(projectsRes.data);
        } catch (err) {
            console.error('Error fetching faculty data:', err);
            console.error('Error details:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/register', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User created successfully! They will receive an email with their login credentials.');
            setShowUserModal(false);
            setNewUser({ name: '', email: '', role: 'student', department_id: '', alternativeEmail: '' });
            fetchFacultyData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating user');
        } finally {
            setLoading(false);
        }
    };

    const studentUsers = users.filter(u => u.role === 'student');
    const supervisorUsers = users.filter(u => u.role === 'supervisor');
    const studentCount = studentUsers.length;
    const supervisorCount = supervisorUsers.length;
    const pendingProjects = projects.filter(p => p.status === 'pending').length;
    const approvedProjects = projects.filter(p => p.status === 'approved').length;

    // User actions
    const handleDeactivate = async (userId) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User deactivated successfully.');
            fetchFacultyData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deactivating user');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (userId) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/users/${userId}/reactivate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User activated successfully.');
            fetchFacultyData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error activating user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${userId}?permanent=true`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User deleted successfully.');
            fetchFacultyData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #051738ff 0%, #1e1f72ff 100%)', paddingBottom: '40px' }}>
            <Container className="pt-4">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="text-white mb-2">Faculty Admin Dashboard</h2>
                        <h4 className="text-white mb-0" style={{ fontWeight: 'bold' }}>Welcome back, {user?.name}!</h4>
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

                {/* Stats Cards */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #0d6efd' }}>
                            <Card.Body>
                                <h3 className="mb-0">{studentCount}</h3>
                                <small className="text-muted">Students</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #6610f2' }}>
                            <Card.Body>
                                <h3 className="mb-0">{supervisorCount}</h3>
                                <small className="text-muted">Supervisors</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #ffc107' }}>
                            <Card.Body>
                                <h3 className="mb-0">{pendingProjects}</h3>
                                <small className="text-muted">Pending Projects</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow" style={{ borderTop: '4px solid #28a745' }}>
                            <Card.Body>
                                <h3 className="mb-0">{approvedProjects}</h3>
                                <small className="text-muted">Approved Projects</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Create User Button */}
                <Card className="mb-4 shadow">
                    <Card.Body>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setShowUserModal(true)}
                            style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                        >
                            <i className="bi bi-person-plus me-2"></i>
                            Create New User
                        </Button>
                    </Card.Body>
                </Card>

                {/* Students Table */}
                <Card className="shadow mb-4">
                    <Card.Header style={{ backgroundColor: '#87CEEB', color: 'white' }}>
                        <h5 className="mb-0">Students</h5>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-white" role="status" />
                            </div>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Access Number</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentUsers.map(u => (
                                        <tr key={u.id}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td><code>{u.accessNumber}</code></td>
                                            <td>
                                                <Badge bg={u.active ? 'success' : 'danger'}>
                                                    {u.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td>
                                                {u.active ? (
                                                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleDeactivate(u.id)}>
                                                        Deactivate
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="success" className="me-2" onClick={() => handleActivate(u.id)}>
                                                        Activate
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>

                {/* Supervisors Table */}
                <Card className="shadow mb-4">
                    <Card.Header style={{ backgroundColor: '#00BFFF', color: 'white' }}>
                        <h5 className="mb-0">Supervisors</h5>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-white" role="status" />
                            </div>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supervisorUsers.map(u => (
                                        <tr key={u.id}>
                                            <td><strong>{u.name}</strong></td>
                                            <td>{u.email}</td>
                                            <td>
                                                <Badge bg={u.active ? 'success' : 'danger'}>
                                                    {u.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td>
                                                {u.active ? (
                                                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleDeactivate(u.id)}>
                                                        Deactivate
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="success" className="me-2" onClick={() => handleActivate(u.id)}>
                                                        Activate
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>

                {/* Projects Table */}
                <Card className="shadow">
                    <Card.Header style={{ backgroundColor: '#87CEEB', color: 'white' }}>
                        <h4 className="mb-0" style={{ fontWeight: 'bold' }}>Faculty Projects</h4>
                    </Card.Header>
                    <Card.Body>
                        {projects.length === 0 ? (
                            <Alert variant="info">No projects yet.</Alert>
                        ) : (
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Student</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(p => (
                                        <tr key={p.id}>
                                            <td><strong>{p.title}</strong></td>
                                            <td>{p.Student?.name}</td>
                                            <td>{p.category}</td>
                                            <td>
                                                <Badge bg={
                                                    p.status === 'approved' ? 'success' :
                                                    p.status === 'rejected' ? 'danger' : 'warning'
                                                }>
                                                    {p.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Create User Modal */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#051738ff', color: 'white' }}>
                    <Modal.Title>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name *</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        {/* Faculty Admin creates STUDENTS only from dashboard */}
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control readOnly value="student" />
                            <Form.Text className="text-muted">Students are created from the dashboard. Supervisors should be created from Admin &gt; Users.</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Department *</Form.Label>
                            {departments.length === 0 && <small className="text-danger d-block mb-1">No departments found. Faculty ID: {user?.faculty_id}</small>}
                            <Form.Select
                                value={newUser.department_id}
                                onChange={(e) => setNewUser({ ...newUser, department_id: e.target.value })}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Alert variant="info" className="small">
                            An access number and temporary password will be automatically generated and sent to the student's UCU email.
                        </Alert>
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FacultyAdminDashboard;
