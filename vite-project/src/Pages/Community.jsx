import React, { useState } from "react";
import img1 from "../images/img1.jpg";
import communityImage from "../images/community_image1.webp";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import CommunityForm from "./CommunityForm";

const templates = ["School", "Professional", "Finance", "Banking"];

const Community = () => {
  const [open, setOpen] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setOpenBox(true);
  };

  

  return (
    <div className="h-[calc(100vh-5rem)] w-full flex items-center justify-center text-white font-bold bg-gradient-to-bl from-purple-300 via-purple-800 to-black">
      <div className="grid grid-cols-2 gap-8 bg-black bg-opacity-10 p-8 rounded-lg shadow-lg w-max">
        {/* Left Section */}
        <div className="flex flex-col gap-6 w-80">
          <h1 className="text-xl">Build your community</h1>
          <p className="opacity-60">Bring your community together in one place to plan events, stay organized, and get more done.</p>
          <button className="border-2 border-black bg-blue-700 rounded-lg w-40 h-10" onClick={() => setOpen(true)}>
            Create your own
          </button>
          <h1>Create with a template</h1>
          <div className="flex gap-4 overflow-x-scroll scrollbar-hide">
            {templates.map((template, index) => (
              <button key={index} className="border-2 border-black rounded-lg px-4 h-10 bg-purple-950">
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="p-10">
          <img src={communityImage} alt="Community" className="w-80 h-80 object-cover rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Dialog Box */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 bg-gray-800 w-[600px] h-[450px] max-h-[90vh] p-4 text-white -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-auto">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3>Create a Community</h3>
              <button onClick={() => setOpen(false)} className="text-white font-bold">X</button>
            </div>

            {/* Create Own Section */}
            <div className="flex gap-4 items-center border-2 border-black h-10 rounded-lg p-2 w-1/2">
              <input type="image" src={img1} alt="Create" className="w-6 h-6" />
              <button className="text-white" onClick={() => handleTemplateClick('create my own')}>Create my own</button>
            </div>

            {/* Templates */}
            <h1>Start with a template</h1>
            <div className="grid grid-cols-2 gap-4 max-h-[250px] overflow-y-scroll pr-4">
              {Array(20).fill("School").map((name, index) => (
                <button key={index}  onClick={() => handleTemplateClick(name)} className="border-2 border-white p-2 rounded-lg flex gap-2 items-center">
                  <img src={img1} alt={name} className="w-6 h-6" />
                  <h1>{name}</h1>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {
        openBox && <CommunityForm openBox={openBox} setOpenBox={setOpenBox} selectedTemplate={selectedTemplate} />
      }
    </div>
  );
};

export default Community;