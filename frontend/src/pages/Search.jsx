import React from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./layouts/Sidebar";
import Post from "./layouts/PostView";
import SocialPost from "./layouts/SocialPostView";

const Search = () => {
    const Navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");

    // Check if user is logged in
    useEffect(() => {
        axios
            .get("https://planetpulse.tennisbowling.com/api/", {
                withCredentials: true,
            })
            .then((res) => {
                if (!res.data.authenticated) {
                    Navigate("/login");
                }
            })
            .catch((error) => {
                enqueueSnackbar("Error", {
                    variant: "error",
                    autoHideDuration: 1000,
                });
            });
        setLoading(false);
    }, []);

    // Search for posts once user submits query
    useEffect(() => {
        if (submittedSearch) {
            axios
                .post(
                    "https://planetpulse.tennisbowling.com/api/projects/search_posts",
                    { search_query: search },
                    { withCredentials: true }
                )
                .then((res) => {
                    setPosts(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    enqueueSnackbar("Error searching posts", {
                        variant: "error",
                        autoHideDuration: 3000,
                    });
                    setLoading(false);
                });
        }
    }, [submittedSearch]);

    const renderPost = (post, index) => {
        if ('isVolunteer' in post) {
            // This is a regular post
            return (
                <Post
                    key={index}
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
            );
        } else {
            // This is a social post
            return (
                <SocialPost
                    key={index}
                    title={post.title}
                    body={post.text}
                    imgSrc={post.image}
                    username={post.username}
                    likes={post.likes.length}
                />
            );
        }
    };

    return (
        <>
            <Header name={window.location.pathname} />
            <Sidebar />
            <div className="p-4">
                <h1 className="text-3xl my-4 text-center">Search</h1>
                <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] max-w-[75%] p-4 mx-auto">
                    <div className="my-4">
                        <label className="text-xl mr-4">Search Query</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-2 border-gray-500 px-4 py-2 w-full rounded-xl text-black"
                        />
                    </div>
                    <button
                        className="p-2 bg-sky-400 m-8 rounded-xl border-solid border-2 border-sky-400 hover:border-sky-600"
                        onClick={() => setSubmittedSearch(search)}
                    >
                        Search
                    </button>
                </div>
                {submittedSearch !== "" && (
                    <div className="border-0 flex-grow p-4">
                        <div className="grid gap-4 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 px-[10%] py-16 text-white">
                            {posts.map((post, index) => renderPost(post, index))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Search;