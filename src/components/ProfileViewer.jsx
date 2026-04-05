import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { RefreshCw, Users } from "lucide-react";

const ProfileViewer = () => {
  const [visitors, setVisitors] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchVisitors = async () => {
    try {
      const response = await axiosInstance.get("/api/profileviewer", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      console.log(response.data.currentUser);
      if (response.data.success) {
        setVisitors(response.data.currentUser.profile_viewer);
      } else {
        alert("Failed to fetch visitors.");
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <div className="min-h-screen gradient-bg p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10 animate-fadeInUp">
        <div className="inline-flex items-center gap-3 mb-3">
          <Users className="h-8 w-8 text-violet-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            <span className="gradient-text">Profile</span>{" "}
            <span className="text-foreground">Visitors</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">See who visited your profile recently</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {visitors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visitors.map((visitor, index) => (
              <Card
                key={visitor.username}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border-0 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <Link to={`/user/${visitor._id}`}>
                  <CardHeader className="flex items-center justify-center pt-8">
                    <div className="avatar-ring p-[3px] rounded-full">
                      <Avatar className="w-20 h-20 ring-0">
                        <AvatarImage src={visitor.profile_picture} alt={visitor.username} className="object-cover" />
                        <AvatarFallback className="bg-violet-600/20 text-violet-300 font-bold text-lg">
                          {visitor.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pb-8">
                    <CardTitle className="text-lg font-bold text-foreground mb-4">
                      @{visitor.username}
                    </CardTitle>
                    <Button 
                      variant="ghost"
                      className="w-full rounded-xl border border-white/[0.06] hover:bg-violet-500/10 text-muted-foreground hover:text-violet-400 transition-all duration-200"
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 animate-fadeIn">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No visitors yet!</p>
            <p className="text-muted-foreground/60 text-sm mt-1">Share your profile to get visitors</p>
            <Button 
              className="mt-6 gap-2 btn-gradient-primary text-white" 
              onClick={fetchVisitors}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewer;
