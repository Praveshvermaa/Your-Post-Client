import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://your-post-backend.onrender.com/api/allposts');
      setPosts(response.data.posts);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-400 h-auto  mb-12">
      <h1 className="text-2xl font-bold text-center mb-6">Feed</h1>

      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts&&posts.map((post) => (
            <div key={post._id} className="overflow-hidden rounded-lg shadow-lg bg-gray-100">
              <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                <img
                  src={`${post.postImage}`}
                  alt="post"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-800 font-semibold mb-2">
                  <Link to={`/user/${post.userId._id}`} className='text-blue-500 cursor-pointer'>@{post.userId.username}</Link>
                  : {post.postCaption}
                </p>
                <p className="text-xs text-gray-500">{new Date(post.CreatedAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
