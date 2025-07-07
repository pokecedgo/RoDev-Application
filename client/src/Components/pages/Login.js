import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Common.css";
import loginBanner from '../../assets/LoginPageBanner.png';

const bannerStyle = {
  backgroundImage: `url(${loginBanner})`
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const userData = await response.json();
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {}
      <div className="page-banner" style={bannerStyle}>
        <div className="banner-overlay">
          <div className="container">
            <div className="banner-content">
              {}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger text-center" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label text-center d-block fw-bold">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg text-center"
                      id="username"
                      name="username"
                      value={username}
                      onChange={onChange}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-center d-block fw-bold">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg text-center"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="d-grid gap-2 mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Create Account</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
