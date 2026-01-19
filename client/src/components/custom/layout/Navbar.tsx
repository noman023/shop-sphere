"use client";
import { useContext, useState } from "react";
import {
  Bell,
  ChevronDown,
  Globe,
  CircleHelp,
  PanelLeftIcon,
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
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/baseURL";

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  const { logout, user } = useContext(AuthContext)!;

  const languages = ["EN", "BN"];

  const toggleSidebar = () => {
    const sidebar = document.querySelector("#sidebar");
    sidebar?.classList.toggle("-translate-x-full");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    toast.success("Logout Successfully!");
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between ">
      <button className="lg:hidden p-2 " onClick={toggleSidebar}>
        <PanelLeftIcon className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur-sm opacity-50"></div>
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-1.5">
            <div className="bg-white rounded px-2 py-1">
              <span className="text-red-600 font-bold text-lg">S</span>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
          ShopSphere
        </h1>
      </div>
    

      <div className="flex items-center">
        <div className="relative flex items-center">
          <Globe className="w-5 h-5" />
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="flex items-center px-2 py-1 text-sm"
          >
            {lang}
            <ChevronDown className="w-4 h-4" />
          </button>
          {isOpen && (
            <div className="absolute left-0 top-full mt-1 w-16 bg-white border rounded shadow z-10">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setIsOpen(false);
                  }}
                  className={`block w-full px-3 py-1 text-left text-sm hover:bg-gray-100 ${
                    lang === l ? "font-semibold text-blue-600" : ""
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-gray-dark hover:bg-gray-light mx-2 hidden md:block"
        >
          <CircleHelp className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative p-2 text-gray-dark hover:bg-gray-light"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </Button>

        <div className="relative ml-2">
          <DropdownMenu
            open={showProfileMenu}
            onOpenChange={setShowProfileMenu}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center hover:bg-gray-light rounded-md p-1"
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
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
