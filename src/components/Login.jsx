import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "./mode-toggle";
import axiosInstance from '../utils/axiosInstance'
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Email and password are required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        toast({
          title: "Login Successful",
          description: "Redirecting to home page...",
        });
        navigate("/feed", { replace: true });
      } else {
        toast({
          title: "Login Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-animated px-4 relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="orb orb-1 top-[-150px] left-[-100px]"></div>
      <div className="orb orb-2 bottom-[-100px] right-[-80px]"></div>
      <div className="orb orb-3 top-[40%] right-[10%]"></div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 space-y-6 animate-fadeInUp relative z-10 glow-violet">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-extrabold">
              <span className="gradient-text-brand">Vibe</span>
              <span className="text-foreground">Verse</span>
              <span className="text-violet-400">.</span>
            </h1>
          </Link>
          <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20 transition-all duration-300"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20 transition-all duration-300"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full btn-gradient-primary text-white font-semibold h-11 gap-2" 
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="divider-gradient"></div>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Create one
          </Link>
        </p>

        <div className="flex justify-center">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
