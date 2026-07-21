"use client";

import { useParams } from "next/navigation";
import useTanstackQuery from "@/hooks/useAxiosInstance";
import ProductDetailsView from "@/components/custom/products/ProductDetailsView";

export default function ViewProduct() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useTanstackQuery(`/products/${id}`);

  return (
    <ProductDetailsView
      product={data?.product}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  )
}