import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import bishopTuckerImage from '../assets/BISHOP-TUCKER-BUILDING.jpeg';

const Home = () => {
    return (
        <>
            {/* Hero Section */}
            <div style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bishopTuckerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '3rem',
                    borderRadius: '15px',
                    maxWidth: '900px',
                    margin: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    <Container fluid>
                        <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--ucu-blue)' }}>
                            UCU Innovators Hub
                        </h1>
                        <p className="fs-5 mb-4" style={{ color: '#555' }}>
                            A centralized platform to document, showcase, and manage all innovative projects 
                            created by students at Uganda Christian University.
                        </p>
                        <div className="d-flex flex-wrap gap-3 mt-4">
                            <Link to="/projects">
                                <Button size="lg" style={{ 
                                    backgroundColor: 'var(--ucu-blue)', 
                                    borderColor: 'var(--ucu-blue)',
                                    padding: '12px 30px'
                                }}>
                                     Browse Projects
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline-primary" style={{ 
                                    padding: '12px 30px'
                                }}>
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </Container>
                </div>
            </div>

            {/* Features Section */}
            <Container className="py-5">
                <h2 className="text-center mb-5 fw-bold">Why Choose UCU Innovators Hub?</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 text-center p-4 shadow-sm">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>📝</div>
                            <Card.Body>
                                <Card.Title className="fw-bold">Easy Submission</Card.Title>
                                <Card.Text>
                                    Submit your innovative projects with a simple, user-friendly interface. 
                                    Upload documents, add GitHub links, and showcase your work.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 text-center p-4 shadow-sm">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>✅</div>
                            <Card.Body>
                                <Card.Title className="fw-bold">Review System</Card.Title>
                                <Card.Text>
                                    Supervisors can review, approve, or provide feedback on submitted projects, 
                                    ensuring quality and academic integrity.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 text-center p-4 shadow-sm">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>🌐</div>
                            <Card.Body>
                                <Card.Title className="fw-bold">Public Gallery</Card.Title>
                                <Card.Text>
                                    Approved projects are showcased in a public gallery, allowing students to 
                                    gain recognition and inspire others.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col md={4} className="mb-4">
                        <Card className="h-100 text-center p-4 shadow-sm">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>📊</div>
                            <Card.Body>
                                <Card.Title className="fw-bold">Analytics Dashboard</Card.Title>
                                <Card.Text>
                                    Administrators can access comprehensive analytics including trending technologies, 
                                    approval rates, and active innovators.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 text-center p-4 shadow-sm">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>🔍</div>
                            <Card.Body>
                                <Card.Title className="fw-bold">Advanced Filtering</Card.Title>
                                <Card.Text>
                                    Search and filter projects by category, technology, faculty, department, 
                                    and year to find exactly what you're looking for.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 text-center p-4 shadow-sm">
                            <div className="mb-3" style={{ fontSize: '3rem' }}>💬</div>
                            <Card.Body>
                                <Card.Title className="fw-bold">Community Engagement</Card.Title>
                                <Card.Text>
                                    Comment on projects, provide feedback, and engage with the UCU innovation 
                                    community to foster collaboration.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* CTA Section */}
            <div className="bg-light py-5">
                <Container className="text-center">
                    <h3 className="mb-4">Access the Innovation Hub</h3>
                    <p className="lead mb-4">
                        Login to submit, review, and analyze student innovation at UCU.
                        Account creation is centrally managed by faculty administrators.
                    </p>
                    <Link to="/login">
                        <Button size="lg" style={{ 
                            backgroundColor: 'var(--ucu-green)', 
                            borderColor: 'var(--ucu-green)',
                            padding: '12px 40px'
                        }}>
                            Login Now
                        </Button>
                    </Link>
                </Container>
            </div>
        </>
    );
};

export default Home;
