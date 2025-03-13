// React Component (VideoMeet.jsx)

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:3000");

const VideoMeet = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const peerRef = useRef(null);
    const myStreamRef = useRef(null);
    const [peerData, setPeerData] = useState({});
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [messages, setMessages] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatInputRef = useRef(null);
    const [myPeerId, setMyPeerId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                myStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error getting media:", error);
            }
        };

        getMedia();

        socket.on("peersList", (peers) => {
            const updatedPeerData = {};
            peers.forEach((peer) => {
                updatedPeerData[peer.socketID] = { name: peer.name, peerID: peer.peerID };
            });
            setPeerData(updatedPeerData);
        });

        socket.on("userJoined", (newPeer) => {
            setPeerData((prev) => ({ ...prev, [newPeer.socketID]: { name: newPeer.name, peerID: newPeer.peerID } }));
        });

        socket.on("userLeft", (user) => {
            setPeerData((prev) => {
                const updatedPeers = { ...prev };
                delete updatedPeers[user.socketID];
                delete remoteVideoRefs.current[user.socketID];
                return updatedPeers;
            });
        });

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        peerRef.current = new Peer();
        peerRef.current.on("open", (peerID) => {
            setMyPeerId(peerID);
            socket.emit("myPeerID", { name: "User", peerID });
            socket.emit("joinRoom", { roomID: "1234" });
        });

        peerRef.current.on("call", (call) => {
            call.answer(myStreamRef.current);
            call.on("stream", (remoteStream) => {
                if (remoteVideoRefs.current[call.peer]) {
                    remoteVideoRefs.current[call.peer].srcObject = remoteStream;
                }
            });
        });

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (myPeerId && myStreamRef.current) {
            Object.keys(peerData).forEach((socketID) => {
                if (peerData[socketID].peerID && peerData[socketID].peerID !== myPeerId) {
                    const call = peerRef.current.call(peerData[socketID].peerID, myStreamRef.current);
                    call.on("stream", (remoteStream) => {
                        if (remoteVideoRefs.current[socketID]) {
                            remoteVideoRefs.current[socketID].srcObject = remoteStream;
                        }
                    });
                }
            });
        }
    }, [peerData, myPeerId]);

    const toggleCamera = () => {
        if (myStreamRef.current && myStreamRef.current.getVideoTracks().length > 0) {
            myStreamRef.current.getVideoTracks()[0].enabled = !isCameraOn;
            setIsCameraOn(!isCameraOn);
        }
    };

    const toggleMicrophone = () => {
        if (myStreamRef.current && myStreamRef.current.getAudioTracks().length > 0) {
            myStreamRef.current.getAudioTracks()[0].enabled = !isMicOn;
            setIsMicOn(!isMicOn);
        }
    };

    const sendMessage = () => {
        if (chatInputRef.current && chatInputRef.current.value) {
            socket.emit("sendMessage", { roomID: "1234", message: chatInputRef.current.value });
            chatInputRef.current.value = "";
        }
    };

    const endMeet = () => {
        socket.disconnect();
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center h-screen bg-gray-900 text-white">
            <div className="flex justify-center gap-4 p-4">
                <div className="w-1/3 border-2 border-gray-500 p-2">
                    <p className="text-center text-lg">You</p>
                    <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg"></video>
                </div>
                <div className="w-1/3 border-2 border-gray-500 p-2">
                    <p className="text-center text-lg">You</p>
                    <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg"></video>
                </div>
                <div className="w-1/3 border-2 border-gray-500 p-2">
                    <p className="text-center text-lg">You</p>
                    <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg"></video>
                </div>
                {Object.keys(peerData).map((socketID, index) => (
                    <div key={index} className="w-1/3 border-2 border-gray-500 p-2">
                        <p className="text-center text-lg">{peerData[socketID].name}</p>
                        <video ref={(el) => (remoteVideoRefs.current[socketID] = el)} autoPlay className="w-full rounded-lg"></video>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 w-full flex justify-center p-4 bg-gray-800">
                <button onClick={toggleMicrophone} className="bg-blue-500 px-4 py-2 mx-2 rounded">
                    {isMicOn ? "Mute" : "Unmute"}
                </button>
                <button onClick={toggleCamera} className="bg-blue-500 px-4 py-2 mx-2 rounded">
                    {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                </button>
                <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-blue-500 px-4 py-2 mx-2 rounded">
                    {isChatOpen ? "Close Chat" : "Open Chat"}
                </button>
                <button onClick={endMeet} className="bg-red-500 px-4 py-2 mx-2 rounded">
                    End Meet
                </button>
            </div>

            {isChatOpen && (
                <div className="fixed right-0 bottom-0 w-1/3 h-1/2 bg-gray-700 p-4 overflow-y-auto">
                    <h2 className="text-xl">Chat</h2>
                    {messages.map((msg, index) => (
                        <p key={index} className="bg-gray-600 p-2 my-1 rounded">
                            {msg.sender ? `${msg.sender.username}: ${msg.message}` : msg}
                        </p>
                    ))}
                    <input ref={chatInputRef} type="text" placeholder="Type a message..." className="w-full bg-gray-800 p-2 mt-2 rounded" />
                    <button onClick={sendMessage} className="w-full bg-blue-500 p-2 mt-1 rounded">Send</button>
                </div>
            )}
        </div>
    );
};

export default VideoMeet;