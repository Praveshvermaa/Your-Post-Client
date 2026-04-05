import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "./mode-toggle";
import { Loader2, ImagePlus, Send, Sparkles, Wand2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1 top-[-120px] left-[-80px]"></div>
      <div className="orb orb-2 bottom-[-100px] right-[-60px]"></div>
      <div className="orb orb-3 top-[50%] right-[5%]"></div>

      <Card className="w-full max-w-md glass-card rounded-2xl border-0 glow-violet animate-fadeInUp relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 p-3 rounded-2xl bg-violet-500/10 w-fit">
            <Wand2 className="h-7 w-7 text-violet-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="gradient-text">AI Image</span> Generator
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Describe your vision and let AI create it</p>
        </CardHeader>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="h-4 w-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin"></div>
            <p className="text-sm text-violet-400 font-medium">Generating image...</p>
          </div>
        )}

        {submitting && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="h-4 w-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
            <p className="text-sm text-emerald-400 font-medium">Submitting post...</p>
          </div>
        )}

        <CardContent className="space-y-5 pt-4">
          <form onSubmit={handleGenerateImage} className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-sm font-medium text-muted-foreground mb-1.5 block">Prompt</Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                <Input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A futuristic cityscape at sunset"
                  className="pl-10 bg-white/5 border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20 transition-all duration-300"
                  required
                  disabled={loading || submitting}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-gradient-primary text-white font-semibold h-11 gap-2"
              disabled={loading || submitting}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <ImagePlus className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </Button>
          </form>

          {imageUrl && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="rounded-xl overflow-hidden glass-card glow-violet-hover transition-all duration-300">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full max-h-[400px] object-contain"
                />
              </div>
              <Button
                onClick={handleSubmitPost}
                className="w-full btn-gradient-green text-white font-semibold h-11 gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Post
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIGenerate;
