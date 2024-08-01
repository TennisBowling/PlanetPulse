import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';



const MainPopup = ({ volunteers }) => (
  <Popup trigger={
    <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md" >
      See Volunteers
    </a>
  } position="top center">
    {close => (
      <div className='bg-black p-3 mx-auto rounded-lg'>
        {volunteers.map((volunteer, index) => (
          <div key={index} className={index !== volunteers.length - 1 ? '' : ''}>
            <h1>{volunteer}</h1>
          </div>
        ))}

        {/* <a className="close mx-auto w-full" onClick={close}>
          &times;
        </a> */}
      </div>
    )}
  </Popup>
);


const SocialMediaPost = ({ header, body, isVolunteer, isFundraiser, imgSrc, username, showVolunteer, numVolunteers, numDonors, onDelete, listVolunteers }) => {
  const [clickedVolunteer, setClickedVolunteer] = useState(false);
  const [clickedDonate, setClickedDonate] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [volunteer, setVolunteer] = useState(false);
  const [donor, setDonor] = useState(false);
  const Navigate = useNavigate();
  if (imgSrc == null) {
    imgSrc = "/images/logo.png"
  }

  // Once user has selected to donate, let them know they donated if successful, and give them an error message if not.
  useEffect(() => {
    if (clickedDonate) {
      setVolunteer(true)
      axios.post("http://localhost:8080/projects/donate", { post_title: header }, { withCredentials: true })
        .then((res) => {
          enqueueSnackbar("Donating", { variant: "success", autoHideDuration: 1000 });
          Navigate("/donate")
        })
        .catch((error) => {
          if (error.response.data.message == "User is already donating for this post") {
            enqueueSnackbar("You are already donating to this post", { variant: "error", autoHideDuration: 1000 });
          } else {
            enqueueSnackbar("Error", { variant: "error", autoHideDuration: 1000 });
          }
        })
    }
  }, [clickedDonate]);

  // Once user has selected to volunteer, let them know they signed up if successful, and give them an error message if not.
  useEffect(() => {
    if (clickedVolunteer) {
      setVolunteer(true)
      axios.post("http://localhost:8080/projects/volunteer", { post_title: header }, { withCredentials: true })
        .then((res) => {
          enqueueSnackbar("Volunteering", { variant: "success", autoHideDuration: 1000 });
        })
        .catch((error) => {
          console.log(error)
          if (error.response.data.message == "User is already volunteering for this post") {
            enqueueSnackbar("You are already volunteering for this post", { variant: "error", autoHideDuration: 1000 });
          } else {
            enqueueSnackbar("Error", { variant: "error", autoHideDuration: 1000 });
          }
        })
    }
  }, [clickedVolunteer]);

  // Set whether user is volunteering or donating
  useEffect(() => {
    axios.post("http://localhost:8080/projects/user_status", { post_title: header }, { withCredentials: true })
      .then((res) => {
        setVolunteer(res.data.volunteering);
        setDonor(res.data.donating);
      })
  }, [])


  return (
    <div className="box-border max-w-md mx-auto h-[26rem] 2xl:h-[275px] rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-4 bg-gray-900">
      <div className="flex flex-col 2xl:flex-row h-full 2xl:h-[275px]">
        <div className="flex-shrink-0">
          <img className="h-48 w-full object-cover 2xl:h-full 2xl:w-48" src={imgSrc} alt="post image" />
        </div>
        <div className="p-4 w-[100%] flex flex-col h-full">
          <a href={"/postpage/" + header} className="font-bold block text-lg leading-tight font-large text-white hover:underline">{header}</a>
          <p className="block mt-1 text-md leading-tight font-medium text-white min-h-[1rem]">{username}</p>
          <div className='h-[100%] flex flex-row items-stretch'>
            <p className="mt-2 text-gray-400 w-[100%] h-[100%]">{body}</p>
            <div className=''>
              <div className="min-h-[100%] flex flex-col gap-y-[10px]  justify-end items-end">
                {isFundraiser && (
                  <>
                    <p>{numDonors}</p>
                    {/* Show to the user that they succeeded */}
                    {!donor ? (
                      <button onClick={(e) => setClickedDonate(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-md">
                        Donate!
                      </button>) : (
                      <button onClick={(e) => setClickedDonate(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-md">
                        Donating!
                      </button>
                    )}
                  </>
                )}
                {isVolunteer && (
                  <>
                    <p>{numVolunteers}</p>
                    {/* Show to the user that they succeeded */}
                    {!volunteer ? (
                      <button onClick={(e) => setClickedVolunteer(true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md">
                        Volunteer!
                      </button>) : (
                      <button onClick={(e) => setClickedVolunteer(true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md">
                        Volunteering!
                      </button>
                    )}
                  </>
                )}
                {showVolunteer && (
                  // Popup with list of examples
                  <MainPopup volunteers={listVolunteers} />

                )}
                {/* When delete button is pressed, delete the project */}
                {onDelete && (
                  <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-md" onClick={onDelete}>
                    Delete
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SocialMediaPost;