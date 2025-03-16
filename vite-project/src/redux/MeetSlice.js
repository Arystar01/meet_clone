import { createSlice } from "@reduxjs/toolkit";



const meetslice= createSlice({
    name:"meet", 
    initialState:{
        meet_id:"",
        meet_name:"",
        meet_description:"",
        meet_date:"",
        meet_owner_id:"",
        meet_owner:"",
        meet_participants:[],
        meet_type:"public",
        meet_status:"active"
    },
    reducers:{     
        setMeetId:(state, action)=>{
            state.meet_id=action.payload;
        },
        setMeetName:(state, action)=>{
            state.meet_name=action.payload;
        },
        setMeetDescription:(state, action)=>{
            state.meet_description=action.payload;
        },
        setMeetDate:(state, action)=>{
            state.meet_date=action.payload;
        },
        setMeetOwnerId:(state, action)=>{
            state.meet_owner_id=action.payload;
        },
        setMeetOwner:(state, action)=>{
            state.meet_owner=action.payload;
        },
        setMeetParticipants:(state, action)=>{
            state.meet_participants=action.payload;
        },
        setMeetType:(state, action)=>{
            state.meet_type=action.payload;
        },
        setMeetStatus:(state, action)=>{
            state.meet_status=action.payload;
        }
    }
});

export const {setMeetId, setMeetName, setMeetDescription, setMeetDate, setMeetOwner, setMeetParticipants, setMeetType, setMeetStatus, setMeetOwnerId} = meetslice.actions;
export default meetslice.reducer;
