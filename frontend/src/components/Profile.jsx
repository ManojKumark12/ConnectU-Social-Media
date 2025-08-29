import { useEffect, useState } from "react";
import { User, Calendar, Heart, MessageCircle, Share, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import LikeButton from "./LikeButton";
import { useSelector } from "react-redux";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { apiFetch } from "./apiFetch";
import { Post } from "./Post";
import { fixUrl } from "./firurl";
dayjs.extend(relativeTime)
export const Profile = () => {
const adminid=useSelector((state)=>state.user.user.id);
 const { id } = useParams(); // destructure id

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
   const response=await apiFetch(`${import.meta.env.VITE_API_URL}/userProfileview/${id}/`,{
    method:'get',
    headers:{
"Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
    }
  })

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.data);
      } else {
        setError("Failed to fetch user profile");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

    const handleFollowToggle = async () => {
        const token = localStorage.getItem("access_token");
        const response = await apiFetch(`${import.meta.env.VITE_API_URL}/addFriend/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
          // fetchUserDetails();
                setUserProfile((prev) => ({
        ...prev,
        is_following: !prev.is_following,
        no_of_followers: prev.is_following
          ? prev.no_of_followers - 1
          : prev.no_of_followers + 1,
      }));
          console.log(data.message);
            // setFetchusers((prev) => !prev);
        } else {
            console.log(data.error);
        }
    };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
         
            <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
          
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 backdrop-blur-sm bg-opacity-95">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 p-1 shadow-xl">
                {userProfile.profile_photo ? (
                  <img
                    
                       src={fixUrl(userProfile.profile_photo)} 
                    alt={userProfile.username}
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {userProfile.username}
              </h2>
              <p className="text-gray-600 mb-4">{userProfile.email}</p>
              
              {userProfile.bio && (
                <p className="text-gray-700 mb-6 leading-relaxed max-w-md">
                  {userProfile.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {userProfile.posts?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <Link to={`/connections/followers/${id}`}>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProfile.no_of_followers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                  </Link>
                </div>
                <div className="text-center">
                  <Link to={`/connections/following/${id}`}>
                  <div className="text-2xl font-bold text-gray-800">
                    {userProfile.no_of_following || 0}
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              {adminid !=id &&
        <div className="flex justify-center md:justify-start gap-4">
  <button
    onClick={handleFollowToggle}
    className={`px-6 py-3 rounded-full font-medium transform hover:scale-105 transition-all shadow-lg
      ${userProfile?.is_following
        ? "bg-red-500 hover:bg-red-600 text-white"   // Unfollow button
        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" // Follow button
      }`}
  >
    {userProfile?.is_following ? "Unfollow" : "Follow"}
  </button>
</div>
}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Posts ({userProfile.posts?.length || 0})
          </h3>

         
        {userProfile.posts && userProfile.posts.length > 0 ? (
          <div className="space-y-6">
            {userProfile.posts.map((post, index) => (
              <Post key={post.id} feed={post} index={index} author={userProfile} />
            ))}
          </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h4>
              <p className="text-gray-500">This user hasn't shared any posts yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};