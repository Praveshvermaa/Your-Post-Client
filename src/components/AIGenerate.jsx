import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "./mode-toggle";
import { Loader2, ImagePlus, Send } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

function AIGenerate() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageBlob, setImageBlob] = useState(null); // store blob for upload
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!document.querySelector('script[src="https://js.puter.com/v2/"]')) {
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      if (!window.puter) {
        throw new Error("Puter.js is not loaded yet. Please wait a moment and try again.");
      }

      // Generate the image using Puter.js with a free open-source model
      const imageElement = await window.puter.ai.txt2img(prompt, {
        model: "RunDiffusion/Juggernaut-pro-flux",
      });

      if (!imageElement || !imageElement.src) {
        throw new Error("No image was returned from AI.");
      }

      const imgSrc = imageElement.src;
      setImageUrl(imgSrc);

      // Convert the image src to a Blob for uploading backend
      const res = await fetch(imgSrc);
      const blob = await res.blob();
      setImageBlob(blob);

      toast({
        title: "Image Generated",
        description: "AI image has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong while generating the image.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!imageUrl || !prompt.trim()) return;
    setSubmitting(true);
    try {

      // Use the blob already captured during generation
      const blob = imageBlob;


      const formData = new FormData();
      formData.append("postImage", blob, "ai-generated.png");
      formData.append("postCaption", prompt);


      await axiosInstance.post(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Post Submitted",
        description: "Your AI-generated post has been uploaded.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        title: "Submission Failed",
        description: "Could not submit your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md p-6 shadow-xl space-y-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
            <ImagePlus className="w-6 h-6 text-blue-500" /> AI Image Generator
          </CardTitle>
        </CardHeader>

        {loading && (
          <p className="text-center text-sm text-blue-500 font-medium">
            Generating image, please wait...
          </p>
        )}

        {submitting && (
          <p className="text-center text-sm text-green-500 font-medium">
            Submitting your post, please wait...
          </p>
        )}

        <CardContent>
          <form onSubmit={handleGenerateImage} className="space-y-4">
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A futuristic cityscape at sunset"
                required
                disabled={loading || submitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading || submitting}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                <ImagePlus className="w-5 h-5 mr-2" />
              )}
              {loading ? "Generating..." : "Generate Image"}
            </Button>
          </form>

          {imageUrl && (
            <div className="space-y-4 mt-4">
              <img
                src={imageUrl}
                alt="Generated"
                className="rounded shadow-md w-full max-h-[400px] object-contain transition duration-300 ease-in-out hover:scale-105"
              />
              <Button
                onClick={handleSubmitPost}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {submitting ? "Submitting..." : "Submit Post"}
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIGenerate;
