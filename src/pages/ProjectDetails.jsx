import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
                setProject(res.data);
            } catch (error) {
                console.error(error);
                setError('Failed to load project. It may not exist or has been removed.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading project details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => navigate('/projects')}>
                        Back to Projects
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!project) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">Project not found</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/projects')}>
                ← Back to Gallery
            </Button>
            
            <Card className="p-4 shadow-sm">
                <h2>{project.title}</h2>
                <div className="mb-3">
                    <Badge bg="primary" className="me-2">{project.category}</Badge>
                    <Badge 
                        bg={project.status === 'approved' ? 'success' : project.status === 'pending' ? 'warning' : 'danger'} 
                        className="me-2"
                    >
                        {project.status}
                    </Badge>
                    <Badge bg="info">Views: {project.viewCount || 0}</Badge>
                </div>

                <h5>Description</h5>
                <p className="lead">{project.description}</p>

                <h5>Technologies Used</h5>
                <div className="mb-3">
                    {project.technologies?.split(',').map((tech, idx) => (
                        <Badge key={idx} bg="secondary" className="me-2 mb-2">{tech.trim()}</Badge>
                    ))}
                </div>

                <h5>Project Team</h5>
                <p><strong>Student:</strong> {project.Student?.name} ({project.Student?.email})</p>
                {project.Supervisor && (
                    <p><strong>Supervisor:</strong> {project.Supervisor.name}</p>
                )}

                <div className="mt-4">
                    {project.github_link && (
                        <Button href={project.github_link} target="_blank" variant="dark" className="me-2">
                            <i className="bi bi-github"></i> View on GitHub
                        </Button>
                    )}
                    {project.document_url && (
                        <Button href={`http://localhost:5000/${project.document_url}`} target="_blank" variant="outline-danger">
                            <i className="bi bi-file-pdf"></i> Download Document
                        </Button>
                    )}
                </div>

                <hr className="my-4" />

                <h4>Comments & Feedback</h4>
                <Comments projectId={id} />
            </Card>
        </Container>
    );
};

const Comments = ({ projectId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/comments`);
                setComments(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchComments();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            const res = await axios.post(`http://localhost:5000/api/projects/${projectId}/comments`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([res.data, ...comments]);
            setContent('');
        } catch (error) {
            console.error(error);
            setError('Failed to post comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {token && (
                <form onSubmit={handleSubmit} className="mb-4">
                    {error && <Alert variant="danger" className="mb-2">{error}</Alert>}
                    <div className="mb-2">
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Leave a comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <Button type="submit" variant="secondary" size="sm" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Comment'}
                    </Button>
                </form>
            )}

            {!token && (
                <Alert variant="info">Please log in to leave a comment</Alert>
            )}

            {comments.map(comment => (
                <div key={comment.id} className="mb-3 p-3 bg-light rounded">
                    <strong>{comment.User?.name}</strong>{' '}
                    <Badge bg={comment.User?.role === 'supervisor' ? 'primary' : 'secondary'}>
                        {comment.User?.role}
                    </Badge>
                    <p className="mb-0 mt-2">{comment.content}</p>
                    <small className="text-muted">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                </div>
            ))}
            {comments.length === 0 && <p className="text-muted">No comments yet. Be the first to comment!</p>}
        </div>
    );
};

export default ProjectDetails;
