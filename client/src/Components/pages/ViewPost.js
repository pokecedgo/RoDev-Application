import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Common.css";
import bannerImage from '../../assets/HomePageBanner.png'; 

const bannerStyle = {
  backgroundImage: `url(${bannerImage})`
};

const ViewPost = () => {
 
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Fetch post details
    const fetchPost = async () => {
      try {
      
        const res = await fetch(`http://localhost:8000/post/getPostById?postId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const postData = await res.json();
        setPost(postData);
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching post:", err);
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
    
        const res = await fetch(`http://localhost:8000/comment/getCommentsByPostId?postId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const commentsData = await res.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchPost(), fetchComments()]);
      setLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]); 

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      setError("You must be logged in to comment");
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/comment/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId: id,
          userId: user._id,
          body: newComment.trim()
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create comment");
      }

      const createdComment = await res.json();
      
      // Add the new comment to the list with user info
      const commentWithUser = {
        ...createdComment,
        userId: {
          _id: user._id,
          username: user.username
        }
      };
      
      setComments([...comments, commentWithUser]);
      setNewComment("");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
          <div className="mt-2">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {}
      <div className="banner-container" style={bannerStyle}>
        <div className="banner-overlay">
          <div className="container">
            <div className="banner-content">
             
            </div>
          </div>
        </div>
      </div>

      {}

      <div className="container mt-5">
        {/* Back Button */}
        <div className="mb-3">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* Post Content */}
        {post && (
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="card-title mb-1">{post.title}</h2>
                  <div className="text-muted">
                    <small>
                      by <strong>{post.userId?.username || "Unknown User"}</strong> • {formatDate(post.createdAt)}
                    </small>
                  </div>
                  <div className="mt-2">
                    <span className="badge bg-secondary">
                      {post.categoryId?.name || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
                {post.body}
              </p>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="card">
          <div className="card-header">
            <h4>Comments ({comments.length})</h4>
          </div>
          
          <div className="card-body">
            {/* Comment Form */}
            {user ? (
              <div className="mb-4">
                <h5>Add a Comment</h5>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Write your comment here..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="alert alert-info mb-4">
                You must be logged in to comment.
              </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment._id} className="comment-item border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="comment-header mb-2">
                          <strong>{comment.userId?.username || "Unknown User"}</strong>
                          <small className="text-muted ms-2">
                            {formatDate(comment.createdAt)}
                          </small>
                        </div>
                        <div className="comment-body">
                          <p style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPost;