import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { BarChart3, TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';

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
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(124, 58, 237)',
        pointBorderColor: 'rgba(124, 58, 237, 0.3)',
        pointBorderWidth: 4,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        labels: {
          color: 'rgba(255,255,255,0.7)',
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 10, 30, 0.9)',
        borderColor: 'rgba(124, 58, 237, 0.3)',
        borderWidth: 1,
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
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
          font: { family: 'Inter', size: 12, weight: '500' },
          color: 'rgba(255,255,255,0.5)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          color: 'rgba(255,255,255,0.4)',
          font: { family: 'Inter', size: 11 },
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        title: {
          display: true,
          text: 'Sentiment Score',
          font: { family: 'Inter', size: 12, weight: '500' },
          color: 'rgba(255,255,255,0.5)',
        },
        beginAtZero: true,
        ticks: {
          color: 'rgba(255,255,255,0.4)',
          font: { family: 'Inter', size: 11 },
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin"></div>
          <span className="text-muted-foreground font-medium">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!filteredPosts.length) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center gap-4">
        <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-lg">No posts available for analysis.</p>
      </div>
    );
  }

  const filterButtons = [
    { key: "positive", label: "Positive", icon: TrendingUp, color: "text-emerald-400" },
    { key: "negative", label: "Negative", icon: TrendingDown, color: "text-red-400" },
    { key: "neutral", label: "Neutral", icon: Minus, color: "text-amber-400" },
    { key: "all", label: "All", icon: BarChart3, color: "text-violet-400" },
  ];

  return (
    <div className="min-h-screen gradient-bg p-4 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8 animate-fadeInUp">
        <div className="inline-flex items-center gap-3 mb-2">
          <BarChart3 className="h-7 w-7 text-violet-400" />
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            <span className="gradient-text">Post</span>{" "}
            <span className="text-foreground">Analytics</span>
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">Sentiment analysis of your content</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {filterButtons.map(({ key, label, icon: Icon, color }) => (
          <Button
            key={key}
            variant="ghost"
            onClick={() => setSentimentFilter(key)}
            className={`gap-2 rounded-xl border transition-all duration-300 ${
              sentimentFilter === key
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-500/10'
                : 'border-white/[0.06] hover:bg-white/[0.04] text-muted-foreground'
            }`}
          >
            <Icon className={`h-4 w-4 ${sentimentFilter === key ? color : ''}`} />
            {label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full lg:w-2/3 mx-auto mb-10 h-72 glass-card rounded-2xl p-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <Line data={sentimentTrendData} options={chartOptions} />
      </div>

      {/* Post Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredPosts.map((post, index) => {
          const isPositive = post.sentimentScore > 0;
          const isNegative = post.sentimentScore < 0;
          const sentimentColor = isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-amber-400';
          const borderGlow = isPositive 
            ? 'hover:border-emerald-500/30 hover:shadow-emerald-500/10' 
            : isNegative 
              ? 'hover:border-red-500/30 hover:shadow-red-500/10' 
              : 'hover:border-amber-500/30 hover:shadow-amber-500/10';

          return (
            <Card 
              key={post._id} 
              className={`glass-card rounded-2xl p-6 flex flex-col border-0 transition-all duration-400 hover:translate-y-[-4px] hover:shadow-lg ${borderGlow} animate-fadeInUp`}
              style={{ animationDelay: `${0.3 + index * 0.06}s` }}
            >
              <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2">{post.postCaption}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-muted-foreground text-sm">Sentiment:</span>
                <span className={`font-bold text-lg ${sentimentColor}`}>
                  {post.sentimentScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end mt-auto">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-xl border border-white/[0.06] hover:bg-violet-500/10 text-muted-foreground hover:text-violet-400 transition-all duration-200"
                  onClick={() => {
                    setSelectedPost(post);
                    setModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogContent className="glass-card border-white/[0.08] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              <span className="gradient-text">Post</span> Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedPost && (
              <>
                <h3 className="text-lg font-semibold text-foreground">{selectedPost.postCaption}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Score:</span>
                  <span className={`font-bold text-xl ${
                    selectedPost.sentimentScore > 0 ? "text-emerald-400" : 
                    selectedPost.sentimentScore < 0 ? "text-red-400" : "text-amber-400"
                  }`}>
                    {selectedPost.sentimentScore.toFixed(2)}
                  </span>
                </div>
                {selectedPost.postDescription && (
                  <p className="text-foreground/80 text-sm leading-relaxed">{selectedPost.postDescription}</p>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-white/[0.06] hover:bg-violet-500/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
