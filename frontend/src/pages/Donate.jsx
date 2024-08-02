import React from "react";
import Header from "./Header";
import Sidebar from "./layouts/Sidebar";

const Donate = () => {
    return (
        <>
            {/* In progress */}
            <Header name={window.location.pathname} />
            <Sidebar />
            <div className="p-4">
                <h1 className="text-3xl my-4 text-center">
                    in progress... <p className="">come back later for more!</p>
                </h1>
                <div className="flex flex-col content-center rounded-xl w-[600px] p-4 mx-auto"></div>
            </div>
        </>
    );
};

export default Donate;
