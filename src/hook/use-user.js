import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const toast = useToast();
  const token = localStorage.getItem('token');

  const userDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://your-post-backend.onrender.com/api/userdetails', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong!',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setError(error);
      toast({
        title: 'Error',
        description: 'Unable to fetch user details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      userDetails();
    }
  }, [token]);

  return { user, loading, error };
};

export default useUser;
