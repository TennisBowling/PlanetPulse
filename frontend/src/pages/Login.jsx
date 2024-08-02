import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Header from "./Header";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const Navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    // Check if user is logged in
    useEffect(() => {
        setLoading(true);
        axios
            .get("https://planetpulse.tennisbowling.com/api/", {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data.authenticated) {
                    Navigate("/");
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

    // Handle login button
    const handleLogin = () => {
        const data = {
            username,
            password,
        };
        axios
            .post("https://planetpulse.tennisbowling.com/api/login", data, {
                withCredentials: true,
            })
            .then((res) => {
                enqueueSnackbar("Login Success", {
                    variant: "success",
                    autoHideDuration: 1000,
                });
                Navigate("/");
            })
            .catch((error) => {
                // Display an error message.
                enqueueSnackbar(error.response.data.message, {
                    variant: "error",
                    autoHideDuration: 1000,
                });
            });
    };

    // When enter is pressed, also check login
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };
    return (
        <>
            <Header name={window.location.pathname} />
            {loading ? (
                <h1 className="text-xl">Loading...</h1>
            ) : (
                <div className="p-4">
                    <h1 className="text-3xl my-4 text-center font-bold">
                        Login
                    </h1>
                    <div className="flex flex-col rounded-xl w-[600px] max-w-[75vw] p-4 mx-auto">
                        <div className="my-4">
                            <label className="text-xl mr-4 text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-2 border-gray-500 px-4 py-2 w-full rounded-xl text-black"
                            />
                        </div>
                        <div className="my-4">
                            <label className="text-xl mr-4 text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-2 border-gray-500 px-4 py-2 w-full rounded-xl text-black"
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <button
                            className="p-2 bg-sky-400 m-8 rounded-xl bg-gradient-to-r from-green-300 to-emerald-700"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </div>
                    <div className="text-center text-xl hover:underline">
                        <Link to="/register" className="text-blue-500">
                            Don't have an account? Register here.
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
