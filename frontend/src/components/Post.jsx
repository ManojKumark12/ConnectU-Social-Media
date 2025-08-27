import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LikeButton from "./LikeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Bookmark, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { apiFetch } from "./apiFetch";
import { toast } from "react-toastify";
import { Menu } from "@headlessui/react"; // optional, or you can implement custom dropdown
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";

dayjs.extend(relativeTime);

export const Post = ({ feed, index, author }) => {
  const postAuthor = feed.author || author;
const adminid=useSelector((state)=>state.user.user.id);
  // 🔹 Local state for comments
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch comments when user clicks
  const handleToggleComments = async () => {
    if (!showComments) {
      try {
        setLoading(true);
        const res = await apiFetch(`${import.meta.env.VITE_API_URL}/comment/${feed.id}/`, { method: "GET" });
        const data = await res.json();
        setComments(data.data);
      } catch (err) {
        toast.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  // 🔹 Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/comment/${feed.id}/`, {
        method: "POST",
        body: JSON.stringify({ text: newComment }),
      });
      const data = await res.json();

      if (res.ok) {
        // prepend the new comment
        setComments([data.data, ...comments]);
        setNewComment("");
      } else {
        console.error("Failed to add comment:", data);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }



  };

  return (
    <Card
      key={feed.id}
      className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 rounded-3xl"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {/* Header */}
  <CardHeader className="relative z-10 flex flex-row items-center justify-between p-6 pb-4">
  <div className="flex items-center gap-4">
    <div className="relative">
      <Avatar className="w-14 h-14 ring-2 ring-gray-200 transition-all duration-300">
        {postAuthor.profile_photo ? (
          <AvatarImage
            src={decodeURIComponent(
              postAuthor.profile_photo.replace("http://127.0.0.1:8000/", "")
            )}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-lg">
            {postAuthor.username[0].toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
    <div>
      <CardTitle className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
        <Link to={`/profile/${postAuthor.id}`}>{postAuthor.username}</Link>
      </CardTitle>
      <p className="text-sm text-gray-500 mt-1">
        {dayjs(feed.created_at).format("MMM D, YYYY h:mm A")}
      </p>
    </div>
  </div>
  {/* Three-dot menu for author */}
  {postAuthor.id === adminid && (
   
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none z-50">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={async () => {
                if (confirm("Are you sure you want to delete this post?")) {
                  try {
                    const token = localStorage.getItem("access_token");
                    const res = await apiFetch(`${import.meta.env.VITE_API_URL}/deletePost/${feed.id}/`, {
                      method: "DELETE",
                      headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    });
                    const data = await res.json();
                    if (res.ok) {
                      toast.success(data.message);
                      window.location.reload();
                    } else {
                      toast.error(data.error);
                    }
                  } catch (err) {
                    toast.error("Error deleting post");
                  }
                }
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                active ? "bg-red-500 text-white" : "text-red-600"
              }`}
            >
              Delete Post
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )}
</CardHeader>


      {/* Caption */}
      {feed.caption && (
        <div className="px-6 pb-4">
          <p className="text-gray-800 text-base leading-relaxed font-medium">
            {feed.caption}
          </p>
        </div>
      )}

      {/* Image */}
      {feed.image && (
        <CardContent className="px-6 pb-4">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={decodeURIComponent(feed.image.replace("http://127.0.0.1:8000/", ""))}
              alt={feed.caption || "Feed image"}
              className="w-full max-h-[500px] object-cover transition-all duration-700"
              loading="lazy"
            />
          </div>
        </CardContent>
      )}

      {/* Text Content */}
      {feed.text && (
        <div className="px-6 pb-4">
          <p className="text-gray-700 text-base leading-relaxed">{feed.text}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-6 pb-6 pt-2 border-t border-gray-100/80">
        <div className="flex items-center gap-1">
          <LikeButton
            id={feed.id}
            liked={feed.liked_or_not || feed.liked_by_me}
            likes_count={feed.likes_count || feed.no_of_likes}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-blue-50 text-gray-600 hover:text-blue-600 group/comment"
          >
            <MessageCircle className="w-5 h-5 transition-transform group-hover/comment:rotate-12" />
            <span className="font-medium">
              {showComments ? "Hide Comments" : "Show Comments"}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 pb-4">
          {/* Input for new comment */}
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          {loading ? (
            <p className="text-gray-500 text-sm">Loading comments...</p>
          ) : comments.length > 0 ? (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">

                    {c.user.profile_photo ? (
                      <AvatarImage src={decodeURIComponent(c.user.profile_photo).replace(
                            /^\//,
                            ""
                        )} />
                    ) : (
                      <AvatarFallback>
                        {c.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{c.user.username}</p>
                    <p className="text-sm text-gray-700">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
        </div>
      )}
    </Card>
  );
};
