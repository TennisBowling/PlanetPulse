import React from "react";

const Sidebar = () => {
    return (
        <>
            {/* Creates a sidebar on the left side of the screen, and center justifies all elements */}
            <div className="flex md:flex-col flex-row bottom-0 md:bottom-auto justify-center md:h-screen bg-gray-900 md:w-auto w-screen text-white p-4 fixed z-10">
                <div className="md:flex-col flex flex-row items-center gap-10 md:gap-auto">
                    {/* The 6 icons, each redirecting the user to their respective pages */}
                    <a
                        href="/"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400"
                    >
                        <img
                            src="https://www.svgrepo.com/show/529026/home.svg"
                            className="h-6 w-6"
                        />
                    </a>
                    <a
                        href="/createpost"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400"
                    >
                        <img
                            src="https://www.svgrepo.com/show/528985/gallery-edit.svg"
                            className="w-6 h-6"
                        />
                    </a>
                    <a
                        href="/createsocialpost"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400"
                    >
                        <img
                            src="https://www.svgrepo.com/show/411499/create.svg"
                            className="w-6 h-6"
                        />
                    </a>
                    <a
                        href="/search"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400"
                    >
                        <img
                            src="https://www.svgrepo.com/show/529700/magnifer.svg"
                            className="w-6 h-6"
                        />
                    </a>
                    <a
                        href="/profile"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400"
                    >
                        <img
                            src="https://www.svgrepo.com/show/529279/user-circle.svg"
                            className="w-6 h-6"
                        />
                    </a>
                    <a
                        href="/information"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-400"
                    >
                        <img
                            src="https://www.svgrepo.com/show/529032/info-square.svg"
                            className="w-6 h-6"
                        />
                    </a>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
