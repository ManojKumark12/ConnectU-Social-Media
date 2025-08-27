import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Camera } from "lucide-react"



const formSchema = z
  .object({
    username: z.string().min(5, "Must be at least 5 characters"),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmpassword: z.string(),
    profile_photo: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  })

export function Signup() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState(null)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      profile_photo: null,
    },
  })

  async function onSubmit(values) {
    const formData = new FormData()
    formData.append("username", values.username)
    formData.append("email", values.email)
    formData.append("password", values.password)
    formData.append("password2", values.confirmpassword)
    if (values.profile_photo && values.profile_photo.length > 0) {
      formData.append("profile_photo", values.profile_photo[0])
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/register/`, {
      method: "post",
      body: formData,
    })

    if (response.status === 201) {
      const data = await response.json()
     toast.success(data.message);
      navigate("/signin")
      return
    } else {
      const error = await response.json()
      Object.entries(error).forEach(([field, messages]) => {
        form.setError(field, { type: "manual", message: messages.join(", ") })
      })
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full sm:w-[90vw] md:w-[70vw] lg:w-[50vw] xl:w-[30vw] p-6 shadow-lg rounded-2xl bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 text-base md:text-lg"
          >
            {/* Profile Photo Upload */}
            <FormField
              control={form.control}
              name="profile_photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Profile Photo
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <input
                        id="profile-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          field.onChange(e.target.files)
                          if (e.target.files?.[0]) {
                            setPreview(URL.createObjectURL(e.target.files[0]))
                          }
                        }}
                      />

                      <label
                        htmlFor="profile-photo-input"
                        className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 transition"
                      >
                        <Camera className="w-6 h-6" />
                      </label>

                      {preview && (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-16 h-16 rounded-full object-cover border"
                        />
                      )}
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
                  <FormLabel className="text-gray-700 font-medium">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
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
                  <FormLabel className="text-gray-700 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2 text-base md:text-lg rounded-lg shadow-md"
            >
              Signup
            </Button>

            <div className="text-center text-sm md:text-base">
              Already have an account?{" "}
              <Link to="/signin" className="underline text-blue-500">
                Signin
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
    
  )
}
