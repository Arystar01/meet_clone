import { createContext, useState, useRef, useEffect } from "react";
import React from "react";
import { io } from "socket.io-client";

// Initialize the socket connection
const socket = io("http://localhost:3000");
const SocketContext = createContext();

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Initialize media stream and handle socket events
  useEffect(() => {
    // Get user media for video/audio
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Could not access media devices.");
      });

    // Listen for socket events
    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });

    socket.on("iceCandidate", (candidate) => {
      if (connectionRef.current) {
        connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("iceCandidate");
    };
  }, []);


    // Create a new peer connection with WebRTC APIs
  const createPeerConnection = (isInitiator, stream) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:192.158.29.39:3478?transport=udp',
          username: '28224511:1379330808',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        },
        {
          urls: 'turn:192.158.29.39:3478?transport=tcp',
          username: '28224511:1379330808',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        },
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    // Add tracks to peer connection
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { candidate: event.candidate, to: call.from });
      }
    };

    peerConnection.ontrack = (event) => {
      userVideo.current.srcObject = event.streams[0];
    };

    return peerConnection;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peerConnection = createPeerConnection(false, stream);
    peerConnection.setRemoteDescription(new RTCSessionDescription(call.signal));

    peerConnection
      .createAnswer()
      .then((answer) => {
        peerConnection.setLocalDescription(answer);
        socket.emit("answerCall", { signal: answer, to: call.from });
      })
      .catch((err) => console.error("Error creating answer:", err));

    connectionRef.current = peerConnection;
    peerConnectionRef.current = peerConnection;
  };

  const callUser = (id) => {
    const peerConnection = createPeerConnection(true, stream);

    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit("callUser", { from: me, signalData: peerConnection.localDescription, userToCall: id, name });
      })
      .catch((err) => console.error("Error creating offer:", err));

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
    });

    connectionRef.current = peerConnection;
    peerConnectionRef.current = peerConnection;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    setStream(null);
    setCall(null);
    setCallAccepted(false);
    setCallEnded(false);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        name,
        setName,
        leaveCall,
        callUser,
        answerCall,
        stream,
        setStream,
        myVideo,
        userVideo,
        setCall,
        setCallAccepted,
        setCallEnded,
        me,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
