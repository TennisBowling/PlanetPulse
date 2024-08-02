import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
                    Navigate("/profile");
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

    // Create the account
    const handleRegister = () => {
        const data = {
            username,
            password,
        };
        if (password !== confirmPassword) {
            enqueueSnackbar("Passwords do not match!", {
                variant: "error",
                autoHideDuration: 1000,
            });
            return;
        }
        axios
            .post("https://planetpulse.tennisbowling.com/api/register", data, {
                withCredentials: true,
            })
            .then((res) => {
                enqueueSnackbar("Registered", {
                    variant: "success",
                    autoHideDuration: 1000,
                });
                Navigate("/profile");
            })
            .catch((error) => {
                // Display an error message.
                enqueueSnackbar(error.response.data.message, {
                    variant: "error",
                    autoHideDuration: 1000,
                });
            });
    };

    // If user pressed enter, also submit register request
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleRegister();
        }
    };
    return (
        <>
            <Header name={window.location.pathname} />
            {loading ? (
                <h1 className="text-center">Loading...</h1>
            ) : (
                <div className="p-4">
                    <h1 className="text-3xl my-4 text-center font-bold">
                        Register
                    </h1>
                    <div className="flex flex-col border-sky-400 rounded-xl w-[600px] max-w-[75vw] p-4 mx-auto">
                        <div className="my-4">
                            <label className="text-xl mr-4 text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-2 border-gray-00 px-4 py-2 w-full rounded-xl text-black"
                            />
                        </div>
                        <div className="my-4">
                            <label className="text-xl mr-4 text-gray-500">
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
                        <div className="my-3">
                            <label className="text-xl mr-4 text-gray-500">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="border-2 border-gray-500 px-4 py-2 w-full rounded-xl text-black"
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <button
                            className="p-2 bg-sky-400 m-8 rounded-xl border-solid border-2 border-sky-400 hover:border-sky-600"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                    <div className="text-center text-xl hover:underline">
                        <Link to="/login" className="text-blue-500">
                            Have an account? Login here.
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;
