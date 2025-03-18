import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Initialize once here
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

  useEffect(() => {
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

    socket.on("userRaisedHand", ({ meetid, userId }) => {
      console.log(`${userId} has raised their hand in room: ${meetid}`);
      // You can update the UI to show the user raised their hand
      console.log(meetid);
    });

    socket.on("userLoweredHand", ({ meetid, userId }) => {
      console.log(`${userId} has lowered their hand in room: ${meetid}`);
      console.log(meetid);
      // You can update the UI to show the user lowered their hand
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      const peerConnection = createPeerConnection(false, stream);
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
      connectionRef.current = peerConnection;
      peerConnectionRef.current = peerConnection;
    });

    socket.on("callEnded", () => {
      setCallEnded(true);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
    });

    socket.on("iceCandidate", (candidate) => {
      if (connectionRef.current) {
        connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected from ContextProvider");
      // Potentially handle reconnection logic here
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("callEnded");
      socket.off("iceCandidate");
      socket.off("userRaisedHand");
      socket.off("userLoweredHand");
      socket.off("disconnect");
    };
  }, []);

  const createPeerConnection = (isInitiator, currentStream) => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:192.158.29.39:3478?transport=udp",
          username: "28224511:1379330808",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        },
        {
          urls: "turn:192.158.29.39:3478?transport=tcp",
          username: "28224511:1379330808",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        },
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    currentStream.getTracks().forEach((track) => peerConnection.addTrack(track, currentStream));

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
    console.log("Call initiated");
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    setStream(null);
    setCall(null);
    setCallAccepted(false);
    setCallEnded(false);
  };

  const raiseHand = (meetid, userId) => {
    socket.emit("userRaisedHand", { meetid, userId });
  };

  const lowerHand = (meetid, userId) => {
    socket.emit("userLoweredHand", { meetid, userId });
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
        socket,
        raiseHand,
        lowerHand,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };