"use client"
import CustomerProfile from "@/components/custom/profile/CustomerProfile";
import SellerProfile from "@/components/custom/profile/SellerProfile";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Profile() {
  const { user } = useContext(AuthContext)!;

  return (
    <div className="pb-10">
      {user?.userRole === "seller" ? <SellerProfile /> : <CustomerProfile />}
    </div>
  );
}
