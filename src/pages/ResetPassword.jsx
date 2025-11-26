import { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import bishopTuckerImage from '../assets/BISHOP-TUCKER-BUILDING.jpeg';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            fontFamily: "'Aptos', 'Segoe UI', sans-serif",
            overflow: 'hidden'
        }}>
            {/* Background Image */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${bishopTuckerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1
            }}></div>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center px-5 py-4" style={{ color: 'white' }}>
                <h5 className="fw-bold m-0">UCU Innovators Hub</h5>
                <div className="d-flex gap-4">
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}><i className="bi bi-grid-fill me-2"></i>Home</span>
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}><i className="bi bi-box-arrow-in-right me-2"></i>Login</span>
                </div>
            </div>

            {/* Main Content - Centered Card */}
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
                <Container style={{
                    maxWidth: '550px',
                    background: 'linear-gradient(135deg, #051738ff 0%, #42022aff 50%, #1e1f72ff 100%)',
                    borderRadius: '15px',
                    padding: '0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                }}>
                    {/* Logo Area */}
                    <div className="text-center pt-5 pb-4 px-4">
                        <div className="mb-2">
                            <h2 className="fw-bold m-0" style={{ color: '#fff', letterSpacing: '1px', fontFamily: 'Aptos, sans-serif' }}>RESET PASSWORD</h2>
                        </div>
                        <p style={{ color: '#e91e63', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'Aptos, sans-serif' }}>
                            UCU Innovators Hub
                        </p>
                    </div>

                    {/* Form Area */}
                    <div className="px-5 pb-5">
                        {message && <Alert variant="success" className="mb-3">{message}</Alert>}
                        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                        
                        <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
                            Enter your new password below.
                        </p>

                        <Form onSubmit={handleSubmit}>
                            <Form.Control
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mb-3"
                                style={{
                                    borderRadius: '5px',
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />

                            <Form.Control
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mb-3"
                                style={{
                                    borderRadius: '5px',
                                    padding: '12px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />
                            
                            <Button 
                                type="submit" 
                                className="fw-bold text-white w-100 mb-3" 
                                disabled={loading}
                                style={{
                                    backgroundColor: '#e91e63',
                                    borderColor: '#e91e63',
                                    borderRadius: '5px',
                                    padding: '12px'
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>

                            <div className="text-center mt-3">
                                <small style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>
                                    Back to Login
                                </small>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: '20px', left: '40px', color: 'white', fontSize: '0.9rem' }}>
                &copy; 2025 Uganda Christian University
            </div>
        </div>
    );
};

export default ResetPassword;
