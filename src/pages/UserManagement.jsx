import { useContext, useEffect, useState } from 'react';
import { Container, Card, Form, Button, Table, Alert, Row, Col, Badge, Spinner, Modal } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const UserManagement = () => {
  const { user, createUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    personalEmail: '',
    role: 'faculty_admin',
    faculty_id: '',
    department_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch users
        const usersRes = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);
        
        // Fetch faculties and departments
        const facultiesRes = await axios.get('http://localhost:5000/api/faculties');
        setFaculties(facultiesRes.data);
        
        const departmentsRes = await axios.get('http://localhost:5000/api/departments');
        setDepartments(departmentsRes.data);
        
      } catch (e) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    if (user && ['admin', 'faculty_admin'].includes(user.role)) {
      fetchData();
    }
  }, [user]);

  // Set default faculty for faculty_admin
  useEffect(() => {
    if (user && user.role === 'faculty_admin' && user.faculty_id) {
      setFormData(prev => ({ ...prev, faculty_id: user.faculty_id }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (!formData.name || !formData.email || !formData.personalEmail) {
        setError('Name, UCU Email, and Personal Email are required');
        return;
      }
      
      // Validate UCU email for login email
      if (!formData.email.endsWith('@ucu.ac.ug')) {
        setError('UCU Email must end with @ucu.ac.ug');
        return;
      }
      
      // System admin can only create faculty_admin
      if (user.role === 'admin' && formData.role !== 'faculty_admin') {
        setError('System admin can only create Faculty Admins');
        return;
      }
      
      // Validate personal email
      if (!formData.personalEmail.includes('@')) {
        setError('Personal email must be a valid email address');
        return;
      }
      
      // Send alternativeEmail as the personal email to backend
      const payload = { ...formData, alternativeEmail: formData.personalEmail };
      const res = await createUser(payload);
      setMessage(`User ${res.user.email} created successfully. Credentials sent to ${formData.personalEmail}.`);
      
      // Refresh users list
      const token = localStorage.getItem('token');
      const usersRes = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data);
      
      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        personalEmail: '',
        role: user.role === 'admin' ? 'faculty_admin' : 'student', 
        faculty_id: user.role === 'faculty_admin' ? user.faculty_id : '', 
        department_id: '' 
      });
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create user');
    }
  };
  
  const handleDeleteClick = (userRecord) => {
    setUserToDelete(userRecord);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`User ${userToDelete.email} deactivated successfully`);
      setUsers(users.map(u => u.id === userToDelete.id ? { ...u, active: false } : u));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to deactivate user');
      setShowDeleteModal(false);
    }
  };

  if (!user || !['admin', 'faculty_admin'].includes(user.role)) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Access denied. Admin or Faculty Admin privileges required.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-3">
        {user.role === 'admin' ? '🔐 System-Wide User Management' : '🏫 Faculty User Management'}
      </h2>
      {user.role === 'faculty_admin' && (
        <Alert variant="info">
          You can create and manage students and supervisors for your faculty only.
        </Alert>
      )}
      <p className="text-muted">
        {user.role === 'admin' 
          ? 'Provision and manage all user accounts across all faculties.' 
          : `Manage users for ${users[0]?.Faculty?.name || 'your faculty'}.`}
      </p>
      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card className="mb-4 p-3 shadow-sm">
        <h5>➕ {user.role === 'admin' ? 'Create Faculty Admin' : 'Create New User'}</h5>
        {user.role === 'admin' && (
          <Alert variant="info" className="mb-3">
            System admins can only create Faculty Admin accounts. All other users are managed by Faculty Admins.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g., John Doe"
                  required 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>UCU Email (for login) <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="user@ucu.ac.ug"
                  required 
                />
                <Form.Text className="text-muted">Must end with @ucu.ac.ug</Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Personal Email (for credentials) <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="email" 
                  name="personalEmail" 
                  value={formData.personalEmail} 
                  onChange={handleChange}
                  placeholder="user@gmail.com"
                  required 
                />
                <Form.Text className="text-muted">Login credentials will be sent here</Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {user.role === 'admin' ? (
              // System admin only creates faculty_admin
              <>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control 
                      type="text" 
                      value="Faculty Admin" 
                      disabled
                    />
                    <Form.Text className="text-muted">System admins can only create Faculty Admins</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Faculty <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="faculty_id" 
                      value={formData.faculty_id} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button type="submit" variant="success" className="w-100 mb-3">
                    ✓ Create Faculty Admin
                  </Button>
                </Col>
              </>
            ) : (
              // Faculty admin creates students/supervisors
              <>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleChange}>
                      <option value="student">Student</option>
                      <option value="supervisor">Supervisor</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Faculty</Form.Label>
                    <Form.Select
                      name="faculty_id" 
                      value={formData.faculty_id} 
                      onChange={handleChange}
                      disabled={user.role === 'faculty_admin'}
                      required
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Form.Select>
                    {user.role === 'faculty_admin' && (
                      <Form.Text className="text-muted">Locked to your faculty</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      name="department_id" 
                      value={formData.department_id} 
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments
                        .filter(d => !formData.faculty_id || d.faculty_id == formData.faculty_id)
                        .map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button type="submit" variant="success" className="w-100 mb-3">
                    ✓ Create User
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Card>

      <Card className="p-3 shadow-sm">
        <h5 className="mb-3">📋 {user.role === 'admin' ? 'All Users (View Only)' : 'Faculty Users'}</h5>
        {user.role === 'admin' && (
          <Alert variant="warning" className="mb-3">
            <strong>View Only Mode:</strong> System admins can view all users but can only create Faculty Admins. To manage students and supervisors, contact the respective Faculty Admin.
          </Alert>
        )}
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" /></div>
        ) : users.length === 0 ? (
          <Alert variant="warning">No users found.</Alert>
        ) : (
          <>
            <p className="text-muted mb-3">
              Showing {users.filter(u => u.active).length} active users 
              {users.filter(u => !u.active).length > 0 && 
                ` (${users.filter(u => !u.active).length} inactive)`
              }
            </p>
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Faculty</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={!u.active ? 'table-secondary' : ''}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td><small>{u.email}</small></td>
                    <td>
                      <Badge bg={
                        u.role === 'admin' ? 'danger' : 
                        u.role === 'faculty_admin' ? 'warning' :
                        u.role === 'supervisor' ? 'primary' : 'secondary'
                      }>
                        {u.role === 'faculty_admin' ? 'Faculty Admin' : u.role}
                      </Badge>
                    </td>
                    <td><small>{u.Faculty?.name || u.faculty_id || '-'}</small></td>
                    <td><small>{u.Department?.name || u.department_id || '-'}</small></td>
                    <td>
                      {u.active ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td><small>{new Date(u.createdAt).toLocaleDateString()}</small></td>
                    <td>
                      {u.active && !['admin', 'faculty_admin'].includes(u.role) && user.role === 'faculty_admin' ? (
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDeleteClick(u)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deactivation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
          <br /><br />
          <em className="text-muted">The user will not be able to log in.</em>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Deactivate User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;