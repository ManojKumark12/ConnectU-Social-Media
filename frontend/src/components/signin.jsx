import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { addUser } from "./redux/user.slice"
import { useDispatch } from "react-redux"
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
import { toast } from "react-toastify"

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export function Signin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login/`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
   const data = await response.json();
 
    if (response.ok) {
   
     
      dispatch(addUser(data.data))
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
toast.success("Login Success!!");
      navigate("/")
    } else {
  
      toast.error("invalid credentials");
      form.setError("root", {
        type: "manual",
        message: "Invalid credentials",
      })
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full sm:w-[80vw] md:w-[60vw] lg:w-[40vw] xl:w-[25vw] p-6 shadow-lg rounded-2xl bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Log In Into Account
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 text-base md:text-lg"
          >
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

            {/* Global error */}
            {form.formState.errors.root && (
              <p className="text-red-500 text-center text-sm">
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2 text-base md:text-lg rounded-lg shadow-md"
            >
              Login
            </Button>

            {/* Redirect to signup */}
            <div className="text-center text-sm md:text-base">
              Don’t have an account?{" "}
              <Link to="/signup" className="underline text-blue-500">
                Signup
              </Link>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
