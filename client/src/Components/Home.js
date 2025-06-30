import { Link } from 'react-router-dom';


//Forums list view (List out all posts)


/*
  Self notes: User does not need to be login to view all posts on the home page.
    This page serves as the landing page for the application.
    The user is require to LOGIN/REGISTER to create a post or view their profile ONLY.

*/



/* just to see how it could look */
const Home = () => {
  const mockPosts = [
    {
      id: 1,
      title: "Making a Placement System V2",
      author: "CedBlox45",
      category: "Scripting",
      date: "2025-12-01",
      preview: "Learn bla bla make placement stuff"
    },
    {
      id: 2,
      title: "How to Monetize Game",
      author: "RichGamerUI",
      category: "Resource",
      date: "2025-12-02",
      preview: "Gain profits from games, fast and easy."
    },
    {
      id: 3,
      title: "How to do Low-Poly Modeling",
      author: "Jandel",
      category: "Buiding",
      date: "2025-12-03",
      preview: "Build better with a unique style."
    },
  ];

  return (
    <div className="container mt-5">
      {/* Top Main */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h1 className="display-4">RoDev Forums</h1>
          <p className="lead">Developers for Developers</p>
          <hr className="my-4" />
          <p>Start sharing your ideas today!</p>
          <div className="d-flex gap-3">

            {/* We can change this, buttons for now <3 */}
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg">
              Sign In
            </Link>

          </div>
        </div>
      </div>

      {/* Forums Listing 
         Post Title
         Post Author
         Post Category
      
          Then users would click and direct them to view specific post page
      */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Forums</h3>
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {mockPosts.map(post => (
                <div key={post.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{post.title}</h5>
                      <span className="badge bg-secondary">{post.category}</span>
                    </div>
                    <h6 className="card-subtitle mb-2 text-muted">By {post.author} • {post.date}</h6>
                    <p className="card-text">{post.preview}</p>
                    <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
