
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { apiFetch } from "./apiFetch";
dayjs.extend(relativeTime)


import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { Post } from "./Post";
import { toast } from "react-toastify";
export default function Home() {
  const [feeds, setFeeds] = useState([])
  // const [feeds, setfeeds] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      // const token=localStorage.getItem('access_token');
      const result = await apiFetch(`${import.meta.env.VITE_API_URL}/allfeeds/`, {
        method: "get",

      });
      try {
        const data = await result.json();
        setFeeds(Array.isArray(data?.data) ? data.data : []);

      } catch (err) {
        toast.error("Failed to fetch feeds:", err);
        setFeeds([]);
      }

    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Social Feed
          </h1>
        </div>
      </div>

      {/* Feed Container */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {feeds && feeds.length > 0 ? (
          feeds.map((feed, index) => (
            <Post feed={feed} index={index} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">No feeds yet</h2>
            <p className="text-gray-500 text-center max-w-md">
              It looks a bit quiet here. Follow some friends or create your first post to get started!
            </p>
         
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}