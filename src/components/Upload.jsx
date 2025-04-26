import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "./mode-toggle";

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
      await axios.post("https://your-post-backend.onrender.com/api/upload", formData, {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md p-6 shadow-xl space-y-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Upload Your Post</CardTitle>
        </CardHeader>

        {loading && (
          <p className="text-center text-sm text-red-500 font-medium">
            Please wait! File is uploading...
          </p>
        )}

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="postImage">Upload Image</Label>
              <Input
                type="file"
                id="postImage"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                type="text"
                id="caption"
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption..."
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Uploading..." : "Submit"}
            </Button>
          </form>

          <div className="mt-6 flex justify-center">
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Upload;
