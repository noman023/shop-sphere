"use client";

import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { commonButtonStyle } from "@/utils/commonButtonStyle";
import { axiosInstance } from "@/hooks/useAxiosInstance";
import { toast } from "react-toastify";

type SellerProfileFormValues = {
  storeName: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  image: string;
};

export default function SellerProfile() {
  const { user, setUser } = useContext(AuthContext)!;
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<SellerProfileFormValues>({
    defaultValues: {
      storeName: user?.storeName || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      country: user?.country || "",
      bio: user?.bio || "",
      image: user?.image || "",
    },
  });

  const storeName = watch("storeName");
  const photoPreview = watch("image");


  const headline = useMemo(() => storeName || "Your store name", [storeName]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setValue("image", reader.result, { shouldDirty: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: SellerProfileFormValues) => {
    try {
      const payload = {
        storeName: data.storeName.trim(),
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        country: data.country.trim(),
        bio: data.bio.trim(),
      };

      let response;
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as string);
          }
        });

        response = await axiosInstance.put("/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.put("/profile", payload);
      }

      const updatedUser = response?.data?.user;
      if (updatedUser) {
        setUser({ ...(user || {}), ...updatedUser });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt={headline} />
              ) : (
                <AvatarFallback>{headline.charAt(0)}</AvatarFallback>
              )}
            </Avatar>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Store profile</h1>
              <p className="text-sm text-muted-foreground">
                Upload a store image and keep your shop details fresh for customers.
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Profile type</p>
            <p className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              Seller
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-gray-200 p-6">
          <CardHeader className="flex flex-col gap-2 p-0">
            <CardTitle className="text-xl">Store information</CardTitle>
            <CardDescription>Update your store name, contact details, and brand story.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store name</Label>
                <Input
                  id="store-name"
                  placeholder="Nimbus Studio"
                  {...register("storeName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner-name">Owner name</Label>
                <Input
                  id="owner-name"
                  placeholder="Alex Carter"
                  {...register("name")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seller-email">Business email</Label>
                <Input
                  id="seller-email"
                  type="email"
                  placeholder="store@example.com"
                  {...register("email")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-phone">Contact phone</Label>
                <Input
                  id="seller-phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-bio">Store description</Label>
              <Textarea
                id="seller-bio"
                placeholder="Share what makes your store special and what customers can expect."
                className="min-h-35"
                {...register("bio")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-country">Country / region</Label>
              <Input
                id="seller-country"
                placeholder="United States"
                {...register("country")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 p-6">
          <CardHeader className="flex flex-col gap-2 p-0">
            <CardTitle className="text-xl">Store photo</CardTitle>
            <CardDescription>Upload a recognizable store image for your storefront.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-4">
              <div className="text-sm text-muted-foreground">
                Use a photo or logo so buyers instantly recognize your store.
              </div>
              <div className="rounded-3xl border border-dashed border-slate-200 p-4 text-center">
                <Avatar className="mx-auto mb-4 h-24 w-24">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt={headline} />
                  ) : (
                    <AvatarFallback>{headline.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <label className="block cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Upload store photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </CardContent>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" className={commonButtonStyle}>
              Save store profile
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
