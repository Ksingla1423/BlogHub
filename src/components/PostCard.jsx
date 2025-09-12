// PostCard.jsx
import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    setImgUrl(null);

    if (!featuredImage) return;
    
    try {
      // Use getFileView instead of getFilePreview to avoid transformation limits
      const url = appwriteService.getFileView(featuredImage);
      console.log("File view URL:", url);
      
      if (url) {
        // Convert URL object to string
        const urlString = url instanceof URL ? url.href : url;
        console.log("Converted URL string:", urlString);
        if (mounted) setImgUrl(urlString);
      }
    } catch (error) {
      console.error("getFileView error:", error);
    }

    return () => { mounted = false; };
  }, [featuredImage]);

  return (
    <Link to={`/post/${$id}`} className="block group">
      <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-slate-300 hover:-translate-y-1">
        <div className="relative overflow-hidden">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={title || "post image"}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Read more</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
