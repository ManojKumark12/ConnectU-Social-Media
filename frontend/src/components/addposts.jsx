// Addposts.jsx
import { useState } from "react";
import Dropzone from "react-dropzone";
import { IoCamera } from "react-icons/io5";
import userimage from "@/assets/Userimage.png";
import { apiFetch } from "./apiFetch.js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Addposts() {
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (files) => {
    const file = files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async () => {
  let newErrors = {};

  if (!caption.trim()) newErrors.caption = "Caption is required";
  if (!image) newErrors.image = "Image is required";
  if (!postText.trim()) newErrors.postText = "Description is required"; // ✅ Add this

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) {
    // Optionally show a toast for the first error
    const firstError = Object.values(newErrors)[0];
    toast.error(firstError);
    return;
  }

  setIsUploading(true);

  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("text", postText);
  if (image) formData.append("image", image);

  try {
    const response = await apiFetch(`${import.meta.env.VITE_API_URL}/addpost/`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      toast.success(data.message || "Post created!");
      setTimeout(() => navigate("/"), 1200);
    }
  } catch (error) {
    toast.error(error.message || "Something went wrong. Please try again.");
  } finally {
    setIsUploading(false);
  }
};

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Create Something Amazing
            </h1>
            <p className="text-gray-600 text-lg">Share your creativity with the world</p>
          </div>

          <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl animate-fade-in hover:shadow-3xl transition-all duration-500 group">
            {/* Blue border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10 transform scale-105"></div>

            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Create Post
              </CardTitle>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-2"></div>
            </CardHeader>

            <CardContent className="space-y-8 px-8">
              {/* Caption */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Caption</label>
                <input
                  type="text"
                  placeholder="Enter a catchy caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className={`w-full rounded-2xl border-2 px-6 py-4 text-gray-800 
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300
                    ${errors.caption ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.caption && <p className="text-red-500 text-sm">{errors.caption}</p>}
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Upload Image</label>
                <Dropzone onDrop={handleImageChange}>
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                      {...getRootProps()}
                      className={`relative w-full aspect-square max-w-md mx-auto border-2 border-dashed rounded-3xl group cursor-pointer transition-all duration-300 overflow-hidden
                        ${isDragActive ? "border-blue-500 bg-blue-50" : ""}
                        ${errors.image ? "border-red-500" : "border-gray-300"}`}
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <IoCamera size={40} />
                          <p>{isDragActive ? "Drop image here" : "Click or drag to upload"}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
              </div>

              {/* Post Text */}
         <div>
  <label className="text-sm font-semibold text-gray-700">Description</label>
  <Textarea
    placeholder="What's on your mind?"
    value={postText}
    onChange={(e) => setPostText(e.target.value)}
    className={`w-full min-h-[120px] rounded-2xl border-2 px-6 py-4 text-gray-800 
      focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300
      ${errors.postText ? "border-red-500" : "border-gray-200"}`}
  />
  {errors.postText && <p className="text-red-500 text-sm">{errors.postText}</p>} {/* ✅ Add this */}
</div>
            </CardContent>

            <CardFooter className="px-8 pb-8 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className={`w-full py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                }`}
              >
                {isUploading ? "Creating Post..." : "Share Your Creation"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
