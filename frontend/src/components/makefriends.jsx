import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { apiFetch } from "./apiFetch";
export default function Makefriends() {
    const [otherusers, setOtherUsers] = useState([]);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allusers/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
           
            setOtherUsers(data.data);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFollowToggle = async (userId) => {
        const token = localStorage.getItem("access_token");
        const response = await apiFetch(`${import.meta.env.VITE_API_URL}/addFriend/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
           setOtherUsers((prevUsers) =>
  prevUsers.map((user) =>
    user.id === userId
      ? {
          ...user,
          is_following: !user.is_following,
          no_of_followers: user.is_following
            ? user.no_of_followers - 1
            : user.no_of_followers + 1,
        }
      : user
  )
);

        } else {
            console.log(data.error);
        }
    };

    return (
        <>
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
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                    animation-fill-mode: both;
                }
            `}</style>
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Discover Amazing People
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Connect with talented individuals and expand your network
                        </p>
                    </div>

                    {/* Users Grid */}
                    <div className="flex flex-col items-center gap-6 w-full">
                        {otherusers && otherusers.length > 0 ? (
                            otherusers.map((user, index) => (
                                <Card
                                    key={user.id}
                                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl hover:-translate-y-1 w-full md:w-[600px] lg:w-[700px] animate-fade-in-up"
                                    style={{
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    {/* Gradient Border Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10 transform scale-105"></div>
                                    
                                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                                        {/* Avatar with Ring Effect */}
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-16 h-16 bg-white rounded-full"></div>
                                            </div>
                                            <Avatar className="relative w-16 h-16 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                <AvatarImage
                                                    src={decodeURIComponent(user.profile_photo).replace("http://127.0.0.1:8000/", "")}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold text-lg">
                                                    {user.username[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Online Status Indicator */}
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-sm"></div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 truncate">
                                                         <Link to={`/profile/${user.id}`}>
                                                                     {user.username}</Link>
                                            </CardTitle>
                                            <CardDescription className="text-gray-500 text-sm break-words line-clamp-2">
                                                {user.bio || "No bio available"}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>

                                    {/* Stats Section */}
                                    <div className="px-4 pb-2">
                                        <div className="flex gap-4 text-sm">
                                            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                                                </svg>
                                                <span className="text-blue-700 font-medium">
                                                    Followers: {user.no_of_followers}
                                                </span>
                                            </div>
                                             <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                                                </svg>
                                                <span className="text-blue-700 font-medium">
                                                    Following: {user.no_of_following}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
                                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-purple-700 font-medium">
                                                    Posts: {user.no_of_posts}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <CardFooter className="flex justify-end p-4 gap-2">
                                        <Button
                                            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 ${
                                                user.is_following
                                                    ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                                            }`}
                                            onClick={() => handleFollowToggle(user.id)}
                                        >
                                            <span className="flex items-center gap-2">
                                                {user.is_following ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Unfollow
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Follow
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h1 className="text-gray-500 text-xl mt-10">No users to follow</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}















// import {
//     Card,
//     CardContent,
//     CardFooter,
//     CardHeader,
//     CardTitle,
//     CardDescription,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import logo from "@/assets/logo.png";

// export default function Makefriends() {
//     const [otherusers, setOtherUsers] = useState([]);
// const [fetchuserss,setFetchusers]=useState(true);
//      const fetchUsers = async () => {
//             const token = localStorage.getItem("access_token");
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/allusers/`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });
//             if (response.ok) {
//                 const data = await response.json();
//                 setOtherUsers(data.data);
//             }
//         };
//     useEffect(() => {
   
//         fetchUsers();
//     }, [fetchuserss]);

//     const handleFollowToggle = async (userId) => {
//         // Add follow/unfollow logic here const token = localStorage.getItem("access_token");
//                const token = localStorage.getItem("access_token");
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/addFriend/${userId}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//             }); 
//             const data = await response.json();
//             if (response.ok) {
//                setFetchusers((prev)=>!prev);
               
               
//             }
//             else{
//                 console.log(data.error);
//             }
       
//     };

//     return (
//         <div className="flex flex-col items-center gap-6 p-6 w-full">
//             {otherusers && otherusers.length > 0 ? (
//                 otherusers.map((user) => (
//                     <Card
//                         key={user.id}
//                         className="w-full md:w-[600px] lg:w-[700px] shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
//                     >
//                         <CardHeader className="flex items-center gap-4 p-4">
//                             <Avatar className="w-16 h-16 flex-shrink-0">

//                                 <AvatarImage
//                                     src={decodeURIComponent(user.profile_photo).replace("http://127.0.0.1:8000/", "")}
//                                 />

//                                 <AvatarFallback>
//                                     {user.username[0].toUpperCase()}
//                                 </AvatarFallback>

//                             </Avatar>
//                             <div className="flex-1">
//                                 <CardTitle className="text-xl font-semibold truncate">{user.username}</CardTitle>
//                                 <CardDescription className="text-gray-500 text-sm break-words">
//                                     {user.bio || "No bio available"}
//                                 </CardDescription>
//                             </div>
                          
//                         </CardHeader>
//   <div>
//                                 Followers:{user.no_of_followers}
//                             </div>
//                             <div>
//                                 Posts:{user.no_of_posts}
//                             </div>
//                         <CardFooter className="flex justify-end p-4 gap-2">
//                             <Button
//                                 className={`px-4 py-2 font-semibold rounded-lg ${user.is_following
//                                         ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
//                                         : "bg-blue-500 text-white hover:bg-blue-600"
//                                     }`}
//                                 onClick={() => handleFollowToggle(user.id)}
//                             >
//                                 {user.is_following ? "Unfollow" : "Follow"}
//                             </Button>
//                         </CardFooter>
//                     </Card>
//                 ))
//             ) : (
//                 <h1 className="text-gray-500 text-xl mt-10">No users to follow</h1>
//             )}
//         </div>
//     );
// }