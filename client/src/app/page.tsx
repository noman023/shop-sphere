"use client";

import { Button } from "@/components/ui/button";
import useTanstackQuery from "@/hooks/useAxiosInstance";
import { ArrowRight, Heart, PackageCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
};

export default function Home() {
  const { data, isLoading, isError, error } = useTanstackQuery("/products");
  const products: Product[] = data?.products ?? [];

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
            <ShoppingBag className="h-4 w-4" />
            A little something for every day
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-950 sm:text-6xl">
            Good finds.
            <br />
            <span className="text-red-600">Good days.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Discover products picked for everyday life, all in one place. Find
            something you love and make it yours.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 bg-red-600 px-6 text-base hover:bg-red-700">
              <Link href="/shop">
                Explore the shop <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-12 px-6 text-base">
              <Link href="/register">Create an account</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-red-600" />
              Track your orders
            </span>

            <span className="inline-flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Save your favorites
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-amber-100 sm:-left-8 sm:-top-8 sm:h-36 sm:w-36" />
          <div className="absolute -bottom-5 -right-4 h-32 w-32 rounded-full bg-red-100 sm:-bottom-8 sm:-right-8 sm:h-44 sm:w-44" />
          
          <div className="relative flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-xl sm:min-h-96 sm:p-10">
            <div className="absolute -right-14 -top-16 h-64 w-64 rounded-full border-[36px] border-red-500/80" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                ShopSphere
              </p>

              <h2 className="mt-6 max-w-sm text-3xl font-semibold leading-snug sm:text-4xl">
                Your next favorite is just around the corner.
              </h2>
            </div>

            <div className="relative mt-12 flex items-end justify-between">
              <p className="max-w-xs text-gray-300">
                Browse the latest products and find something worth bringing
                home.
              </p>

              <ShoppingBag className="h-12 w-12 shrink-0 text-red-300" />
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="bg-gray-50 px-6 py-16 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                Start exploring
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-950">
                A few things to get you started
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-semibold text-red-600 hover:text-red-700"
            >
              Shop all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-gray-500">Loading products...</p>
          ) : isError ? (
            <p className="py-12 text-center text-red-600">
              Could not load products: {error?.message || "Please try again later."}
            </p>
          ) : products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <Link
                  key={product._id}
                  href={`/shop/${product._id}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm text-gray-500">
                      {product.category || "ShopSphere find"}
                    </p>

                    <h3 className="mt-1 truncate font-semibold text-gray-950 group-hover:text-red-600">
                      {product.title}
                    </h3>

                    <p className="mt-3 text-lg font-bold text-gray-950">
                      ${product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500">
              New products are on their way. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-16 text-center sm:px-10 md:flex-row md:text-left lg:px-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-950">
            Ready to find your next favorite?
          </h2>

          <p className="mt-2 text-gray-600">
            Take a look around and see what catches your eye.
          </p>
        </div>

        <Button asChild className="bg-red-600 px-6 hover:bg-red-700">
          <Link href="/shop">Browse products</Link>
        </Button>
      </section>
    </div>
  );
}
