import React, { useState, useEffect } from 'react'
import Post from './layouts/PostView';
import SocialPostView from './layouts/SocialPostView';
import Sidebar from './layouts/Sidebar';
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { useSnackbar } from "notistack";
import axios from 'axios';

const Profile = () => {
    const Navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [socialPosts, setSocialPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');

    // Check if user is logged in
    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:8080/", { withCredentials: true })
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

    // Get the user's own posts
    useEffect(() => {
        axios.get("http://localhost:8080/projects/get_user_posts", { withCredentials: true })
            .then((res) => {
                setPosts(res.data);
                setLoading(false);
            })
    }, [])

    // Get the user's own social posts
    useEffect(() => {
        axios.get("http://localhost:8080/projects/get_user_social_posts", { withCredentials: true })
            .then((res) => {
                setSocialPosts(res.data);
                setLoading(false);
            })
    }, [])

    // Get information on the user
    useEffect(() => {
        axios.get("http://localhost:8080/get_user", { withCredentials: true })
            .then((res) => {
                setUser(res.data.user);
            })
    }, [])

    // Delete the post
    const handleDeletePost = (post_title) => {
        axios.post(`http://localhost:8080/projects/delete_post`, { post_title: post_title }, { withCredentials: true })
            .then((res) => {
                setPosts(posts.filter((post) => post.title !== post_title));
                enqueueSnackbar("Post Deleted", { variant: "success", autoHideDuration: 1000 });
            })
            .catch((error) => {
                enqueueSnackbar("Error deleting post", { variant: "error", autoHideDuration: 1000 });
            });
    };

    // Delete the social post
    const handleDeleteSocialPost = (post_title) => {
        axios.post(`http://localhost:8080/projects/delete_social_post`, { post_title: post_title }, { withCredentials: true })
            .then((res) => {
                setSocialPosts(socialPosts.filter((post) => post.title !== post_title));
                enqueueSnackbar("Social Post Deleted", { variant: "success", autoHideDuration: 1000 });
            })
            .catch((error) => {
                enqueueSnackbar("Error deleting social post", { variant: "error", autoHideDuration: 1000 });
            });
    };

    return (
        <>
            <Header name={window.location.pathname} />
            <Sidebar />
            {loading ? (
                <h1>Loading</h1>
            ) : (
                <>
                    <div className="p-4">
                        <h1 className="text-3xl my-4 text-center">{user.username}</h1>
                    </div>
                    <div className="flex">
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
                                <div className="grid gap-4 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 px-[10%] py-16">
                                    {posts.map((post, index) => (
                                        <div key={index}>
                                            <Post
                                                header={post.title}
                                                body={post.text}
                                                username={post.username}
                                                isVolunteer={post.isVolunteer}
                                                isFundraiser={post.isFundraiser}
                                                imgSrc={post.image}
                                                showVolunteer={post.isVolunteer}
                                                listVolunteers={post.volunteers}
                                                onDelete={() => handleDeletePost(post.title)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {activeTab === 'socialPosts' && (
                                <div className="grid gap-4 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 px-[10%] py-16">
                                    {socialPosts.map((post, index) => (
                                        <div key={index}>
                                            <SocialPostView
                                                title={post.title}
                                                body={post.text}
                                                imgSrc={post.image}
                                                username={post.username}
                                                likes={post.likes ? post.likes.length : 0}
                                                onDelete={() => handleDeleteSocialPost(post.title)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Profile;