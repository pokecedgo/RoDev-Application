import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Common.css";
import profileBanner from '../../assets/ProfilePageBanner.png'; 

const bannerStyle = {
  backgroundImage: `url(${profileBanner})`
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Fetch user's posts
    if (storedUser && storedUser._id) {
      fetchUserPosts(storedUser._id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8000/post/getUserPosts?userId=${userId}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (postId) => {
    setDeletePostId(postId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletePostId) return;
    
    setIsDeleting(true);
    try {
      // Change from query parameter to sending in request body to match server route
      const res = await fetch(`http://localhost:8000/post/deletePost`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: deletePostId }) // Send postId in the request body
      });
      
      if (res.ok) {
        // Remove the deleted post from the state
        setPosts(posts.filter(post => post._id !== deletePostId));
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setDeletePostId(null);
      setShowConfirmDialog(false);
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeletePostId(null);
    setShowConfirmDialog(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Banner with inline style using imported image */}
      <div className="page-banner" style={bannerStyle}>
        <div className="banner-overlay">
          <div className="container">
            <div className="banner-content">
            
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          {/* User Profile Card - Left Column */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center mb-4">Profile</h2>
                <div className="text-center mb-3">
                  <img
                    src="/images/defaultprofile.png" // Placeholder image
                    alt="Profile"
                    className="rounded-circle"
                    width="150"
                    height="150"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-center">
                  {user ? user.username : "Username"}
                </h3>
                <p className="text-center text-muted">
                  {user ? user.email : ""}
                </p>
                <div className="text-center">
                  <div className="badge bg-primary fs-6 mt-2">
                    {posts.length} Total Posts
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Posts - Right Column */}
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>My Posts | Total Posts ({posts.length})</h3>
              <button 
                className="btn btn-success" 
                onClick={() => navigate("/create-post")}
              >
                + New Post
              </button>
            </div>
            
            <div className="list-group">
              {loading ? (
                <div className="list-group-item">
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="list-group-item text-center">
                  <h5 className="text-muted">No posts yet</h5>
                  <p className="text-muted">Start sharing your thoughts with the community!</p>
                  <button 
                    onClick={() => navigate("/create-post")} 
                    className="btn btn-primary btn-sm"
                  >
                    Create Your First Post
                  </button>
                </div>
              ) : (
                posts.map(post => (
                  <div className="list-group-item" key={post._id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{post.title}</h5>
                        <small className="text-muted">
                          Posted on {formatDate(post.createdAt)}
                        </small>
                      </div>
                      <div className="btn-group">
                        <button 
                          onClick={() => navigate(`/post/${post._id}`)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(post._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmDialog && (
          <div className="modal d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;