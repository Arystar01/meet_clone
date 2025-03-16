import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Dialog, DialogContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  setMeetId,
  setMeetOwnerId,
  setMeetName,
  setMeetDescription,
  setMeetDate,
  setMeetOwner,
  setMeetParticipants,
  setMeetType,
  setMeetStatus,
} from "../redux/MeetSlice.js";

const createMeet = (meetData, navigate) => async (dispatch) => {
  try {
    console.log("Sending Meet Data:", meetData); // ✅ Debugging API request

    const res = await axios.post("http://localhost:3000/api/user/newmeet", meetData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("Response from server:", res.data); // ✅ Debugging server response

    const meet_ID = res.data.meet.meet_Id;

    dispatch(setMeetId(meet_ID));
    dispatch(setMeetName(meetData.title));
    dispatch(setMeetDescription(meetData.caption));
    dispatch(setMeetDate(meetData.time));
    dispatch(setMeetOwner(meetData.host_username));
    dispatch(setMeetOwnerId(meetData.host_id));
    dispatch(setMeetParticipants(meetData.attendees));
    dispatch(setMeetType(meetData.meet_type)); // ✅ Ensure meet type is stored in Redux
    dispatch(setMeetStatus("active"));

    navigate(`/preview/${meet_ID}`); // ✅ Moved this outside Redux action
  } catch (error) {
    console.error("Error while creating meet:", error);
  }
};

const NewMeet = ({ openCreate, setOpenCreate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [time, setTime] = useState("");
  const [meetType, setMeetType] = useState("private"); // ✅ Ensure default value
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState("");

  const host_id = useSelector((state) => state.authStore.user?.UID) || "";
  const host_username = useSelector((state) => state.authStore.user?.username) || "";

  const handleAddAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee)) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee("");
    }
  };

  const handleRemoveAttendee = (attendeeToRemove) => {
    setAttendees(attendees.filter((attendee) => attendee !== attendeeToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !time) {
      alert("Please fill in the title and time fields.");
      return;
    }

    if (!host_id) {
      alert("Error: Host ID is missing.");
      return;
    }

    const meetData = {
      title,
      caption,
      time,
      meet_type: meetType, // ✅ Ensuring meet_type is included
      attendees,
      host_id,
      host_username,
    };

    console.log("Submitting Meet Data:", meetData); // ✅ Debugging frontend data before sending

    dispatch(createMeet(meetData, navigate));
    setOpenCreate(false);
  };

  return (
    <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4 text-center">Create New Meet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Caption</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Meet Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={meetType}
              onChange={(e) => setMeetType(e.target.value)}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Attendees</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter attendee email"
                className="flex-1 p-2 border rounded-md"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAttendee())}
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                onClick={handleAddAttendee}
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {attendees.map((attendee, index) => (
              <div key={index} className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
                <span className="text-sm">{attendee}</span>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveAttendee(attendee)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              onClick={() => setOpenCreate(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create Meet
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMeet;
