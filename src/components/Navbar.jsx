import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hook/use-toast';
import useUser from '@/hook/use-user';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu, Upload, LayoutDashboard, LogOut } from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance'; 
import blankProfilePicture from "../assets/blankProfile.webp"

function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, error } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out.',
      variant: 'destructive',
    });
  };

  if (loading) return (
    <div className="h-16 glass sticky top-0 z-50 flex items-center justify-center">
      <div className="h-5 w-32 shimmer rounded"></div>
    </div>
  );
  if (error) return <div className="p-4 text-red-400 text-center text-sm">Error fetching user details</div>;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4 py-3">
        
        {/* Brand */}
        <Link to="/feed" className="group flex items-center gap-1">
          <span className="text-2xl font-extrabold gradient-text-brand transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(124,58,237,0.5)]">
            Vibe
          </span>
          <span className="text-2xl font-bold text-foreground">Verse</span>
          <span className="text-2xl font-bold text-violet-400">.</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <Link to="/upload">
            <Button
              className="btn-gradient-primary text-white border-0 gap-2 font-medium px-5"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </Link>

          {/* Profile Avatar */}
          <Link to="/" className="avatar-ring">
            <Avatar className="h-10 w-10 cursor-pointer ring-0">
              <AvatarImage src={user?.profile_picture || blankProfilePicture} alt="Profile" className="object-cover" />
              <AvatarFallback className="bg-violet-600/20 text-violet-300 font-semibold">
                {user?.username?.slice(0, 2)?.toUpperCase() || 'VV'}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Menu Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-violet-500/10 transition-colors">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-12 space-y-2 glass border-r border-white/[0.06] w-72">
              <div className="mb-6">
                <h3 className="text-lg font-bold gradient-text-brand">Menu</h3>
              </div>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-violet-500/10 transition-all duration-200 group"
              >
                <LayoutDashboard className="h-5 w-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <div className="px-4 py-3">
                <ModeToggle />
              </div>
              <div className="divider-gradient my-4"></div>
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="w-full justify-start gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;