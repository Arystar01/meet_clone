import React, { useState } from "react";
import axios from "axios";
import NewMeet from "./NewMeet.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setMeetId,
  setMeetName,
  setMeetDescription,
  setMeetDate,
  setMeetOwner,
setMeetParticipants,
  setMeetType,
 
} from "../redux/MeetSlice.js";

const Meet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [meetingCode, setMeetingCode] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const UID = useSelector((state) => state.authStore.user?.UID);
  // const state=useSelector((state)=>state);
  // console.log("Redux State:", state);
  const handleJoinMeet = async () => {
    if (!UID) {
      alert("User not authenticated. Please log in.");
      return;
    }
    if (!meetingCode.trim()) {
      alert("Please enter a valid meeting code.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const meet_ID = meetingCode.trim();
      const res = await axios.get(`http://localhost:3000/api/user/getMeets/${meet_ID}?UID=${UID}`, {
        withCredentials: true,
      });
      console.log("meet ", res);
      dispatch(setMeetId(res.data.meet.meet_Id));
      dispatch(setMeetName(res.data.meet.title));
      dispatch(setMeetDescription(res.data.meet.caption));
      dispatch(setMeetOwner(res.data.meet.host_username));
      dispatch(setMeetParticipants(res.data.meet.attendees));
      dispatch(setMeetType(res.data.meet.meet_type));
      dispatch(setMeetDate(res.data.meet.time))
      navigate(`/preview/${meetingCode}`);
    } catch (error) {
      console.error("Error while joining meet", error);
      setError("Failed to join the meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] p-10 w-full bg-gradient-to-b from-purple-300 to-purple-950 flex flex-col pt-20">
      <div className="flex justify-between items-center px-20">
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-opacity-50">
          Create a Meet
        </button>
        <button className="bg-white text-purple-700 border-2 border-purple-600 hover:bg-purple-100 text-lg font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
          Calendar
        </button>
      </div>

      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl font-bold text-white mb-4">Join or Create a Meeting</h1>
        <p className="text-lg text-white opacity-80">Collaborate with your team in real-time</p>
      </div>

      <div className="flex justify-center mt-10">
        <input
          type="text"
          placeholder="Enter meeting code"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
          className="w-80 h-12 px-4 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <button
          onClick={handleJoinMeet}
          disabled={loading}
          className={`ml-4 ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
            } text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105`}
        >
          {loading ? "Joining..." : "Join"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {openCreate && <NewMeet openCreate={openCreate} setOpenCreate={setOpenCreate} />}
    </div>
  );
};

export default Meet;
