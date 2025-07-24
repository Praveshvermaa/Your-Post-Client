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

  return (
    <div className="min-h-screen px-4 py-10 bg-background text-foreground">
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto px-2">
        <h1 className="text-3xl font-bold">📸 Community Feed</h1>
        <mode-toggle />
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Card key={post._id} className="hover:shadow-lg transition-all">
              <div className="h-64 bg-black rounded-t-xl overflow-hidden">
                <img src={post.postImage} alt="Post" className="object-contain h-full w-full" />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  <Link
                    to={`/user/${post.userId._id}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    @{post.userId.username}
                  </Link>{" "}
                  <span className="text-foreground">: {post.postCaption}</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 mt-2"
                  onClick={() => handleAddCommentClick(post)}
                >
                  <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                  Comment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

     
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Comments on{" "}
              <span className="text-blue-600">@{selectedPost?.userId.username}</span>'s post
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-60 pr-2 space-y-3">
            {comments.length > 0 ? (
              comments.map((comment, i) => (
                <div key={i} className="text-sm border-b pb-2">
                  <span className="font-semibold text-blue-500">{comment.user}</span>: {comment.text}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </ScrollArea>

          <div className="flex items-center gap-2 pt-3">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <Button onClick={handleAddComment} disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedPage;
