import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hook/use-toast';

function User() {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const [profileOwner, setProfileOwner] = useState(null);
  const toast = useToast();

  const viewerIdSender = async () => {
    try {
      const res = await axios.post(
        "https://your-post-backend.onrender.com/api/profileveiwer",
        { profileOwnerId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data.success) {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const profileOwnerDetails = async () => {
    try {
      const res = await axios.post(
        'https://your-post-backend.onrender.com/api/profileownerdetails',
        { profileOwnerId: userId }
      );
      if (res.data.success) {
        setProfileOwner(res.data.profileOwner);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    viewerIdSender();
    profileOwnerDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <Avatar className="w-24 h-24 shadow-lg">
            <AvatarImage src={profileOwner?.profile_picture} alt={profileOwner?.username} />
            <AvatarFallback>
              {profileOwner?.username?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">@{profileOwner?.username}</h2>
        </div>

        <Separator className="my-10" />

        {/* Posts Section */}
        <h3 className="text-3xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100 underline underline-offset-4 decoration-blue-500">
          Posts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {profileOwner?.posts.length > 0 ? (
            profileOwner.posts.map((post) => (
              <Card
                key={post._id}
                className="hover:scale-105 transition-transform duration-300 overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800 rounded-2xl"
              >
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={post.postImage}
                    alt="Post"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-400 text-lg">
              No posts yet!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
