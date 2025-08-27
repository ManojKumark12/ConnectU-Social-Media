
import Home from "@/components/Home.jsx"
import Layout from "@/components/Layout.jsx"
import Makefriends from "@/components/makefriends"
import Addposts from "@/components/addposts"
import { Signin } from "@/components/signin.jsx"
import { Signup } from "@/components/signup.jsx"
import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Profile } from "@/components/Profile.jsx"
import  Connections  from "@/components/connections.jsx"
import { EditProfile } from "@/components/EditProfile"

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,    // layout wrapper
    children: [
     {path:"",element:<Home/>},
  
      { path: "makefriends/", element: <Makefriends /> },
      { path: "addposts/", element: <Addposts /> },
     
      { path: "editprofile/", element: <EditProfile /> },
      {path:"profile/:id",element:<Profile />},
     {path:"connections/:type/:id",element:<Connections/ >},
     
    ],
  },
  {
    path: "/signin",
    element: <Signin />,  
  },
    {
    path: "/signup",
    element: <Signup />,  
  }
])

export default router