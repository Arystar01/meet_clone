import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Dialog, DialogContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewMeet = ({ openCreate, setOpenCreate }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [time, setTime] = useState("");
  const [meetType, setMeetType] = useState("private");
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState("");

  const host_id = String(useSelector((state) => state.authStore.user?.UID));

  const handleAddAttendee = () => {
    if (newAttendee) {
      setAttendees([...attendees, newAttendee]);
      setNewAttendee("");
    }
  };

  const handleRemoveAttendee = (attendeeToRemove) => {
    setAttendees(attendees.filter((attendee) => attendee !== attendeeToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !time) {
      alert("Please fill in the title and time fields.");
      return;
    }

    if (!host_id) {
      alert("Error: Host ID is missing.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/newmeet",
        {
          title,
          caption,
          time,
          meet_type: meetType,
          attendees,
          host_id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Response from server:", res);
      const meet_ID = res.data.meet.meet_Id;
      console.log("meet_ID:", meet_ID);
      setOpenCreate(false);
      console.log("Meet created successfully");
      if (meet_ID) {
        navigate(`/getMeets/${meet_ID}`);
      } else {
        console.error("meet_ID is undefined:", res);
      }
    } catch (error) {
      console.log("Error while creating meet", error);
    }
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
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAttendee())}
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
                  &times;
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