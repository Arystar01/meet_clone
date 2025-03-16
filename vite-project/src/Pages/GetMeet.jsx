import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:3000"); // Change to your backend server

const GetMeet = () => {
  const { meet_ID } = useParams();
  const UID = uuidv4();

  const [peers, setPeers] = useState({});
  const videoGrid = useRef(null);
  const myVideo = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    if (!meet_ID || !UID) return;

    // Set up PeerJS
    peerInstance.current = new Peer(UID, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          {
            urls: "turn:numb.viagenie.ca",
            credential: "yourpassword",
            username: "yourusername@example.com",
          },
        ],
      },
    });

    // Get user video
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        myVideo.current.play();
        addVideoStream(myVideo.current, stream);

        // Connect to other users
        peerInstance.current.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userStream) => {
            addVideoStream(video, userStream);
          });
        });

        socket.emit("join-room", meet_ID, UID);

        socket.on("user-connected", (userId) => {
          if (!peers[userId]) {
            connectToNewUser(userId, myVideo.current.srcObject);
          }
        });

        socket.on("user-disconnected", (userId) => {
          if (peers[userId]) peers[userId].close();
        });
      });

    return () => {
      socket.disconnect();
      if (peerInstance.current) peerInstance.current.destroy();
    };
  }, [meet_ID, UID]);

  function connectToNewUser(userId, stream) {
    const call = peerInstance.current.call(userId, stream);
    const video = document.createElement("video");

    call.on("stream", (userStream) => {
      addVideoStream(video, userStream);
    });

    call.on("close", () => {
      video.remove();
    });

    setPeers((prevPeers) => ({ ...prevPeers, [userId]: call }));
  }

  function addVideoStream(video, stream) {
    if (!videoGrid.current) return;

    const existingVideos = Array.from(videoGrid.current.children);
    if (existingVideos.some((v) => v.srcObject === stream)) return; // Prevent duplicate videos

    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => video.play());
    videoGrid.current.append(video);
  }

  return (
    <div>
      <h2>Welcome to Meeting Room: {meet_ID}</h2>
      <div ref={videoGrid} style={{ display: "flex", gap: "10px" }}>
        <video ref={myVideo} muted autoPlay playsInline />
      </div>
      <div>{UID}</div>
    </div>
  );
};

export default GetMeet;
