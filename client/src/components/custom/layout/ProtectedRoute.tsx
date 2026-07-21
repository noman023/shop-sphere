"use client";
import { AuthContext } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  // Allow public access to login and register
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!auth?.loading && !auth?.user && !isAuthPage) {
      router.replace("/login");
    }
  }, [auth?.loading, auth?.user, isAuthPage, router]);

  if (auth?.loading || (!auth?.user && !isAuthPage)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">        
          Loading...        
      </div>
    );
  }

  return <>{children}</>;
}
