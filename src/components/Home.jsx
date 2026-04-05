import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AiFillDelete } from 'react-icons/ai';
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from '@/utils/axiosInstance';
import blankProfilePicture from "../assets/blankProfile.webp"
import { Eye, Camera, Trash2 } from 'lucide-react';

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

  // Skeleton for loading
  const PostSkeleton = () => (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="h-72 shimmer"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 shimmer rounded"></div>
        <div className="h-3 w-1/3 shimmer rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full gradient-bg pb-16">
      
      {/* Profile Section */}
      <div className="w-full flex flex-col items-center py-12 animate-fadeInUp">
        <div className="relative group">
          {/* Animated gradient ring */}
          <div className="avatar-ring p-[3px] rounded-full">
            <img
              src={editImage || blankProfilePicture}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover bg-background"
            />
          </div>
          <input
            type="file"
            className="hidden"
            ref={reference}
            name="profileImage"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <button
            className="absolute bottom-1 right-1 p-2 rounded-full bg-violet-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-violet-500 shadow-lg shadow-violet-600/30"
            onClick={updateProfilePicture}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <h1 className="text-2xl font-extrabold text-foreground mt-5">
          @{userdetails?.username}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} shared
        </p>

        <Button
          className="mt-5 btn-gradient-primary text-white gap-2 px-6 font-medium"
          onClick={() => navigate("/profileviewer")}
        >
          <Eye className="h-4 w-4" />
          Profile Viewers
        </Button>
      </div>

      {/* Gradient Divider */}
      <div className="divider-gradient w-[80%] mx-auto my-6"></div>

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">
          <span className="gradient-text">Your</span> Posts
        </h2>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <p className="text-muted-foreground text-lg">No posts yet.</p>
            <p className="text-muted-foreground/60 text-sm mt-2">Start sharing your moments!</p>
            <Button 
              className="mt-6 btn-gradient-primary text-white"
              onClick={() => navigate('/upload')}
            >
              Create First Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Card 
                key={post._id} 
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border-0 group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.postImage}
                    alt="Post"
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground font-semibold text-base truncate pr-2">
                      {post.postCaption}
                    </span>
                    <button 
                      onClick={() => deletePost(post._id)} 
                      className="text-red-400/60 hover:text-red-400 transition-colors duration-200 flex-shrink-0 p-1.5 rounded-lg hover:bg-red-500/10"
                    >
                      {deleteLoading ? (
                        <div className="h-4 w-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-muted-foreground text-xs">{new Date(post.CreatedAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
