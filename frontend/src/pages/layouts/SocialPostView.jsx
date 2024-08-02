import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from "notistack";

const SocialPost = ({ title, body, imgSrc, username, likes: initialLikes, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    checkLikeStatus();
  }, []);

  const checkLikeStatus = async () => {
    try {
      const response = await axios.post("https://planetpulse.tennisbowling.com/api/projects/user_liked_social_post", 
        { post_title: title }, 
        { withCredentials: true }
      );
      setLiked(response.data);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post("https://planetpulse.tennisbowling.com/api/like_social_post", 
        { post_title: title }, 
        { withCredentials: true }
      );
      setLiked(true);
      setLikes(prevLikes => prevLikes + 1);
      enqueueSnackbar("Post liked successfully", { variant: "success" });
    } catch (error) {
      if (error.response?.data?.message === "User already likes this post") {
        enqueueSnackbar("You've already liked this post", { variant: "info" });
      } else {
        enqueueSnackbar("Error liking post", { variant: "error" });
      }
    }
  };

  return (
    <div className="box-border max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-4 bg-gray-900">
      <div className="p-4">
        <h2 className="font-bold text-lg text-white">{title}</h2>
        <p className="text-md text-white">{username}</p>
        {imgSrc && <img className="w-full h-48 object-cover mt-2" src={imgSrc} alt="post image" />}
        <p className="mt-2 text-gray-400">{body}</p>
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={handleLike} 
            className={`px-4 py-2 rounded ${liked ? 'bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {liked ? 'Liked' : 'Like'} ({likes})
          </button>
          {onDelete && (
            <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialPost;