import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "./apiFetch";
import { toast } from "react-toastify";
import { fixUrl } from "./firurl";
export default function Connections() {
    const { type, id } = useParams(); // followers | following
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConnections = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await apiFetch(`${import.meta.env.VITE_API_URL}/${type}/${id}`, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.data);
            }
        } catch (err) {
            toast.error("Error fetching connections:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, [type, id]);

    const handleFollowToggle = async (userId) => {
        const token = localStorage.getItem("access_token");
        const response = await apiFetch(`${import.meta.env.VITE_API_URL}/addFriend/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setUsers((prev) =>
                prev.map((user) =>
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

    if (loading) return <div className="p-6">Loading {type}...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 capitalize">
                        {type}
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        See {type === "followers" ? "who’s following you" : "who you are following"}
                    </p>
                </div>

                {/* User Cards */}
                <div className="flex flex-col items-center gap-6 w-full">
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <Card
                                key={user.id}
                                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl hover:-translate-y-1 w-full md:w-[600px] lg:w-[700px]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="flex flex-row items-center gap-4 p-4">
                                    <Avatar className="relative w-16 h-16 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        <AvatarImage
                                            src={
                                                user.profile_photo
                                                    ? fixUrl(user.profile_photo)
                                                    : "https://via.placeholder.com/50"
                                            }
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold text-lg">
                                            {user.username[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-semibold text-gray-800 mb-2 truncate hover:text-blue-600 transition-all duration-300">
                                            <Link to={`/profile/${user.id}`}>{user.username}</Link>
                                        </CardTitle>
                                        <CardDescription className="text-gray-500 text-sm break-words line-clamp-2">
                                            {user.bio || "No bio available"}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                {/* Stats */}
                                <div className="px-4 pb-2">
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                                            <span className="text-blue-700 font-medium">
                                                Followers: {user.no_of_followers}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                                            <span className="text-blue-700 font-medium">
                                                Following: {user.no_of_following}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
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
                                            {user.is_following ? "Unfollow" : "Follow"}
                                        </span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <h1 className="text-gray-500 text-xl mt-10">No {type} found</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
