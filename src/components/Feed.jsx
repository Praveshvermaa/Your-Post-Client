import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { MessageCircle, Send } from "lucide-react";


const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!token) navigate("/login");
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/api/allposts");
      setPosts(res.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axiosInstance.get(`/api/post/comment/${postId}`);
      setComments(res.data.post.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddCommentClick = async (post) => {
    setSelectedPost(post);
    await fetchComments(post._id);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSending(true);
      const res = await axiosInstance.post(
        `/api/post/comment/${selectedPost._id}`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axiosInstance.post("/api/post/sentiment-analysis", {
        comment: newComment,
        postId: selectedPost._id,
      });

      setComments((prev) => [...prev, res.data.post.comments]);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment was posted successfully 🚀",
      });
      setSelectedPost(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Skeleton loading card
  const SkeletonCard = () => (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="h-64 shimmer"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-24 shimmer rounded"></div>
        <div className="h-3 w-full shimmer rounded"></div>
        <div className="h-9 w-full shimmer rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto px-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            <span className="gradient-text">Community</span>{" "}
            <span className="text-foreground">Feed</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Discover what creators are sharing</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <Card 
              key={post._id} 
              className="glass-card glass-card-hover rounded-2xl overflow-hidden border-0 animate-fadeInUp group"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image */}
              <div className="h-64 bg-black/20 overflow-hidden relative">
                <img 
                  src={post.postImage} 
                  alt="Post" 
                  className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Author & Caption */}
                <p className="text-sm text-muted-foreground">
                  <Link
                    to={`/user/${post.userId._id}`}
                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                  >
                    @{post.userId.username}
                  </Link>{" "}
                  <span className="text-foreground/80">{post.postCaption}</span>
                </p>

                {/* Comment Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 rounded-xl hover:bg-violet-500/10 text-muted-foreground hover:text-violet-400 transition-all duration-200 border border-white/[0.06]"
                  onClick={() => handleAddCommentClick(post)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Comment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Comment Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="sm:max-w-md glass-card border-white/[0.08] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Comments on{" "}
              <span className="gradient-text font-bold">@{selectedPost?.userId.username}</span>'s post
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-60 pr-2 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment, i) => (
                <div key={i} className="text-sm border-b border-white/[0.06] pb-3 mb-3">
                  <span className="font-semibold text-violet-400">{comment.user}</span>
                  <span className="text-foreground/80 ml-2">{comment.text}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first!</p>
            )}
          </ScrollArea>

          <div className="flex items-center gap-2 pt-3">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20"
            />
            <Button 
              onClick={handleAddComment} 
              disabled={sending}
              className="btn-gradient-primary text-white gap-1"
              size="sm"
            >
              {sending ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedPage;
