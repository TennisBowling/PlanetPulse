import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Header = (props) => {
    const { name } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    // Log out the user
    const logout = () => {
        axios
            .delete("https://planetpulse.tennisbowling.com/api/logout", {
                withCredentials: true,
            })
            .then((response) => {
                enqueueSnackbar("Logout Success", {
                    variant: "success",
                    autoHideDuration: 1000,
                });
                window.location.href = "/login";
            })
            .catch((error) => {
                enqueueSnackbar("Error", {
                    variant: "error",
                    autoHideDuration: 1000,
                });
            });
    };

    // Check if user is logged in
    useEffect(() => {
        setLoading(true);
        setLoggedIn(false);
        let res = axios
            .get("https://planetpulse.tennisbowling.com/api/", {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data.authenticated) {
                    setLoggedIn(true);
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

    // Depending on whether the user is logged in, change the header links
    function CreateHeaderLinks() {
        if (loggedIn) {
            return (
                <div className="flex items-center gap-10">
                    <a
                        href="/profile"
                        className={` ${window.location.pathname === "/profile" ? "text-[gray]" : "text-[blue]"}`}
                    >
                        <p className="text-lg text-white">Profile</p>
                    </a>
                    <a
                        href="javascript:void(0);"
                        onClick={logout}
                        className="text-[blue]"
                    >
                        <p className="text-lg text-white">Logout</p>
                    </a>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-10">
                    <a
                        href="/login"
                        className={` ${window.location.pathname === "/login" ? "text-[gray]" : "text-[blue]"}`}
                    >
                        <p className="text-lg text-white">Log In</p>
                    </a>
                    <a
                        href="/register"
                        className={` ${window.location.pathname === "/register" ? "text-[gray]" : "text-[blue]"}`}
                    >
                        <p className="text-lg text-white">Register</p>
                    </a>
                </div>
            );
        }
    }
    return (
        <>
            <div className="sticky top-0 z-10">
                <div className="sticky top-0 w-[100%] bg-gray-700 h-[75px] px-10 flex items-center justify-between z-10">
                    <a href="/">
                        <div className="flex items-center">
                            <img
                                src={"/images/logo.png"}
                                alt="Logo"
                                className="h-[50px] w-[65px] mr-5 mt-1"
                            />
                            <h1 className="text-2xl font-bold text-white font-poppin hidden md:block">
                                Planet Pulse
                            </h1>
                        </div>
                    </a>
                    {loading ? (
                        <h1 className="text-xl">Loading...</h1>
                    ) : (
                        CreateHeaderLinks()
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
