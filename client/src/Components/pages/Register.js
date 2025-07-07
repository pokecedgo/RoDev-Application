import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';
import "../styles/Common.css";
import RegisterPageBanner from '../../assets/RegisterPageBanner.png'; 

const bannerStyle = {
  backgroundImage: `url(${RegisterPageBanner})`
};

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { username, email, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== password2) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    if (!username || !email || !password) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }

    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password
    };

    try {
      const response = await fetch(`http://localhost:8000/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });
      
      

      if (response.ok) {
        navigate("/login");
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center mb-2">Create Account</h2>
                <p className="text-center text-muted mb-4">Fill in information below!</p>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" placeholder="username" onChange={onChange} value={username} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="email" onChange={onChange} value={email} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="password" onChange={onChange} value={password} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password2" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="password2" name="password2" placeholder="confirm password" onChange={onChange} value={password2} required />
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-dark" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;