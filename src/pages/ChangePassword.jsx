import { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/change-password', {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #051738ff 0%, #1e1f72ff 100%)',
            paddingTop: '60px',
            paddingBottom: '60px'
        }}>
            <Container style={{ maxWidth: '500px' }}>
                <Card className="shadow">
                    <Card.Header style={{ backgroundColor: '#051738ff', color: 'white' }}>
                        <h4 className="mb-0">Change Password</h4>
                    </Card.Header>
                    <Card.Body className="p-4">
                        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Current Password *</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        required
                                        style={{ borderRight: 'none' }}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        style={{ borderLeft: 'none' }}
                                    >
                                        <i className={`bi bi-eye${showCurrentPassword ? '-slash' : ''}-fill`}></i>
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>New Password *</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password (min 6 characters)"
                                        required
                                        style={{ borderRight: 'none' }}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{ borderLeft: 'none' }}
                                    >
                                        <i className={`bi bi-eye${showNewPassword ? '-slash' : ''}-fill`}></i>
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Confirm New Password *</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        required
                                        style={{ borderRight: 'none' }}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ borderLeft: 'none' }}
                                    >
                                        <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}-fill`}></i>
                                    </Button>
                                </InputGroup>
                            </Form.Group>

                            <div className="d-flex gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate('/dashboard')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default ChangePassword;
