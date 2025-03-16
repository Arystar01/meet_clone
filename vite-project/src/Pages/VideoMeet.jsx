import React, { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "./SocketContext.jsx";
import {
  FaVideo,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
} from "react-icons/fa";

const VideoMeet = ({ userMicon, userVideoon }) => {
  const { myVideo, userVideo } = useContext(SocketContext);
  const streamRef = useRef(null); // Store stream without causing re-renders
  const [videoOn, setVideoOn] = useState(userVideoon);
  const [micOn, setMicOn] = useState(userMicon);
  const [displayUser, setDisplayUser] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        streamRef.current = mediaStream;
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Only run once when component mounts

  useEffect(() => {
    setDisplayUser(!!userVideo.current?.srcObject);
  }, [userVideo.current?.srcObject]);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-6 bg-purple-300 h-screen">
      <div className="grid grid-cols-2 justify-center  items-center gap-6 p-6">
        <div className="border-2 border-black p-4 rounded-lg shadow-lg bg-white w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">My Video</h2>
          <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="border-2 border-black p-4 rounded-lg shadow-lg bg-white w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            User Video
          </h2>
          <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
            {displayUser ? (
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-white justify-center h-full">
                User is not sharing video
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={toggleVideo}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition text-white font-medium ${
            videoOn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {videoOn ? <FaVideoSlash /> : <FaVideo />}
          {videoOn ? "Turn Off Video" : "Turn On Video"}
        </button>

        <button
          onClick={toggleMic}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition text-white font-medium ${
            micOn
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {micOn ? <FaMicrophoneSlash /> : <FaMicrophone />}
          {micOn ? "Mute" : "Unmute"}
        </button>
      </div>
    </div>
  );
};

export default VideoMeet;
