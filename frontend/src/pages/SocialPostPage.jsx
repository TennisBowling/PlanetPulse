import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import Sidebar from "./layouts/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Comment from "./layouts/CommentView";

const SocialPostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [currentUsername, setCurrentUsername] = useState("");

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Check if user is logged in
    useEffect(() => {
        setLoading(true);
        axios
            .get("https://planetpulse.tennisbowling.com/api/", {
                withCredentials: true,
            })
            .then((res) => {
                if (!res.data.authenticated) {
                    navigate("../login");
                }
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar("Error", {
                    variant: "error",
                    autoHideDuration: 1000,
                });
            });
    }, [navigate, enqueueSnackbar]);

    // Get the current social post
    useEffect(() => {
        axios
            .post(
                "https://planetpulse.tennisbowling.com/api/projects/get_social_post",
                { post_title: id },
                { withCredentials: true },
            )
            .then((response) => {
                setPost(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    useEffect(() => {
        axios.get("https://planetpulse.tennisbowling.com/api/get_user", {
            withCredentials: true,
        })
        .then((response) => {
            setCurrentUsername(response.data.user.username);
        })
        .catch((error) => {
            console.log("Error fetching current user:", error);
            enqueueSnackbar("Error fetching user information", { variant: "error" });
        });
    }, [enqueueSnackbar]);

    // Check if the user has liked this post
    useEffect(() => {
        if (post.title) {
            axios
                .post(
                    "https://planetpulse.tennisbowling.com/api/user_liked_social_post",
                    { post_title: post.title },
                    { withCredentials: true },
                )
                .then((response) => {
                    setLiked(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [post]);

    useEffect(() => {
        if (post.title) {
            axios
                .get("https://planetpulse.tennisbowling.com/api/get_post_comments", {
                    params: { post_title: post.title },
                    withCredentials: true,
                })
                .then((response) => {
                    setComments(response.data.comments);
                })
                .catch((error) => {
                    console.log(error);
                    enqueueSnackbar("Error fetching comments", { variant: "error" });
                });
        }
    }, [post.title, enqueueSnackbar]);

    const handleLike = () => {
        axios
            .post(
                "https://planetpulse.tennisbowling.com/api/like_social_post",
                { post_title: post.title },
                { withCredentials: true },
            )
            .then(() => {
                setLiked(true);
            setPost((prev) => ({
                ...prev,
                likes: [...prev.likes, currentUsername],
            }));
            enqueueSnackbar("Post liked", {
                variant: "success",
                autoHideDuration: 1000,
            });
            })
            .catch((error) => {
                if (
                    error.response?.data?.message ===
                    "User already likes this post"
                ) {
                    enqueueSnackbar("You already liked this post", {
                        variant: "info",
                        autoHideDuration: 1000,
                    });
                } else {
                    enqueueSnackbar("Error liking post", {
                        variant: "error",
                        autoHideDuration: 1000,
                    });
                }
            });
    };

    const handleCommentDelete = (deletedCommentText) => {
        setComments(comments.filter(comment => comment.text !== deletedCommentText));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://planetpulse.tennisbowling.com/api/create_comment",
                {
                    comment: { text: newComment },
                    original_post_title: post.title,
                },
                { withCredentials: true },
            );
            if (response.status === 200) {
                enqueueSnackbar("Comment added", { variant: "success", autoHideDuration: 1000 });
                setComments((prevComments) => [
                    ...prevComments,
                    { text: newComment, username: currentUsername, likes: [] },
                ]);
                setNewComment("");
            }
        } catch (error) {
            enqueueSnackbar("Error adding comment", { variant: "error", autoHideDuration: 1000 });
            console.log(error);
        }
    };

    return (
        <>
            <Sidebar />
            <Header name={window.location.pathname} />
            <div className="min-h-screen bg-gray-800 flex flex-col items-center py-8">
                <div className="max-w-2xl w-full bg-gray-900 shadow-md rounded-md overflow-hidden mb-6">
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
                                    liked ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
                                } text-white font-semibold py-1 px-4 rounded-md`}
                            >
                                {liked ? "Liked" : "Like"} ({post.likes?.length || 0})
                            </button>
                            <a
                                href="/"
                                className="mt-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-md"
                            >
                                Go Back
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-4 text-white">Comments</h2>
                    {comments.map((comment, index) => (
                        <Comment
                            key={index}
                            text={comment.text}
                            username={comment.username}
                            likes={comment.likes}
                            originalPostTitle={post.title}
                            onDelete={() => handleCommentDelete(comment.text)}
                        />
                    ))}
                    <form onSubmit={handleCommentSubmit} className="w-full mt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            rows="4"
                        />
                        <button
                            type="submit"
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Add Comment
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SocialPostPage;
