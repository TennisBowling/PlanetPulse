import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Header from "./pages/Header";
import Account from "./pages/Account";
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';
import PostPage from './pages/PostPage';
import Donate from './pages/Donate';
import Information from './pages/information'
import CreateSocialPost from './pages/CreateSocialPost';
import SocialPostPage from './pages/SocialPostPage';

const App = () => {
  return (
    <>
    {/* Route to all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accounts" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/createsocialpost" element={<CreateSocialPost />} />
        <Route path="/search" element={<Search />} />
        <Route path="/postpage/:id" element={<PostPage />} />
        <Route path="/socialpostpage/:id" element={<SocialPostPage />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/information" element={<Information />} />
        {/* <Route path="/home" element={<TestHome />} /> */}
      </Routes> 
    </> 
  )
}

export default App;