import axios from "axios";
import React, { useEffect, useState } from "react";
import {  Link, useNavigate } from "react-router-dom";

const ProfileViewer = () => {
    const [visitors, setVisitors] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
 
    const fetchVisitors = async () => {
        try {
          const response = await axios.get("https://your-post-backend.onrender.com/api/profileviewer",{
            headers:{
                Authorization: `Bearer ${token}`
             }
          }); // Replace with your API endpoint
          console.log(response.data);
          console.log(response.data.currentUser);
         if(response.data.success){
            setVisitors(response.data.currentUser.profile_viewer); 
           
            

         }
         else{
            alert("false");
         }
         // Assuming data.visitors contains an array of visitor objects
        } catch (error) {
          console.error("Error fetching visitors:", error);
        }
      };
  
   
    useEffect(() => {
     
      fetchVisitors();
    }, []);
  return (
    <div className="min-h-screen bg-gray-400 p-4">
      
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Visitors</h1>
        <p className="text-gray-600">
          Here's a list of people who recently visited your profile.
        </p>
      </div>

      
      <div className="max-w-4xl mx-auto mt-6 bg-gray-300 shadow-md rounded-lg p-6">
        {visitors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visitors?.map((visitor) => (
              <Link to={`/user/${visitor._id}`}
                key={visitor.username}
                className="flex items-center space-x-4 bg-gray-50 hover:bg-gray-500 p-4 rounded-lg shadow transition-transform duration-300 transform hover:scale-105"
              >
                <img
                  src={`${visitor.profile_picture}`}
                  alt={visitor.username}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {visitor.username}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No visitors yet!</p>
        )}
      </div>
    </div>
  )
}

export default ProfileViewer
