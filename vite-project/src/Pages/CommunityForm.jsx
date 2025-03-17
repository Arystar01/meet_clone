import React from 'react'
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import img1 from "../images/img1.jpg";
import communityImage from "../images/community_image1.webp";
import axios from "axios";
const CommunityForm = ({openBox, setOpenBox, selectedTemplate}) => {
    const [communityName, setCommunityName] = React.useState(selectedTemplate);
    const [descriptionText, setDescriptionText] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nameid = document.getElementById("nameId").value;
        const description = document.getElementById("description").value;
        setCommunityName(nameid);
        setDescriptionText(description);
        console.log(communityName);
        console.log(descriptionText);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/community/create", {
                    communityName: nameid,
                    descriptionText: description
                },
                {withCredentials: true}
                
            );
            console.log(res);
            if(res.status === 201){
                alert("Community created successfully");
                window.location.href = "/";
            }
        } catch (error) {
            console.log(error);
            
        }
    }   

    return (
        <div>
            <Dialog open={openBox} onOpenChange={setOpenBox}>
                <DialogContent className=' fixed  flex flex-col gap-2 top-1/2 left-1/2 bg-gray-800 w-[600px] h-[450px] max-h-[90vh] p-4 text-white -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-auto'>
                
                    <div className="flex justify-between items-center">
                        <h3>Create a Community</h3>
                        <button onClick={() => setOpenBox(false)} className="text-white font-bold">X</button>
                    </div>
                    <div className='flex items-center gap-6'>
                        <div className="relative w-20 h-20">
                            {/* Profile Image */}
                            <img src={img1} alt="Profile" className="w-full h-full rounded-lg" />

                            {/* Edit Text Overlay */}
                            <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1">
                                Edit
                            </span>
                        </div>
                        <div className='flex flex-col w-full  pt-2  gap-2'>
                            <h1>Community Name</h1>
                            <input id="nameId" type="text"
                            value={communityName}
                            onChange={(e)=> setCommunityName(e.target.value)}
                            
                             placeholder={selectedTemplate} className=" w-[80%]  h-10 px-4 rounded-lg shadow-sm borde bg-transparent border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p>Description (optional) </p>
                        <textarea id='description'
                         onChange={(e) => setDescriptionText(e.target.value)}
                         rows="4" placeholder='Write a short description about your community so people know what it s about.' className=' bg-black opacity-70 rounded-md p-2 resize-none w-full scrollbar-hide' />
                    </div>

                    <div>
                        <p>Community guidelines</p>
                        <span>
                            Be kind and respectful to your fellow community members. Don't be rude or cruel. Participate as yourself and don't post anything that violates <a href="/" className=''>Community Standards.</a>
                        </span>
                    </div>

                    <div className='flex justify-between'>
                        <button className=' hover:text-purple-500' onClick={()=>{setOpenBox(false)}}>
                          {'<'}  back
                        </button>
                        <button className='bg-purple-800 rounded-lg px-4 py-2' onClick={handleSubmit}>
                            Create
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default CommunityForm
