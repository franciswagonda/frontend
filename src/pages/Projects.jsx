import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        technology: '',
        faculty: '',
        department: '',
        year: ''
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

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
        const fetchProjects = async () => {
            setLoading(true);
            try {
                // Remove empty filters
                const cleanFilters = Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '')
                );
                const query = new URLSearchParams(cleanFilters).toString();
                const res = await axios.get(`http://localhost:5000/api/projects${query ? '?' + query : ''}`);
                setProjects(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            technology: '',
            faculty: '',
            department: '',
            year: ''
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #051738ff 0%, #1e1f72ff 100%)', paddingBottom: '40px' }}>
            <Container className="pt-4">
                <h2 className="mb-4 text-white">Innovations Gallery</h2>

                {/* Search Filters */}
                <Card className="mb-4 p-3 shadow-sm">
                    <h5 className="mb-3">Filter Projects</h5>
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Technology</Form.Label>
                            <Form.Control
                                placeholder="e.g. React, Python"
                                name="technology"
                                value={filters.technology}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Select
                                name="year"
                                value={filters.year}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Faculty</Form.Label>
                            <Form.Control
                                placeholder="Faculty"
                                name="faculty"
                                value={filters.faculty}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                placeholder="Department"
                                name="department"
                                value={filters.department}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div>
                    <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                        Clear All Filters
                    </Button>
                    <small className="ms-3 text-muted">
                        {projects.length} project{projects.length !== 1 ? 's' : ''} found
                    </small>
                </div>
            </Card>

            {/* Projects Grid */}
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading projects...</p>
                </div>
            ) : (
                <Row>
                    {projects.map(project => (
                        <Col key={project.id} md={4} className="mb-4">
                            <Card className="h-100 shadow" style={{ transition: 'all 0.3s', overflow: 'hidden' }}>
                                {project.image_url && (
                                    <Card.Img 
                                        variant="top" 
                                        src={project.image_url} 
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        alt={project.title}
                                    />
                                )}
                                {!project.image_url && (
                                    <div style={{ 
                                        height: '200px', 
                                        background: 'linear-gradient(135deg, #051738ff 0%, #42022aff 50%, #1e1f72ff 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '3rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {project.title.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <Card.Body>
                                    <Card.Title className="text-truncate" title={project.title}>
                                        {project.title}
                                    </Card.Title>
                                    <div className="mb-2">
                                        <Badge bg="info" className="me-1">{project.category}</Badge>
                                        <Badge bg="success">{project.status}</Badge>
                                    </div>
                                    <Card.Text className="text-muted small">
                                        {project.description?.substring(0, 120)}...
                                    </Card.Text>
                                    {project.technologies && (
                                        <div className="mb-2">
                                            <small className="text-secondary">
                                                <strong>Tech:</strong> {project.technologies.split(',').slice(0, 3).join(', ')}
                                            </small>
                                        </div>
                                    )}
                                    <small className="text-muted d-block">
                                        <strong>By:</strong> {project.Student?.name || 'Unknown'}
                                    </small>
                                    {project.Student?.Faculty && (
                                        <small className="text-muted d-block">
                                            <strong>Faculty:</strong> {project.Student.Faculty.name}
                                        </small>
                                    )}
                                </Card.Body>
                                <Card.Footer className="bg-white border-top-0">
                                    <Link to={`/projects/${project.id}`}>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            className="w-100"
                                            style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
                                        >
                                            View Details →
                                        </Button>
                                    </Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                    {projects.length === 0 && (
                        <Col>
                            <div className="text-center my-5">
                                <h4 style={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>No projects found</h4>
                                <p style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Try adjusting your filters or check back later!</p>
                            </div>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
        </div>
    );
};

export default Projects;
