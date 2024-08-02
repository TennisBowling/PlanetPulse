import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import Sidebar from "./layouts/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [volunteer, setVolunteer] = useState(false);
    const [donor, setDonor] = useState(false);

    const [clickedVolunteer, setClickedVolunteer] = useState(false);
    const [clickedDonate, setClickedDonate] = useState(false);

    const Navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Check if user is logged in
    useEffect(() => {
        setLoading(true);
        axios
            .get("https://planetpulse.tennisbowling.com/api/", {
                withCredentials: true,
            })
            .then((res) => {
                console.log(res.data);
                if (!res.data.authenticated) {
                    Navigate("../login");
                }
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar("Error", {
                    variant: "error",
                    autoHideDuration: 1000,
                });
            });
    }, []);

    // Get the current post
    useEffect(() => {
        axios
            .post(
                "https://planetpulse.tennisbowling.com/api/projects/get_post",
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
    });

    // Get the user's status on the post

    // Check if user pressed donate
    useEffect(() => {
        if (clickedDonate) {
            setVolunteer(true);
            axios
                .post(
                    "https://planetpulse.tennisbowling.com/api/projects/donate",
                    { post_title: post.title },
                    { withCredentials: true },
                )
                .then((res) => {
                    enqueueSnackbar("Donating", {
                        variant: "success",
                        autoHideDuration: 1000,
                    });
                })
                .catch((error) => {
                    if (
                        error.response.data.message ==
                        "User is already donating for this post"
                    ) {
                        enqueueSnackbar(
                            "You are already donating to this post",
                            { variant: "error", autoHideDuration: 1000 },
                        );
                    } else {
                        enqueueSnackbar("Error", {
                            variant: "error",
                            autoHideDuration: 1000,
                        });
                    }
                });
        }
    }, [clickedDonate]);

    // Check if user pressed volunteer
    useEffect(() => {
        if (clickedVolunteer) {
            setVolunteer(true);
            axios
                .post(
                    "https://planetpulse.tennisbowling.com/api/volunteer",
                    { post_title: post.title },
                    { withCredentials: true },
                )
                .then((res) => {
                    enqueueSnackbar("Volunteering", {
                        variant: "success",
                        autoHideDuration: 1000,
                    });
                })
                .catch((error) => {
                    if (
                        error.response.data.message ==
                        "User is already volunteering for this post"
                    ) {
                        enqueueSnackbar(
                            "You are already volunteering for this post",
                            { variant: "error", autoHideDuration: 1000 },
                        );
                    } else {
                        enqueueSnackbar("Error", {
                            variant: "error",
                            autoHideDuration: 1000,
                        });
                    }
                });
        }
    }, [clickedVolunteer]);

    return (
        <>
            <Sidebar />
            <Header name={window.location.pathname} />
            <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
                <div className="max-w-lg w-full bg-gray-900 shadow-md rounded-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">
                            {post.title}
                        </h1>
                        <p className="mb-2">Posted by {post.username}</p>
                        {post.image != undefined ? (
                            <img
                                src={post.image}
                                alt="Post"
                                className="w-full h-auto mb-4"
                            />
                        ) : (
                            <img
                                src="/images/logo.png"
                                alt="Post"
                                className="w-full h-auto mb-4"
                            />
                        )}
                        <p className="mb-4">{post.text}</p>
                        <div className="flex justify-between">
                            {post.isVolunteer ? (
                                <>
                                    {volunteer ? (
                                        <button
                                            onClick={(e) =>
                                                setClickedVolunteer(true)
                                            }
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md"
                                        >
                                            Volunteering!
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) =>
                                                setClickedVolunteer(true)
                                            }
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md"
                                        >
                                            Volunteer
                                        </button>
                                    )}
                                </>
                            ) : null}

                            {post.isFundraiser ? (
                                <>
                                    {donor ? (
                                        <button
                                            onClick={(e) =>
                                                setClickedDonate(true)
                                            }
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md"
                                        >
                                            Donating!
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) =>
                                                setClickedDonate(true)
                                            }
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md"
                                        >
                                            <a href="/donate">Donate!</a>
                                        </button>
                                    )}
                                </>
                            ) : null}
                            <a
                                href="/"
                                className="mt-1 bg-red-500 hover:bg-rd-600 text-white font-semibold py-1 px-4 rounded-md"
                            >
                                Go Back
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPage;
