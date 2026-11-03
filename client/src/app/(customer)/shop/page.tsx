"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTanstackQuery, { axiosInstance } from "@/hooks/useAxiosInstance";
import { toast } from "react-toastify";
import { commonButtonStyle } from "@/utils/commonButtonStyle";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ShopPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { data, isLoading, isError, error } = useTanstackQuery("/products");

  // Handle loading and error states
  if (isLoading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading products: {error?.message || "Unknown error"}
      </div>
    );
  }

  const handleAddToWishlist = async (productId: string) => {
    try {
      await axiosInstance.post("/wishlist/add", { productId });
      toast.success("Added to wishlist!");
      setWishlistIds((prev) => [...prev, productId]);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not add to wishlist");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products?.map((product: any) => (
          <Card key={product._id} className="flex flex-col shadow-lg">
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>

            <CardContent>
              {product.image && (
                <Link href={`/shop/${product._id}`}>
                  <img
                    src={`${product.image}`}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                </Link>
              )}
              
              <p className="text-gray-700 mb-2">{product.sku}</p>
              <div className="font-semibold text-lg mb-4">${product.price}</div>
              <div className="flex items-center justify-between gap-2">
                <button
                  title="Add to Wishlist"
                  onClick={() => handleAddToWishlist(product._id)}
                  disabled={wishlistIds.includes(product._id)}
                >
                  <Heart
                    className={`w-8 h-8 mr-2 ${
                      wishlistIds.includes(product._id)
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 cursor-pointer"
                    }`}
                  />
                </button>

                <Link href={`/shop/${product._id}`} className="flex-1">
                  <Button className={`${commonButtonStyle} w-full`}>
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )) }

        {data.products.length || <p className="text-red-500">Product Not Available!!</p>}
      </div>
    </div>
  );
}
