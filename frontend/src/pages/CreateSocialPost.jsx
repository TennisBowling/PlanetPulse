import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Sidebar from './layouts/Sidebar';
import Header from './Header';
import SocialPostView from './layouts/SocialPostView';

const CreateSocialPost = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imagelink, setImageLink] = useState(null);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Check if user is logged in
    useEffect(() => {
        axios
            .get("https://planetpulse.tennisbowling.com/api/", { withCredentials: true })
            .then((res) => {
                if (!res.data.authenticated) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                enqueueSnackbar("Error", { variant: "error", autoHideDuration: 1000 });
            });
    }, []);

    // Get information on the user
    useEffect(() => {
        axios.get("https://planetpulse.tennisbowling.com/api/get_user", { withCredentials: true })
            .then((res) => {
                setUser(res.data.user);
            })
    }, [])

    // Check if new image has been requested for upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        const url = URL.createObjectURL(file);
        setImageUrl(url);
    };

    // See if submit button clicked
    const handleSubmit = (e) => {
        e.preventDefault();
        if (image) {
            onImageSubmit(image);
        }
    };

    // Upload image to CDN 
    const onImageSubmit = async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        setLoading(true);

        try {
            const response = await axios.post(
                "https://cdn.tennisbowling.com/upload",
                formData
            );
            setImageLink(response.data.location);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    // Create the social post
    const handleSavePost = () => {
        let post = {
            title,
            text,
        };

        if (imagelink != null) {
            post.image = imagelink
        }
        setLoading(true);
        axios
            .post('https://planetpulse.tennisbowling.com/api/create_social_post', { post }, { withCredentials: true })
            .then(() => {
                setLoading(false);
                enqueueSnackbar('Social post created successfully', { variant: 'success' });
                navigate('/');
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar('Error', { variant: 'error' });
                console.log(error);
            });
    }

    return (
        <>
            <Header name={window.location.pathname} />
            <Sidebar />
            <div className="h-[100%] py-[5rem] bg-gray-800 flex flex-col justify-center items-center text-center min-w-[100vw] top-0 box-border">
                <div className="bg-gray-800 overflow-hidden">
                    <div className='flex flex-col rounded-xl w-[45rem] max-w-[80vw] p-4 m-auto bg-gray-900 -z-[10] overflow-auto'>
                        <h1 className='text-3xl my-4 text-white font-bold align-middle'>Create Social Post</h1>
                        <div className='my-4'>
                            <label className='text-xl mr-4 text-gray-300 w-1/3'>Title:</label>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='px-4 py-2 w-5/6 bg-gray-800 text-white rounded-xl'
                            />
                        </div>
                        <div className='my-4 align-middle'>
                            <label className='text-xl mr-4 text-gray-300 w-1/6'>Text:</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className='px-4 py-2 w-5/6 bg-gray-800 text-white rounded-xl'
                                rows="4"
                            />
                        </div>
                        <form onSubmit={handleSubmit} className="mt-4 items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-white file:rounded-xl file:bg-gradient-to-r from-violet-500 to-orange-500 file:border-none file:h-8 file:text-white"
                            />
                            {imageUrl && (
                                <div>
                                    <button
                                        type="submit"
                                        className="mt-2 text-white block w-full py-2 px-4 mb-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        Submit
                                    </button>
                                    <p className="text-lg font-semibold mb-2 text-white">
                                        Preview:
                                    </p>
                                    <img
                                        src={imageUrl}
                                        alt="Uploaded"
                                        className="mx-auto rounded-lg max-h-80 mb-4 text-white"
                                    />
                                </div>
                            )}
                        </form>
                        <button className='p-2 m-8 bg-gradient-to-r from-green-300 to-emerald-700 rounded-xl text-white font-bold' onClick={handleSavePost}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Preview of the social post */}
            {title && text && (
                <div className="mt-8">
                    <h2 className="text-2xl text-white font-bold mb-4" style={{ textAlign: 'center' }}>Post Preview:</h2>
                    <SocialPostView
                        title={title}
                        body={text}
                        imgSrc={imageUrl || imagelink}
                        username={user.username} // We should set this
                        likes={0}
                    />
                </div>
            )}
        </>
    )
}

export default CreateSocialPost;