"use client";
import { useContext, useState } from "react";
import {
  Bell,
  ChevronDown,
  PanelLeftIcon,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/baseURL";
import Link from "next/link";
import { commonButtonStyle } from "@/utils/commonButtonStyle";

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout, user } = useContext(AuthContext)!;

  const toggleSidebar = () => {
    const sidebar = document.querySelector("#sidebar");
    sidebar?.classList.toggle("-translate-x-full");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    setShowLogoutDialog(false);
    setShowProfileMenu(false);
    toast.success("Logout Successfully!");
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between ">
       {/* sidbar toggle button for small screen */}
      <button className="lg:hidden p-2 " onClick={toggleSidebar}>
        <PanelLeftIcon className="w-6 h-6" />
      </button>

      {/* app logo */}
      <div className="flex items-center gap-2">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            ShopSphere
          </h1>
        </Link>
      </div>

        {/* User profile menu  */}    
        <div className="relative ml-2">
          <DropdownMenu
            open={showProfileMenu}
            onOpenChange={setShowProfileMenu}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center hover:bg-gray-light rounded-md p-1 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.image && `${baseURL}/uploads/${user.image}`}
                    alt={user?.name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                </div>
                
                <ChevronDown className="ml-2 h-4 w-4 text-gray-dark" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <Link href={'/profile'}>
                <DropdownMenuItem className="cursor-pointer" >
                  Profile
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      

       {/* logout confirmation modal */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="cursor-pointer"              
            >
              Cancel
            </Button>

            <Button
              type="button"              
              onClick={handleLogout}
              className={commonButtonStyle}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
