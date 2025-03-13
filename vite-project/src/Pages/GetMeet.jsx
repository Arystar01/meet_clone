import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const GetMeet = () => {
    const { meet_ID } = useParams();
    const UID = useSelector((state) => state.authStore.user.UID);
    console.log("UID:", UID);
    console.log("meet_ID:", meet_ID);

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/user/getMeets/${meet_ID}?UID=${UID}`);
      
                console.log(res.data);
                setData(res.data);
            } catch (error) {
                console.error("Error fetching meeting data:", error);
            }
        };

        if (meet_ID && UID) {
            fetchData();
        }
        console.log("Fetching data for meet_ID:", meet_ID);
    }, [meet_ID, UID]); // Dependency array ensures effect runs when values change.

    return (
        <div>
            <h2>Welcome to Get Meet</h2>
            {/*  */}
            <h1>here i have to create a video dashboard </h1>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    );
};

export default GetMeet;
