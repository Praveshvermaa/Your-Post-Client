import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/utils/axiosInstance';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const toast = useToast();
  const token = localStorage.getItem('token');

  const userDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/userdetails', {
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

  useEffect(() =>{
    if (token) {
      userDetails();
    }
  }, [token]);

  return { user, loading, error };
};

export default useUser;
