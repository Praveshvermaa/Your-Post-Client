import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ProfileViewer = () => {
  const [visitors, setVisitors] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchVisitors = async () => {
    try {
      const response = await axios.get("https://your-post-backend.onrender.com/api/profileviewer", {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">👀 Profile Visitors</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">See who visited your profile recently !</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {visitors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visitors.map((visitor) => (
              <Card
                key={visitor.username}
                className="hover:shadow-xl transition duration-300 hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <Link to={`/user/${visitor._id}`}>
                  <CardHeader className="flex items-center justify-center pt-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={visitor.profile_picture} alt={visitor.username} />
                      <AvatarFallback>{visitor.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent className="text-center pb-6">
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">{visitor.username}</CardTitle>
                    <Button variant="outline" className="mt-4 w-full">
                      View Profile
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60">
            <p className="text-gray-600 dark:text-gray-400 text-xl">No visitors yet!</p>
            <Button className="mt-6" onClick={fetchVisitors}>
              Refresh 🔄
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewer;
