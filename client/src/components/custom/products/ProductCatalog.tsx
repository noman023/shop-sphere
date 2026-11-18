"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTanstackQuery, { axiosInstance } from "@/hooks/useAxiosInstance";
import { toast } from "react-toastify";
import { commonButtonStyle } from "@/utils/commonButtonStyle";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

type Product = {
  _id: string;
  title: string;
  image?: string;
  sku?: string;
  price: number;
};

export default function ProductCatalog({
  productBasePath,
}: {
  productBasePath: "/shop" | "/browse";
}) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user } = useContext(AuthContext)!;
  const { data, isLoading, isError, error } = useTanstackQuery("/products");

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

  const products: Product[] = data?.products ?? [];

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
      <h1 className="mb-6 text-3xl font-bold">All Products</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const productHref = `${productBasePath}/${product._id}`;

          return (
            <Card key={product._id} className="flex flex-col shadow-lg">
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>

              <CardContent>
                {product.image && (
                  <Link href={productHref}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="mb-2 h-40 w-full rounded object-cover"
                    />
                  </Link>
                )}

                <p className="mb-2 text-gray-700">{product.sku}</p>
                <div className="mb-4 text-lg font-semibold">${product.price}</div>
                <div className="flex items-center justify-between gap-2">
                  {user?.userRole === "customer" && (
                    <button
                      title="Add to Wishlist"
                      onClick={() => handleAddToWishlist(product._id)}
                      disabled={wishlistIds.includes(product._id)}
                    >
                      <Heart
                        className={`mr-2 h-8 w-8 ${
                          wishlistIds.includes(product._id)
                            ? "cursor-not-allowed text-gray-400"
                            : "cursor-pointer text-red-500"
                        }`}
                      />
                    </button>
                  )}

                  <Link href={productHref} className="flex-1">
                    <Button className={`${commonButtonStyle} w-full`}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {products.length === 0 && (
          <p className="text-gray-600">Products are not available right now.</p>
        )}
      </div>
    </div>
  );
}
