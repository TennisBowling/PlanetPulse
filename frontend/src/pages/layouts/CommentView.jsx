import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const Comment = ({
    text,
    username,
    likes: initialLikes,
    originalPostTitle,
    onDelete,
}) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        checkLikeStatus();
    }, []);

    const checkLikeStatus = async () => {
        try {
            const response = await axios.get(
                "https://planetpulse.tennisbowling.com/api/user_liked_comment",
                {
                    params: { original_post_title: originalPostTitle, comment_text: text },
                    withCredentials: true,
                }
            );
            setLiked(response.data);
        } catch (error) {
            console.error("Error checking like status:", error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(
                "https://planetpulse.tennisbowling.com/api/like_comment",
                { original_post_title: originalPostTitle, comment_text: text },
                { withCredentials: true }
            );
            setLiked(true);
            setLikes((prevLikes) => prevLikes + 1);
            enqueueSnackbar("Comment liked successfully", { variant: "success" });
        } catch (error) {
            if (error.response?.data?.message === "User has already liked this comment") {
                enqueueSnackbar("You've already liked this comment", { variant: "info" });
            } else {
                enqueueSnackbar("Error liking comment", { variant: "error" });
            }
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                "https://planetpulse.tennisbowling.com/api/delete_comment",
                {
                    data: { original_post_title: originalPostTitle, comment_text: text, original_post_username: username },
                    withCredentials: true,
                }
            );
            onDelete();
            enqueueSnackbar("Comment deleted successfully", { variant: "success" });
        } catch (error) {
            if (error.response?.status === 403) {
                enqueueSnackbar("You don't have permission to delete this comment", { variant: "error" });
            } else {
                enqueueSnackbar("Error deleting comment", { variant: "error" });
            }
        }
    };

    return (
        <div className="box-border max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-4 bg-gray-800">
            <div className="p-4">
                <p className="text-md text-white">{username}</p>
                <p className="mt-2 text-gray-300">{text}</p>
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={handleLike}
                        className={`px-4 py-2 rounded ${liked ? "bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                    >
                        {liked ? "Liked" : "Like"} ({likes})
                    </button>
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;