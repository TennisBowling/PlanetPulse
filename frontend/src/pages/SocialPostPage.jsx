import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Sidebar from './layouts/Sidebar';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const SocialPostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    const Navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Check if user is logged in
    useEffect(() => {
        setLoading(true);
        axios
            .get("https://planetpulse.tennisbowling.com/api/", { withCredentials: true })
            .then((res) => {
                if (!res.data.authenticated) {
                    Navigate("../login");
                }
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar("Error", { variant: "error", autoHideDuration: 1000 });
            });
    }, []);

    // Get the current social post
    useEffect(() => {
        axios.post(
            'https://planetpulse.tennisbowling.com/api/projects/get_social_post',
            { post_title: id },
            { withCredentials: true }
        )
            .then((response) => {
                setPost(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error)
            })
    }, [id]);

    // Check if the user has liked this post
    useEffect(() => {
        if (post.title) {
            axios.post(
                'https://planetpulse.tennisbowling.com/api/projects/user_liked_social_post',
                { post_title: post.title },
                { withCredentials: true }
            )
                .then((response) => {
                    setLiked(response.data);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [post]);

    const handleLike = () => {
        axios.post(
            'https://planetpulse.tennisbowling.com/api/like_social_post',
            { post_title: post.title },
            { withCredentials: true }
        )
            .then(() => {
                setLiked(true);
                setPost(prev => ({ ...prev, likes: [...prev.likes, 'currentUser'] }));
                enqueueSnackbar("Post liked", { variant: "success", autoHideDuration: 1000 });
            })
            .catch((error) => {
                if (error.response?.data?.message === "User already likes this post") {
                    enqueueSnackbar("You already liked this post", { variant: "info", autoHideDuration: 1000 });
                } else {
                    enqueueSnackbar("Error liking post", { variant: "error", autoHideDuration: 1000 });
                }
            })
    };

    return (
        <>
            <Sidebar />
            <Header name={window.location.pathname} />
            <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
                <div className="max-w-lg w-full bg-gray-900 shadow-md rounded-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4 text-white">{post.title}</h1>
                        <p className="mb-2 text-gray-300">Posted by {post.username}</p>
                        {post.image ? (
                            <img src={post.image} alt="Post" className="w-full h-auto mb-4" />
                        ) : (
                            <img src="/images/logo.png" alt="Post" className="w-full h-auto mb-4" />
                        )}
                        <p className="mb-4 text-white">{post.text}</p>
                        <div className="flex justify-between">
                            <button
                                onClick={handleLike}
                                className={`${
                                    liked ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
                                } text-white font-semibold py-1 px-4 rounded-md`}
                            >
                                {liked ? 'Liked' : 'Like'} ({post.likes?.length || 0})
                            </button>
                            <a href="/" className="mt-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-md">
                                Go Back
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SocialPostPage;