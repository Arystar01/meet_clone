import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MainLayout from "./Pages/MainLayout.jsx";

import Signup from "./Pages/Signup.jsx";
import Signin from "./Pages/Signin.jsx";
import Meet from "./Pages/Meet.jsx";
import Chat from "./Pages/Chat.jsx";
import Community from "./Pages/Community.jsx";
import Activity from "./Pages/Activity.jsx";
import NewMeet from "./Pages/NewMeet.jsx";
import GetMeet from "./Pages/GetMeet.jsx";
import VideoMeet from "./Pages/VideoMeet.jsx";
import PreviewVideo from "./Pages/PreviewVideo.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Meet /> },
      { path: "/chat", element: <Chat /> },
      { path: "/community", element: <Community /> },
      { path: "/activity", element: <Activity /> },
      { path: "/newMeet", element: <NewMeet /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/getMeets/:meet_ID", element: <VideoMeet /> }, // Fixed Route
  {path:"/preview/:meet_ID", element:<PreviewVideo/>}
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
