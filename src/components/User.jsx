import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function User() {
    const {userId} = useParams();
    const token = localStorage.getItem('token');
    const [profileOwner,setProfileOwner] = useState()
    const viewerIdSender = async()=>{
        try {
            const res = await axios.post("http://localhost:3000/api/profileveiwer",{profileOwnerId:userId},{
                    headers: { Authorization: `Bearer ${token}` }
                  }
            )
            if(!res.data.success){
                alert(res.data.message);
            }
           
        } catch (error) {
            console.log(error);
        }
       

    }
    const profileOwnerDetails = async()=>{
        try {
            const res = await axios.post('http://localhost:3000/api/profileownerdetails',{profileOwnerId:userId});
            if(res.data.success){
                setProfileOwner(res.data.profileOwner);
            }
            else{
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
         }

    }
    useEffect(()=>{
        viewerIdSender();
        profileOwnerDetails();
    },[])
    console.log(profileOwner);
    
  return (
    <div className=" mx-auto ">
    
    <div className="flex flex-col items-center p-6  justify-between bg-gray-800 text-white">
      <img 
        src={`${profileOwner?.profile_picture}`}
        alt="Profile"
        className="object-contain rounded-full  bg-white w-24 h-24"
      />
      <h2 className="text-2xl font-semibold">@{profileOwner?.username}</h2>
    </div>
    <div className='text-center text-lg font-bold text-black underline p-2'>Posts</div>

   
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12 gap-6">
        { profileOwner?.posts.map((post) => (
          <div key={post._id} className="overflow-hidden rounded-lg shadow-lg bg-gray-100">
            <div className="w-full h-64 flex items-center justify-center bg-gray-200">
              <img
                src={`${post.postImage}`}
                alt="post"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4">
              <div className='flex justify-between'>
                <span className="text-sm text-gray-800 font-semibold mb-2">@{profileOwner.username}-: {post.postCaption}</span>
              </div>
              <p className="text-xs text-gray-500">{new Date(post.CreatedAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
  </div>
  )
}

export default User
