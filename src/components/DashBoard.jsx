import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);
import axiosInstance from "@/utils/axiosInstance";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPostsAnalysis = async () => {
    try {
      const response = await axiosInstance.get(`/api/dashboard/usersposts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.user.posts);
      setFilteredPosts(response.data.user.posts);
    } catch (error) {
      console.error("Error fetching posts analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsAnalysis();
  }, []);

  useEffect(() => {
    if (sentimentFilter === "positive") {
      setFilteredPosts(posts.filter(post => post.sentimentScore > 0));
    } else if (sentimentFilter === "negative") {
      setFilteredPosts(posts.filter(post => post.sentimentScore < 0));
    } else if (sentimentFilter === "neutral") {
      setFilteredPosts(posts.filter(post => post.sentimentScore === 0));
    } else {
      setFilteredPosts(posts);
    }
  }, [sentimentFilter, posts]);

  const sentimentTrendData = {
    labels: posts.map(post => post.postCaption),
    datasets: [
      {
        label: 'Sentiment Score Trend',
        data: posts.map(post => post.sentimentScore),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sentiment Score Trend',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Sentiment: ${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Post Caption',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#555',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sentiment Score',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#555',
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (!filteredPosts.length) {
    return <p className="text-center text-white">No posts available for analysis.</p>;
  }

  return (
    <div className="p-4 lg:p-8 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-white">Your Post Analysis</h2>

      {/* Filter Section */}
      <div className="flex flex-wrap justify-center space-x-4 mb-8">
        <Button variant="outline" onClick={() => setSentimentFilter("positive")}>Positive Posts</Button>
        <Button variant="outline" onClick={() => setSentimentFilter("negative")}>Negative Posts</Button>
        <Button variant="outline" onClick={() => setSentimentFilter("neutral")}>Neutral Posts</Button>
        <Button variant="outline" onClick={() => setSentimentFilter("all")}>All Posts</Button>
      </div>

      {/* Sentiment Trend Chart */}
      <div className="w-full lg:w-2/3 mx-auto mb-10 h-72">
        <Line data={sentimentTrendData} options={chartOptions} />
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col dark:bg-gray-800 dark:text-white">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{post.postCaption}</h3>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-gray-600 dark:text-gray-300">Sentiment Score:</span>
              <span className={`font-bold ${post.sentimentScore > 0 ? "text-green-500" : post.sentimentScore < 0 ? "text-red-500" : "text-yellow-500"}`}>
                {post.sentimentScore.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => {
                setSelectedPost(post);
                setModalOpen(true);
              }}>
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Post Details */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Post Analysis</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedPost && (
              <>
                <h3 className="text-lg font-semibold">{selectedPost.postCaption}</h3>
                <p className={`font-bold ${selectedPost.sentimentScore > 0 ? "text-green-500" : selectedPost.sentimentScore < 0 ? "text-red-500" : "text-yellow-500"}`}>
                  Sentiment Score: {selectedPost.sentimentScore.toFixed(2)}
                </p>
                <p className="mt-4">{selectedPost.postDescription}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
