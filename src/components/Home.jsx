import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from '@/utils/axiosInstance';
import blankProfilePicture from "../assets/blankProfile.webp"
function Home() {
  const [profileImage, setProfileImage] = useState();
  const [editImage, seteditImage] = useState();
  const [posts, setPosts] = useState([]);
  const reference = useRef(null);
  const [userdetails, setUserdetails] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const userDetails = async () => {
    const res = await axiosInstance.get("/api/userdetails", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.success) {
      setPosts(res.data.user.posts);
      setUserdetails(res.data.user);
      seteditImage(res.data.user.profile_picture);
      setLoading(false);
    } else {
      alert("User is not found || please login first");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    userDetails();
  }, []);

  const updateProfilePicture = () => {
    reference.current.click();
  };

  useEffect(() => {
    if (profileImage) {
      const func = async () => {
        const formdata = new FormData();
        formdata.append('profileImage', profileImage);

        const res = await axiosInstance.post('/api/editpicture', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        });

        if (res.data.success) {
          seteditImage(res.data.user.profile_picture);
        } else {
          alert("Something went wrong");
        }
      };
      func();
    }
  }, [profileImage]);

  const deletePost = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await axiosInstance.post("/api/deletePost", { id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setPosts(res.data.updateduser.posts);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-700 pb-12">
      
      {/* Profile Section */}
      <div className="w-full flex flex-col items-center py-10">
        <div className="relative group">
          <img
            src={editImage||blankProfilePicture}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-sky-400 object-cover"
          />
          <input
            type="file"
            className="hidden"
            ref={reference}
            name="profileImage"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <Button 
            variant="outline"
            size="sm"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
            onClick={updateProfilePicture}
          >
            Edit
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-white mt-4">@{userdetails?.username}</h1>

        <Button
          variant="default"
          className="mt-4"
          onClick={() => navigate("/profileviewer")}
        >
          View Profile Viewers
        </Button>
      </div>

      {/* Divider */}
      <div className="h-[2px] w-[80%] mx-auto bg-sky-400 my-6"></div>

      {/* Posts Section */}
      {loading ? (
        <p className="text-center text-white text-lg mt-6">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-300 text-xl mt-10">No posts yet. Start sharing your moments!</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6">
          {posts.map((post) => (
            <Card key={post._id} className="bg-slate-800 hover:scale-105 transition-all overflow-hidden">
              <img
                src={post.postImage}
                alt="Post"
                className="w-full h-72 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold text-base truncate">
                    {post.postCaption}
                  </span>
                  <button onClick={() => deletePost(post._id)} className="text-red-500 hover:text-red-400">
                    {deleteLoading ? "..." : <AiFillDelete size={20} />}
                  </button>
                </div>
                <p className="text-gray-400 text-xs">{new Date(post.CreatedAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
