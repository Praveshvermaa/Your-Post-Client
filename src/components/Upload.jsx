import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "./mode-toggle";
import { Sparkles, Upload as UploadIcon, ImagePlus, FileImage } from "lucide-react";

function Upload() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [caption, setCaption] = useState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("postImage", file);
    formData.append("postCaption", caption);

    try {
      await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Upload Successful",
        description: "Your post has been uploaded.",
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerateRedirect = () => {
    navigate("/AIgenerator");
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1 top-[-100px] right-[-60px]"></div>
      <div className="orb orb-2 bottom-[-80px] left-[-80px]"></div>

      <Card className="w-full max-w-md glass-card rounded-2xl border-0 glow-violet animate-fadeInUp relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 p-3 rounded-2xl bg-violet-500/10 w-fit">
            <UploadIcon className="h-7 w-7 text-violet-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="gradient-text">Upload</span> Post
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Share your moment with the community</p>
        </CardHeader>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="h-4 w-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin"></div>
            <p className="text-sm text-violet-400 font-medium">Uploading...</p>
          </div>
        )}

        <CardContent className="space-y-5 pt-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="postImage" className="text-sm font-medium text-muted-foreground mb-1.5 block">Image</Label>
              <div className="relative">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 hover:border-violet-500/30 bg-white/[0.02] transition-all duration-300 cursor-pointer"
                  onClick={() => document.getElementById('postImage').click()}
                >
                  <FileImage className="h-8 w-8 text-muted-foreground/40" />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      {file ? file.name : 'Click to select an image'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PNG, JPG, WEBP supported'}
                    </p>
                  </div>
                </div>
                <Input
                  type="file"
                  id="postImage"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="caption" className="text-sm font-medium text-muted-foreground mb-1.5 block">Caption</Label>
              <Input
                type="text"
                id="caption"
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption..."
                className="bg-white/5 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20 transition-all duration-300"
                required
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
                  <UploadIcon className="h-4 w-4" />
                  Submit Post
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-grow divider-gradient"></div>
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow divider-gradient"></div>
          </div>

          {/* AI Generate */}
          <Button
            type="button"
            onClick={handleAIGenerateRedirect}
            className="w-full btn-gradient-purple text-white font-semibold h-11 gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate with AI
          </Button>

          <div className="flex justify-center pt-2">
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Upload;
