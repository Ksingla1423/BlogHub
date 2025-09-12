// Post.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [imgUrl, setImgUrl] = useState(""); // preview url (string)
  const [loadingImage, setLoadingImage] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  // fetch post
  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }
    let mounted = true;
    appwriteService
      .getPost(slug)
      .then((res) => {
        if (!mounted) return;
        if (res) setPost(res);
        else navigate("/");
      })
      .catch((err) => {
        console.error("getPost error:", err);
        if (mounted) navigate("/");
      });

    return () => {
      mounted = false;
    };
  }, [slug, navigate]);

  // load image preview when post changes
  useEffect(() => {
    let mounted = true;
    let objectUrlToRevoke = null;

    async function loadImage() {
      setImgUrl("");
      setLoadingImage(false);

      if (!post) return;

      // fix typo possibility: try both fields
      const fileId = post.featuredImage || post.featuresImage || "";

      if (!fileId) return;

      try {
        setLoadingImage(true);
        // Use getFileView instead of getFilePreview to avoid transformation limits
        const url = appwriteService.getFileView(fileId);
        console.log("Post page file view URL:", url);

        if (!mounted) return;

        if (url) {
          // Convert URL object to string
          const urlString = url instanceof URL ? url.href : url;
          console.log("Post page converted URL string:", urlString);
          setImgUrl(urlString);
        } else {
          setImgUrl("");
        }
      } catch (err) {
        console.error("getFileView error:", err);
        setImgUrl("");
      } finally {
        if (mounted) setLoadingImage(false);
      }
    }

    loadImage();

    return () => {
      mounted = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [post]);

  const deletePost = async () => {
    if (!post) return;
    try {
      const ok = await appwriteService.deletePost(post.$id);
      if (ok) {
        // delete file (best-effort)
        try {
          if (post.featuredImage) await appwriteService.deleteFile(post.featuredImage);
        } catch (err) {
          console.warn("deleteFile failed (non-blocking)", err);
        }
        navigate("/");
      } else {
        console.error("deletePost returned false");
      }
    } catch (err) {
      console.error("deletePost error:", err);
    }
  };

  if (!post) return null; // or a spinner

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Container>
        <div className="py-8">
          {/* Featured Image Section */}
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
            {imgUrl ? (
              <div className="relative">
                <img 
                  src={imgUrl} 
                  alt={post.title} 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {post.title}
                  </h1>
                </div>
              </div>
            ) : loadingImage ? (
              <div className="w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading image...</p>
                </div>
              </div>
            ) : post.featuredImage || post.featuresImage ? (
              <div className="w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-slate-500 font-medium">Image unavailable</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {post.title}
                  </h1>
                </div>
              </div>
            )}

            {isAuthor && (
              <div className="absolute top-6 right-6 flex space-x-3">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button 
                    bgColor="bg-emerald-500 hover:bg-emerald-600" 
                    className="px-6 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    Edit
                  </Button>
                </Link>
                <Button 
                  bgColor="bg-red-500 hover:bg-red-600" 
                  onClick={deletePost}
                  className="px-6 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto">
            {!imgUrl && (
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                  {post.title}
                </h1>
              </div>
            )}
            
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-blue-600 prose-strong:text-slate-800">
                {parse(post.content)}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
