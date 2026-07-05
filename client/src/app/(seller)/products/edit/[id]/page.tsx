"use client";

import useTanstackQuery, { axiosInstance } from "@/hooks/useAxiosInstance";
import {
  ProductForm,
  ProductFormType,
} from "@/components/custom/products/ProductForm";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, isError, error } = useTanstackQuery(
    `/products/${id}`
  );

  const handleEdit = async (data: ProductFormType) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("brand", data.brand);
      formData.append("color", data.color);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);

      // Optional fields
      if (data.wholesalePrice)
        formData.append("wholesalePrice", data.wholesalePrice);

      const imageValue = data.image;
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (imageValue && typeof imageValue !== "string") {
        if (Array.from(imageValue).some((file) => file.size > maxSize)) {
          toast.error("Image must be 10MB or less.");
          return;
        }

        if (imageValue.length > 0) {
          formData.append("image", imageValue[0]);
        }
      }

      await axiosInstance.put(`/products/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Error updating product.");
      console.error("Error updating product:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load product"}
      </div>
    );

  // Prepare default values for the form
  const product: ProductFormType = {
    ...data.product,
    image: data.product?.image || null,
  };

  return (
    <div>
      <div className="flex gap-2">
        <ArrowLeft
          onClick={() => window.history.back()}
          className="cursor-pointer"
        />

        <div>
          <h1 className="text-2xl font-bold mb-2">Edit Product Details</h1>

          <p className="text-gray-500 mb-6">
            Edit the details of your product.
          </p>
        </div>
      </div>

      <ProductForm onSubmit={handleEdit} isEdit defaultValues={product} />
    </div>
  );
}
