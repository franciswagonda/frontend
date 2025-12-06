import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        otherNames: '',
        nationality: '',
        gender: '',
        hobbies: '',
        department: '',
        registrationNumber: '',
        yearOfEntry: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);
            setFormData({
                name: res.data.name || '',
                email: res.data.email || '',
                phoneNumber: res.data.phoneNumber || '',
                otherNames: res.data.otherNames || '',
                nationality: res.data.nationality || 'Ugandan',
                gender: res.data.gender || '',
                hobbies: res.data.hobbies || '',
                department: res.data.department || '',
                registrationNumber: res.data.registrationNumber || '',
                yearOfEntry: res.data.yearOfEntry || ''
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
            setEditing(false);
            fetchProfile();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const getInitials = () => {
        if (!profileData) return '';
        const names = profileData.name.split(' ');
        return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">Loading profile...</div>
            </Container>
        );
    }

    return (
        <Container fluid style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #87CEEB 0%, #00BFFF 100%)',
            padding: '2rem'
        }}>
            <Row>
                {/* Sidebar */}
                <Col md={3}>
                    <Card style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="text-center py-4">
                            {profileData?.profilePhotoUrl ? (
                                <img 
                                    src={profileData.profilePhotoUrl}
                                    alt="Profile"
                                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', display: 'block' }}
                                />
                            ) : (
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: '#4169E1',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    margin: '0 auto 1rem'
                                }}>
                                    {getInitials()}
                                </div>
                            )}
                            <h6 className="mb-0">{profileData?.accessNumber || profileData?.id}</h6>
                        </Card.Body>
                    </Card>

                    <Card className="mt-3" style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Card.Body>
                            <div className="mb-3">
                                <i className="bi bi-person-circle me-2"></i>
                                <strong>Profile</strong>
                            </div>
                            <div className="mb-3 text-muted" style={{ fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
                                <div className="mb-2" style={{ cursor: 'pointer' }}>
                                    <i className="bi bi-file-text me-2"></i>Basic Info
                                </div>
                                {user?.role === 'student' && (
                                    <div className="mb-2" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-mortarboard me-2"></i>Academic Info
                                    </div>
                                )}
                                <div style={{ cursor: 'pointer' }}>
                                    <i className="bi bi-telephone me-2"></i>Contacts
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Button 
                        variant="outline-primary" 
                        className="w-100 mt-3"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                    </Button>
                </Col>

                {/* Main Content */}
                <Col md={9}>
                    {/* Header Card */}
                    <Card style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                {profileData?.profilePhotoUrl ? (
                                    <img 
                                        src={profileData.profilePhotoUrl}
                                        alt="Profile"
                                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        backgroundColor: '#4169E1',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        marginRight: '1rem'
                                    }}>
                                        {getInitials()}
                                    </div>
                                )}
                                <div>
                                    <h4 className="mb-0">{profileData?.name}</h4>
                                    <p className="text-muted mb-0">
                                        {profileData?.accessNumber} 
                                        {user?.role === 'student' && profileData?.registrationNumber && 
                                            ` | ${profileData.registrationNumber}`
                                        }
                                    </p>
                                </div>
                            </div>
                            <Button 
                                variant={editing ? "secondary" : "primary"}
                                onClick={() => setEditing(!editing)}
                            >
                                <i className={`bi bi-${editing ? 'x' : 'pencil'} me-2`}></i>
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                            {editing && (
                                <Form className="ms-3" onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const token = localStorage.getItem('token');
                                        const fd = new FormData();
                                        const fileInput = e.currentTarget.querySelector('input[name="photo"]');
                                        if (fileInput && fileInput.files[0]) {
                                            fd.append('photo', fileInput.files[0]);
                                            const res = await axios.put('http://localhost:5000/api/users/profile/photo', fd, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            setProfileData({ ...profileData, profilePhotoUrl: res.data.profilePhotoUrl });
                                        }
                                    } catch (err) {
                                        setError(err.response?.data?.message || 'Failed to upload photo');
                                    }
                                }}>
                                    <Form.Control type="file" name="photo" accept="image/*" />
                                    <Button type="submit" variant="outline-primary" size="sm" className="ms-2">
                                        <i className="bi bi-upload me-2"></i>Upload Photo
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>

                    {message && <Alert variant="success" className="mt-3">{typeof message === 'string' ? message : (message?.message || JSON.stringify(message))}</Alert>}
                    {error && <Alert variant="danger" className="mt-3">{typeof error === 'string' ? error : (error?.message || JSON.stringify(error))}</Alert>}

                    {/* Basic Info Card */}
                    <Card className="mt-3" style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Card.Body>
                            <h5 className="mb-4">Basic Info</h5>
                            
                            {editing ? (
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name.split(' ')[0] || ''}
                                                    onChange={(e) => {
                                                        const lastName = formData.name.split(' ').slice(1).join(' ');
                                                        setFormData({ ...formData, name: `${e.target.value} ${lastName}`.trim() });
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Surname Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={formData.name.split(' ').slice(1).join(' ') || ''}
                                                    onChange={(e) => {
                                                        const firstName = formData.name.split(' ')[0];
                                                        setFormData({ ...formData, name: `${firstName} ${e.target.value}`.trim() });
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Other Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="otherNames"
                                                    value={formData.otherNames}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Hobbies</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="hobbies"
                                                    value={formData.hobbies}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nationality</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="nationality"
                                                    value={formData.nationality}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={formData.email}
                                                    disabled
                                                    style={{ backgroundColor: '#f5f5f5' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>User Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={profileData?.accessNumber || profileData?.id}
                                                    disabled
                                                    style={{ backgroundColor: '#f5f5f5' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button type="submit" variant="primary">
                                        <i className="bi bi-check-circle me-2"></i>Save Changes
                                    </Button>
                                </Form>
                            ) : (
                                <Row>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">First Name</strong>
                                            <span>{profileData?.name.split(' ')[0] || '-'}</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">Surname Name</strong>
                                            <span>{profileData?.name.split(' ').slice(1).join(' ') || '-'}</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">Other Name</strong>
                                            <span>{profileData?.otherNames || '-'}</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">Hobbies</strong>
                                            <span>{profileData?.hobbies || '-'}</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">Nationality</strong>
                                            <span>{profileData?.nationality || '-'}</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">Gender</strong>
                                            <span>{profileData?.gender || '-'}</span>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">Email</strong>
                                            <span>{profileData?.email}</span>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <strong className="d-block text-muted mb-1">User Name</strong>
                                            <span>{profileData?.accessNumber || profileData?.id}</span>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Academic Info Card - Only for Students */}
                    {user?.role === 'student' && (
                        <Card className="mt-3" style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <Card.Body>
                                <h5 className="mb-4">Academic Info</h5>
                                
                                {editing ? (
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Registration Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="registrationNumber"
                                                        value={formData.registrationNumber}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Access Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={profileData?.accessNumber}
                                                        disabled
                                                        style={{ backgroundColor: '#f5f5f5' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Year Of Entry</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="yearOfEntry"
                                                        value={formData.yearOfEntry}
                                                        onChange={handleChange}
                                                        min="2000"
                                                        max={new Date().getFullYear() + 1}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Department</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button type="submit" variant="primary">
                                            <i className="bi bi-check-circle me-2"></i>Save Changes
                                        </Button>
                                    </Form>
                                ) : (
                                    <Row>
                                        <Col md={4}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Registration Number</strong>
                                                <span>{profileData?.registrationNumber || '-'}</span>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Access Number</strong>
                                                <span>{profileData?.accessNumber || '-'}</span>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Year Of Entry</strong>
                                                <span>{profileData?.yearOfEntry || '-'}</span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Department</strong>
                                                <span>{profileData?.department || '-'}</span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Phone Number</strong>
                                                <span>{profileData?.phoneNumber || '-'}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    )}

                    {/* Contacts Card - For non-students */}
                    {user?.role !== 'student' && (
                        <Card className="mt-3" style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <Card.Body>
                                <h5 className="mb-4">Contact Information</h5>
                                
                                {editing ? (
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Department</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="department"
                                                        value={formData.department}
                                                        onChange={handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button type="submit" variant="primary">
                                            <i className="bi bi-check-circle me-2"></i>Save Changes
                                        </Button>
                                    </Form>
                                ) : (
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Phone Number</strong>
                                                <span>{profileData?.phoneNumber || '-'}</span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3">
                                                <strong className="d-block text-muted mb-1">Department</strong>
                                                <span>{profileData?.department || '-'}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
