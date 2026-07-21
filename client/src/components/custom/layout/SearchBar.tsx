"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthContext } from "@/context/AuthContext";
import { commonButtonStyle } from "@/utils/commonButtonStyle";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Books",
];

export default function SearchBar() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const authState = useContext(AuthContext);
  const { userRole } = authState?.user || {};

  return (
    <div className="flex gap-2 flex-col lg:flex-row w-full my-5 lg:px-4">
      <div className="flex sm:flex-1/3 items-center gap-2">
        {/* Search Input with Categories */}
        <div className="flex flex-1 items-center border rounded-lg">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 rounded-none border-r border-input bg-transparent px-3 py-2 text-sm shadow-none focus:ring-0">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Search by product, brand, or keyword"
            className="w-full px-4 py-2 text-sm focus:outline-none"
          />
        </div>

        <Button className={commonButtonStyle}>Search</Button>
      </div>

      <div className="flex items-center justify-center gap-2">        
          {/* buttons for customer only */}
          {userRole === "customer" && (
            <div className="flex items-center gap-4 text-gray-600">
              <Link href={`/wishlist`}>
                <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-red-500">
                  <Heart className="w-6 h-6 " />
                  <p>Wishlist</p>
                </div>
              </Link>

              <Link href={"/cart"}>
                <div className="flex items-center gap-1 cursor-pointer hover:text-red-500">
                  <ShoppingCart className="w-6 h-6 " />
                  <p>Cart</p>
                </div>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
