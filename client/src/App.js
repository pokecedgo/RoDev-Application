import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.js';
import Register from './Components/Register.js';
import Login from './Components/Login.js';
import Home from './Components/Home.js';
import CreatePost from './Components/CreatePost.js';
import Profile from './Components/Profile.js';
import ViewPost from './Components/ViewPost.js';

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