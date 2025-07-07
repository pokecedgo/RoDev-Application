import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import bannerImage from '../../assets/HomePageBanner.png'; 

const bannerStyle = {
  backgroundImage: `url(${bannerImage})`
};

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/post/getAllPosts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error loading posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8000/category/getAllCategories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchAllPosts();
    fetchCategories();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.categoryId?._id === selectedCategory || post.categoryId === selectedCategory);

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
        <div className="row mb-4">
          <div className="col-md-6">
            <h2>Recent Posts</h2>
          </div>
          <div className="col-md-6 text-end">
            <div className="d-flex justify-content-end align-items-center">
              <label className="me-2">Filter by category:</label>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="alert alert-info">
            {selectedCategory === 'all' 
              ? 'No posts found. Be the first to create a post!' 
              : 'No posts found in this category.'}
          </div>
        ) : (
          <div className="row">
            {filteredPosts.map(post => (
              <div className="col-md-6 mb-4" key={post._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">{post.title}</h3>
                    <div className="d-flex align-items-center mb-2">
                      <span className="badge bg-secondary me-2">
                        {post.categoryId?.name || 'Uncategorized'}
                      </span>
                      <small className="text-muted">
                        Posted by <strong>{post.userId?.username || 'Unknown User'}</strong>
                      </small>
                    </div>
                    <p className="card-text">
                      {post.body.length > 150
                        ? post.body.substring(0, 150) + '...'
                        : post.body}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                    <small className="text-muted">{formatDate(post.createdAt)}</small>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
