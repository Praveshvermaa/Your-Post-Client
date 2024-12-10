import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null); // Tracks the post for adding comments
  const [newComment, setNewComment] = useState(""); // Input for new comment
  const [comments, setComments] = useState([]); // All comments for the selected post
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const[sentimentScore,setSentimentScore] = useState();
  const [sending,setSending] = useState(false);

  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://your-post-backend.onrender.com/api/allposts");
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  // Function to fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `https://your-post-backend.onrender.com/api/post/comment/${postId}`
      );
      if(response.data.success){
        setComments(response.data.post.comments);
      }
      else{
        alert(response.data.message);
      }
      
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Handle opening the comment modal
  const handleAddCommentClick = async (post) => {
    setSelectedPost(post);
    await fetchComments(post._id); // Fetch comments for the selected post
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        setSending(true);
        const response = await axios.post(
          `https://your-post-backend.onrender.com/api/post/comment/${selectedPost._id}`,
          { text: newComment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const sentimentanalyser = await axios.post("https://your-post-backend.onrender.com/api/post/sentiment-analysis",{comment:newComment,
          postId:selectedPost._id}
      );
      setSending(false);





        setComments((prev) => [...prev, response.data.post.comments]);
        setNewComment(""); // Clear the input
        setSelectedPost(null);
        setComments([]);
      } catch (error) {
        console.error("Error adding comment: or sentiment post sentiment analysis", error);
      }
    }
  };

  // Close the comment modal
  const handleCloseModal = () => {
    setSelectedPost(null);
    setComments([]); // Clear comments
  };

  // Fetch posts on component mount
  useEffect(() => {
    if(!token){
      navigate("/login");
    }
    fetchPosts(sentimentScore);
  }, []);
  
  

  return (
    <div className="bg-gray-400 min-h-screen mb-12">
      <h1 className="text-2xl font-bold text-center mb-6">Feed</h1>

      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts &&
            posts.map((post) => (
              <div
                key={post._id}
                className="overflow-hidden rounded-xl mx-2 shadow-lg bg-slate-900"
              >
                <div className="w-full h-64 flex items-center justify-center bg-slate-900">
                  <img
                    src={`${post.postImage}`}
                    alt="post"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-white font-semibold mb-2">
                    <Link
                      to={`/user/${post.userId._id}`}
                      className="text-blue-500 cursor-pointer"
                    >
                      @{post.userId.username}
                    </Link>
                    : {post.postCaption}
                  </p>
                  <div className="flex flex-wrap justify-between">
                  <button
                    onClick={() => handleAddCommentClick(post)}
                    className="mb-1 hover:opacity-50 flex text-xs text-gray-500"
                  >
                    <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />{" "}
                    <span className="ml-1">add comment..</span>
                  </button>
                  <button className="mb-1 hover:opacity-50 flex text-xs text-gray-500">Status: {post.sentimentScore > 0 ? "positive" : post.sentimentScore < 0 ? "negative" : "neutral"}</button>
                  </div>
                 
                  <p className="text-xs text-gray-500">
                    {new Date(post.CreatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Comment Modal */}
      {selectedPost && (
  <div  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center">
    <div className="w-full lg:w-1/2 bg-white rounded-t-2xl lg:rounded-md p-4 max-h-[50%] lg:max-h-[80%] flex flex-col">
      {/* Close Button */}
      

      {/* Comments List */}
      <div onClick={handleCloseModal} className="relative overflow-y-auto flex-grow mb-4">
        <h3 className="text-lg text-center  inline text-slate-800 font-bold mb-2">
          Comments for this post:
        </h3>
        <span
        onClick={handleCloseModal}
        className="absolute cursor-pointer ml-2 md:right-2 text-lg  outline-none  text-black font-bold "
      >
        ✖
      </span>
        {comments.length ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="border-b pb-2 mb-2 text-gray-700"
            >
              <span className="font-semibold text-blue-600">
                {comment.user} -:
              </span>
              {comment.text}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 border-t pt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
         {sending?"sending":"send"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default FeedPage;
