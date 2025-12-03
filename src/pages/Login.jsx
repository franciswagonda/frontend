import { useState, useContext } from 'react';
import { Form, Button, Container, Alert, Modal, InputGroup } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import bishopTuckerImage from '../assets/BISHOP-TUCKER-BUILDING.jpeg';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showTerms, setShowTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(identifier, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            fontFamily: "'Segoe UI', sans-serif",
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
            <div className="d-flex justify-content-between align-items-center px-5 py-4" style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)'
            }}>
                <h4 className="fw-bold m-0" style={{ 
                    color: '#6495ED',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    letterSpacing: '0.5px'
                }}>UCU Innovators Hub</h4>
                <div className="d-flex gap-4">
                    <span style={{ 
                        cursor: 'pointer',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                    }} onClick={() => navigate('/')}>
                        <i className="bi bi-grid-fill me-2" style={{ fontSize: '1.2rem' }}></i>Home
                    </span>
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
                            <h2 className="fw-bold m-0" style={{ color: '#fff', letterSpacing: '1px', fontFamily: 'Aptos, sans-serif' }}>UGANDA CHRISTIAN</h2>
                            <h2 className="fw-bold m-0" style={{ color: '#fff', letterSpacing: '1px', fontFamily: 'Aptos, sans-serif' }}>UNIVERSITY</h2>
                        </div>
                        <p style={{ color: '#e91e63', fontSize: '0.9rem', fontWeight: '500', fontFamily: 'Aptos, sans-serif' }}>
                            A Centre of Excellence in the Heart of Africa
                        </p>
                    </div>

                    {/* Form Area */}
                    <div className="px-5 pb-5">
                        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Email or Access Number"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    style={{
                                        borderRadius: '5px',
                                        padding: '12px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                />
                                <Button type="submit" className="fw-bold text-white px-4" style={{
                                    backgroundColor: '#e91e63',
                                    borderColor: '#e91e63',
                                    borderRadius: '5px',
                                    whiteSpace: 'nowrap'
                                }}>
                                    NEXT <i className="bi bi-chevron-right ms-1"></i>
                                </Button>
                            </div>
                            <InputGroup className="mt-3">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        borderRight: 'none',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        borderLeft: 'none',
                                        backgroundColor: '#f8f9fa',
                                        color: '#6c757d'
                                    }}
                                >
                                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
                                </Button>
                            </InputGroup>

                            <div className="text-center mt-4">
                                <small style={{ color: '#fff' }}>By signing in, I agree to the <span 
                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => setShowTerms(true)}
                                >Terms & Conditions</span></small>
                                <div className="mt-2">
                                    <small 
                                        style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => navigate('/forgot-password')}
                                    >
                                        Forgot Password? Reset Here
                                    </small>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>

            {/* Terms and Conditions Modal */}
            <Modal show={showTerms} onHide={() => setShowTerms(false)} size="xl" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#051738ff', color: 'white' }}>
                    <Modal.Title>Terms & Conditions of Use</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0, height: '80vh' }}>
                    <iframe 
                        src="/terms-and-conditions.pdf#toolbar=0&navpanes=0&scrollbar=1"
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            border: 'none' 
                        }}
                        title="Terms and Conditions"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTerms(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Footer */}
            <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '0',
                right: '0',
                textAlign: 'center',
                color: '#00BFFF', 
                fontSize: '1rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
                &copy; 2025 Uganda Christian University
            </div>
        </div>
    );
};

export default Login;
