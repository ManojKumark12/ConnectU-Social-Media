import { useSelector, useDispatch } from "react-redux"
import logo from "@/assets/logo.png"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { removeUser } from "./redux/user.slice"
import { Avatar, AvatarImage ,AvatarFallback} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { fixUrl } from "./firurl"
import Userimage from "@/assets/Userimage.png"
export default function Topbar() {
  const loggedin = useSelector((state) => state.user.userloggedin);
  const id = useSelector((state) => state.user.user.id);
  const email = useSelector((state) => state.user.user.email);
  const pic = useSelector((state) => state.user.user.profile_photo);
  const username = useSelector((state) => state.user.user.username);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const signout = () => {
    dispatch(removeUser());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  return (
    <div className="w-full shadow-md bg-white">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center h-16 px-4 md:px-6">
        {/* Logo */}
        <img src={logo} alt="logo" className="w-28 h-28 md:w-32" />

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="">Feed</Link>
          <Link to="/makefriends">Make Friends</Link>
          <Link to="/addposts">Add Posts</Link>
        </div>
        {console.log("profile pic in topbar:", pic)}
        {console.log("decoded topbar:", fixUrl(pic))}
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {loggedin ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-12 h-12 cursor-pointer"> {/* Increase size from w-12 h-12 to w-16 h-16 */}
                  {pic ? <AvatarImage
                    src={fixUrl(pic)}
                    className="object-cover"
                  /> :
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-semibold text-xl">
                      {username && username[0] ? username[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  }
                </Avatar>

              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`profile/${id}`}>My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="editprofile/">Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={signout}>Logout</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button><Link to="/signin">Login</Link></Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg border"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col items-center py-3 gap-3 text-gray-700">
            <Link to="" onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/makefriends" onClick={() => setMenuOpen(false)}>Make Friends</Link>
            <Link to="/addposts" onClick={() => setMenuOpen(false)}>Add Posts</Link>
          </div>
        </div>
      )}
    </div>
  )
}
