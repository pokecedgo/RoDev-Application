import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Common.css";
import CreatePostPageBanner from '../../assets/CreatePostPageBanner.png'; 

const bannerStyle = {
  backgroundImage: `url(${CreatePostPageBanner})`
};
const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    categoryId: ""
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { title, body, categoryId } = formData;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/category/getAllCategories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/post/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          body,
          categoryId,
          userId: user._id
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create post");
      }

      const result = await res.json();
      navigate("/profile");
    } catch (err) {
      setError(err.message);
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
             
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h2>Create a New Post</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Body</label>
            <textarea
              className="form-control"
              name="body"
              rows="5"
              value={body}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="categoryId"
              value={categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? "Publishing..." : "Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
