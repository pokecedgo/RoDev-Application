import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/pages/Navbar.js';
import Register from './Components/pages/Register.js';
import Login from './Components/pages/Login.js';
import Home from './Components/pages/Home.js';
import CreatePost from './Components/pages/CreatePost.js';
import Profile from './Components/pages/Profile.js';
import ViewPost from './Components/pages/ViewPost.js';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/view-post" element={<ViewPost />} />
          <Route path="/view-post/:id" element={<ViewPost />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="*" element={
            <div className="container mt-5">
              <h1>Page Not Found</h1>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;