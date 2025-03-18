import React, { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "./SocketContext.jsx";
import {
  FaVideo,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";
import { FaHandPaper } from "react-icons/fa";
import { TbHandOff } from "react-icons/tb";
import { useSelector } from "react-redux";

const VideoMeet = ({ userMicon, userVideoon }) => {
  const { myVideo, userVideo, raiseHand, lowerHand, leaveCall, callAccepted } =
    useContext(SocketContext);
  const streamRef = useRef(null); // Store stream without causing re-renders
  const [videoOn, setVideoOn] = useState(userVideoon);
  const [micOn, setMicOn] = useState(userMicon);
  const [displayUser, setDisplayUser] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const { meetStore } = useSelector((state) => state);
  const { authStore } = useSelector((state) => state);

  useEffect(() => {
    let currentStream;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        currentStream = mediaStream;
        streamRef.current = mediaStream;
        if (myVideo.current && videoOn) {
          myVideo.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Could not access media devices.");
      });

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoOn]);

  useEffect(() => {
    setDisplayUser(!!userVideo.current?.srcObject);
  }, [userVideo.current?.srcObject]);

  const toggleVideo = () => {
    setVideoOn(!videoOn);
    if (myVideo.current) {
      myVideo.current.srcObject = videoOn ? streamRef.current : null;
    }
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const handleRaiseHand = () => {
    const meetid = meetStore.meet_id;
    const userId = authStore.user.email;
    if (meetid && userId) {
      raiseHand(meetid, userId);
      setHandRaised(true);
    }
  };

  const handleLowerHand = () => {
    const meetid = meetStore.meet_id;
    const userId = authStore.user.email;
    if (meetid && userId) {
      lowerHand(meetid, userId);
      setHandRaised(false);
    }
  };

  const endCalltoggle = () => {
    leaveCall();
    console.log("Call ended");
    window.location.href = "/";
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-blue-500 min-h-screen py-10 px-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Video Meeting
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg overflow-hidden shadow-md">
            <h2 className="bg-gray-100 py-2 px-3 text-sm font-medium text-gray-700 border-b border-gray-200">
              Your Video
            </h2>
            <div className="relative w-full aspect-video bg-black">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay={videoOn}
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{ display: videoOn ? "block" : "none" }}
              />
              {!videoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl">
                  <FaVideoSlash />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <h2 className="bg-gray-100 py-2 px-3 text-sm font-medium text-gray-700 border-b border-gray-200">
              Remote Video
            </h2>
            <div className="w-full aspect-video bg-black">
              {displayUser ? (
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FaVideoSlash className="text-5xl mb-2" />
                  <p className="text-sm">No user video</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleVideo}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-md transition-colors duration-200 ${
              videoOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {videoOn ? <FaVideoSlash /> : <FaVideo />}
            <span className="hidden md:inline">
              {videoOn ? "Turn Off" : "Turn On"} Video
            </span>
          </button>

          <button
            onClick={toggleMic}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-md transition-colors duration-200 ${
              micOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {micOn ? <FaMicrophoneSlash /> : <FaMicrophone />}
            <span className="hidden md:inline">
              {micOn ? "Mute" : "Unmute"}
            </span>
          </button>

          <button
            onClick={handRaised ? handleLowerHand : handleRaiseHand}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-md transition-colors duration-200 ${
              handRaised
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {handRaised ? <FaHandPaper /> : <TbHandOff />}
            <span className="hidden md:inline">
              {handRaised ? "Lower Hand" : "Raise Hand"}
            </span>
          </button>

          <button
            onClick={endCalltoggle}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          >
            <FaPhoneSlash />
            <span className="hidden md:inline">End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoMeet;
