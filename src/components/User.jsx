import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hook/use-toast';
import axiosInstance from '@/utils/axiosInstance';
import { ImageIcon } from 'lucide-react';


function User() {
  const { userId } = useParams();
  const token = localStorage.getItem('token');
  const [profileOwner, setProfileOwner] = useState(null);
  const toast = useToast();

  const viewerIdSender = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/profileveiwer",
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
      const res = await axiosInstance.post(
        '/api/profileownerdetails',
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
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center gap-4 p-8 glass-card rounded-2xl animate-fadeInUp">
          <div className="avatar-ring p-[3px] rounded-full">
            <Avatar className="w-24 h-24 ring-0">
              <AvatarImage src={profileOwner?.profile_picture} alt={profileOwner?.username} className="object-cover" />
              <AvatarFallback className="bg-violet-600/20 text-violet-300 font-bold text-xl">
                {profileOwner?.username?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            @{profileOwner?.username}
          </h2>
          <p className="text-muted-foreground text-sm">
            {profileOwner?.posts?.length || 0} posts shared
          </p>
        </div>

        {/* Gradient Divider */}
        <div className="divider-gradient my-10"></div>

        {/* Posts Section */}
        <h3 className="text-2xl font-bold text-center mb-8">
          <span className="gradient-text">Posts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profileOwner?.posts.length > 0 ? (
            profileOwner.posts.map((post, index) => (
              <Card
                key={post._id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border-0 group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={post.postImage}
                    alt="Post"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16 animate-fadeIn">
              <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No posts yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
