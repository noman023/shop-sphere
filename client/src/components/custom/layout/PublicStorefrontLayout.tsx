"use client";

import { AuthContext } from "@/context/AuthContext";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function PublicStorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(AuthContext)!;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold tracking-tight text-gray-950">
              Shop<span className="text-red-600">Sphere</span>
            </span>
          </Link>

          <nav className="flex items-center gap-5 sm:gap-8">
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-700 hover:text-red-600"
            >
              Shop
            </Link>
            <Link
              href="/#benefits"
              className="hidden text-sm font-medium text-gray-700 hover:text-red-600 sm:block"
            >
              Why ShopSphere
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
              >
                My account <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Join us
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-7 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShopSphere. Find something you love.
      </footer>
    </div>
  );
}
