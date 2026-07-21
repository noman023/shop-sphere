"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Boxes, DollarSign, Info, Package, ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { commonButtonStyle } from "@/utils/commonButtonStyle";
import { axiosInstance } from "@/hooks/useAxiosInstance";
import { toast } from "react-toastify";

const formatCategory = (value?: string) =>
  value
    ? value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "N/A";

type ProductDetailsViewProps = {
  product: any;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  showActions?: boolean;
  backLabel?: string;
};

export default function ProductDetailsView({
  product,
  isLoading,
  isError,
  error,
  showActions = false,
  backLabel = "Back",
}: ProductDetailsViewProps) {
  const router = useRouter();

  if (isLoading) return <div className="p-8 text-center">Loading product...</div>;

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading product: {error?.message || "Unknown error"}
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post("/cart/add", { productId: product?._id, quantity: 1 });
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Could not add to cart");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Product Details</h1>
          <p className="text-sm text-gray-500">A clean view of the product for every user.</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="shrink-0">
            {product?.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="h-56 w-full max-w-70 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-56 w-full max-w-70 items-center justify-center rounded-lg bg-gray-100">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{product?.title || "N/A"}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {product?.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Tag className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium">{formatCategory(product?.category)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-medium">${product?.price ?? "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Boxes className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="font-medium">{product?.quantity ?? "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Info className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Brand</p>
                  <p className="font-medium">{product?.brand || "N/A"}</p>
                </div>
              </div>
            </div>

            {showActions && (
              <div className="flex flex-wrap gap-3 border-t pt-4">
                <Button onClick={handleAddToCart} className={`${commonButtonStyle}`}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => router.push("/wishlist")}>View Wishlist</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
