import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hook/use-toast';
import useUser from '@/hook/use-user';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error fetching user details</div>;

  return (
    <div className="bg-background p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Left: Logo */}
        <Link to="/feed" className="text-2xl font-semibold text-foreground hover:text-primary transition duration-300">
          <span className="font-bold text-blue-600">Vibe</span>Verse.
        </Link>

        {/* Right: Upload, Avatar, and Menu */}
        <div className="flex items-center space-x-4">
          {/* Always Visible Upload */}
          <Link to="/upload">
            <Button
              variant="outline"
              className="hover:bg-blue-600 text-blue-600 border-blue-600 hover:text-white"
            >
              Upload
            </Button>
          </Link>

          {/* Always Visible Profile Avatar */}
          <Link to="/">
            <Avatar className="h-12 w-12 cursor-pointer">
              <AvatarImage src={user?.profile_picture || "/default-avatar.jpg"} alt="Profile" />
            </Avatar>
          </Link>

          {/* Hamburger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-10 space-y-6">
              <Link to="/dashboard" className="block text-lg text-foreground hover:text-blue-600">
                Dashboard
              </Link>
              <ModeToggle />
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default Navbar; 