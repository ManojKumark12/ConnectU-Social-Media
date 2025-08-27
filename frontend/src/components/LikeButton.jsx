import { useState, useEffect } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { apiFetch } from "./apiFetch";
import { toast } from "react-toastify";
const LikeButton = ({ id, liked ,likes_count}) => {

  const [isliked, setliked] = useState(liked);
  const [likes,setlikes]=useState(likes_count)
//   // ✅ keep state in sync with prop when feed reloads
useEffect(() => {
  setliked(liked);          // update state when prop changes
  setlikes(likes_count);
}, [liked, likes_count]);    // run only when props change


  const handlelike = async () => {
    try {
        const token = localStorage.getItem("access_token");
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/liked/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();

      if (response.ok) {
setlikes(res.no_of_likes);
        setliked(prev => !prev);
// toggle state after success
        
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Error while liking:", err);
      
    }
  };

  return (
    <button
      className={`flex items-center text-xl transition-colors duration-200 
                  ${isliked ? "text-blue-500" : "text-gray-500"} hover:text-blue-600`}
      onClick={handlelike}
    >
      {isliked ? <AiFillLike /> : <AiOutlineLike />}{likes}
      {/* <span className="ml-1">Like</span> */}
    </button>
  );
};

export default LikeButton;
