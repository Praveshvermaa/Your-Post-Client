import React, { useEffect, useState } from "react";
import axios from "axios";


const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token')

  // Fetch posts with sentiment analysis
  const fetchPostsAnalysis = async () => {
    try {
      const response = await axios.get(`https://your-post-backend.onrender.com/api/dashboard/usersposts`,{
        
            headers: { Authorization: `Bearer ${token}` }
          
      }); 
      setPosts(response.data.user.posts);
    } catch (error) {
      console.error("Error fetching posts analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAnalysis();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!posts.length) {
    return <p className="text-center">No posts available for analysis.</p>;
  }



  return (
    <div className="p-6 bg-gray-500 min-h-screen ">
      <h2 className="text-xl font-bold mb-6">Your Post Analysis</h2>

      {/* Posts List */}
      <div className="space-y-4 mb-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="p-4 bg-white shadow-md rounded-md border"
          >
            <h3 className="font-semibold text-black text-lg border-b-2">{post.postCaption} : post Impression</h3>
            <p>
              Sentiment Score & Impression:{" "}
              <span
                className={`font-bold ${
                  post.sentimentScore > 0
                    ? "text-green-500"
                    : post.sentimentScore < 0
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {post.sentimentScore.toFixed(2)}
              </span>{" "}
              <span
                className={`ml-0 font-bold ${
                  post.sentimentScore > 0
                    ? "text-green-500"
                    : post.sentimentScore < 0
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                { post.sentimentScore > 0
                    ? "Positive"
                    : post.sentimentScore < 0
                    ? "Negative"
                    : "Neutral"}
              </span>
             
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
