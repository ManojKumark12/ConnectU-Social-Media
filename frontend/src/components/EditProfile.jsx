import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Userimage from "@/assets/logo.png"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { addUser } from "./redux/user.slice";
import { apiFetch } from "./apiFetch";
import { toast } from "react-toastify";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  bio: z.string().optional(),
  profile_photo: z.any().optional(),
});

export function EditProfile() {
  const dispatch = useDispatch(); // ✅ move useDispatch to top-level
  const user = useSelector((state) => state.user.user);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user?.profile_photo) {
      setPreview(decodeURIComponent(user.profile_photo).replace(/^\//, ""));
    }
  }, [user]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profile_photo: null,
    },
  });

 async function onSubmit(values) {
  try {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("bio", values.bio || "");
    if (values.profile_photo?.[0]) {
      formData.append("profile_photo", values.profile_photo[0]);
    }

    const response = await apiFetch(`${import.meta.env.VITE_API_URL}/editprofile/`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json();
   

    if (response.ok) {
      dispatch(addUser(data.data));
      setPreview(data.data.profile_photo);
      form.reset({
        username: data.data.username,
        email: data.data.email,
        bio: data.data.bio,
        profile_photo: null,
      });
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Update failed:", data.message);
      // alert("Update failed: " + (data.message || "Unknown error"));
    }
  } catch (err) {
    toast.error("Something Went Wrong");
    // alert("Something went wrong!");
  }
}

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
    <Card className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10 transform scale-105"></div>

      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Edit Profile
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 text-lg"
        >
            {/* Profile Photo */}
            <FormField
  control={form.control}
  name="profile_photo"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-700 font-medium">
        Profile Photo
      </FormLabel>
      <FormControl>
        <div className="relative w-24 h-24">
          {/* Hidden input */}
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            className="hidden"
            onChange={(e) => {
              field.onChange(e.target.files);
              if (e.target.files?.[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />

          {/* Preview circle */}
          <label
            htmlFor="profileUpload"
            className="cursor-pointer group"
          >
            <img
              src={preview ||Userimage} // fallback placeholder
              alt="preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />

            {/* Camera overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 7.5l.636-1.273A1.5 1.5 0 018.727 5.25h6.546a1.5 1.5 0 011.341.977L17.25 7.5M4.5 7.5h15M4.5 7.5A2.25 2.25 0 002.25 9.75v7.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0019.5 7.5m-15 0V6a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0120.25 6v1.5"
                />
              </svg>
            </div>
          </label>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Bio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button  type="submit" className="w-full py-2 text-lg rounded-lg shadow-md">
              Update
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
