import React, { useState, useEffect } from 'react'
import Post from './layouts/PostView';
import SocialPostView from './layouts/SocialPostView';
import Sidebar from './layouts/Sidebar';
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { useSnackbar } from "notistack";
import axios from 'axios';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'socialPosts'
  const { enqueueSnackbar } = useSnackbar();
  const Navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/", { withCredentials: true })
      .then((res) => {
        if (!res.data.authenticated) {
          Navigate("/login");
        }
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar("Error", { variant: "error", autoHideDuration: 1000 });
      });
  }, []);

  // Get all posts available
  useEffect(() => {
    axios.get("http://localhost:8080/projects/get_all_posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
  }, []);

  // Get all social posts available
  useEffect(() => {
    axios.get("http://localhost:8080/projects/get_all_social_posts")
      .then((res) => {
        setSocialPosts(res.data);
        setLoading(false);
      })
  }, []);

  return (
    <>
      <Header name={window.location.pathname} />
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="flex bg-gray-800">
          <Sidebar />
          <div className='border-0 flex-grow p-4'>
            <div className="flex justify-center mb-4">
              <button
                className={`mx-2 px-4 py-2 rounded ${activeTab === 'posts' ? 'bg-blue-500' : 'bg-gray-500'}`}
                onClick={() => setActiveTab('posts')}
              >
                Posts
              </button>
              <button
                className={`mx-2 px-4 py-2 rounded ${activeTab === 'socialPosts' ? 'bg-blue-500' : 'bg-gray-500'}`}
                onClick={() => setActiveTab('socialPosts')}
              >
                Social Posts
              </button>
            </div>
            
            {activeTab === 'posts' && (
              <div className="grid gap-4 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 px-[10%] py-16 text-white">
                {posts.map((post, index) => (
                  <div key={index}>
                    <Post
                      header={post.title}
                      body={post.text}
                      username={post.username}
                      isVolunteer={post.isVolunteer}
                      isFundraiser={post.isFundraiser}
                      imgSrc={post.image}
                      showVolunteer={false}
                      numVolunteers={post.numVolunteers}
                      numDonors={post.numDonors}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'socialPosts' && (
              <div className="grid gap-4 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 px-[10%] py-16 text-white">
                {socialPosts.map((post, index) => (
                  <div key={index}>
                    <SocialPostView
                      title={post.title}
                      body={post.text}
                      imgSrc={post.image}
                      username={post.username}
                      likes={post.likes ? post.likes.length : 0}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Home