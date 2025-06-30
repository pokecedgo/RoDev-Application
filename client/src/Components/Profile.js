const Profile = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Profile</h2>
              <div className="text-center mb-3">
                <img 

                /* temp profile setup */
                  src="/images/default-avatar.png" 
                  alt="Profile" 
                  className="rounded-circle profile-ro"
                  width="150"
                  height="150"
                />
              </div>
              <h3 className="text-center">Username</h3>
              <p className="text-center text-muted">Nothing for now.</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <h3>My Posts</h3>
          <div className="list-group">
            {/* Nothing for now */}
            <div className="list-group-item">
              <h5>No posts yet</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
