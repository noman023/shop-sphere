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

type CustomerProfileFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  image: string;
};

export default function CustomerProfile() {
  const { user, setUser } = useContext(AuthContext)!;

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<CustomerProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      country: user?.country || "",
      bio: user?.bio || "",
      image: user?.image || "",
    },
  });

  const name = watch("name");
  const photoPreview = watch("image");

  useEffect(() => {
    if (saved) {
      const timeout = window.setTimeout(() => setSaved(false), 2500);
      return () => window.clearTimeout(timeout);
    }
  }, [saved]);

  const avatarLabel = useMemo(() => name || "Guest", [name]);

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

  const onSubmit = async (data: CustomerProfileFormValues) => {
    try {
      const payload = {
        name: data.name.trim() || user?.name,
        email: data.email.trim() || user?.email,
        phone: data.phone.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
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
        setSaved(true);
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
                <AvatarImage src={photoPreview} alt={avatarLabel} />
              ) : (
                <AvatarFallback>{avatarLabel.charAt(0)}</AvatarFallback>
              )}
            </Avatar>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Profile settings</h1>
              <p className="text-sm text-muted-foreground">
                Upload your photo and keep your account details up to date.
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current role</p>
            <p className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              Customer
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-gray-200 p-6">
          <CardHeader className="flex flex-col gap-2 p-0">
            <CardTitle className="text-xl">Personal details</CardTitle>
            <CardDescription>Change your name, photo, and contact information.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Full name</Label>
                <Input
                  id="customer-name"
                  placeholder="Jane Doe"
                  {...register("name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email address</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="jane@example.com"
                  {...register("email")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Phone number</Label>
                <Input
                  id="customer-phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  {...register("phone")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-country">Country</Label>
                <Input
                  id="customer-country"
                  placeholder="United States"
                  {...register("country")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-bio">About you</Label>
              <Textarea
                id="customer-bio"
                placeholder="I love shopping for essentials and supporting small brands."
                className="min-h-30"
                {...register("bio")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-address">Street address</Label>
                <Input
                  id="customer-address"
                  placeholder="123 Willow Lane"
                  {...register("address")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-city">City</Label>
                <Input
                  id="customer-city"
                  placeholder="San Francisco"
                  {...register("city")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 p-6">
          <CardHeader className="flex flex-col gap-2 p-0">
            <CardTitle className="text-xl">Profile photo</CardTitle>
            <CardDescription>Upload a photo to personalize your account.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-4">
              <div className="text-sm text-muted-foreground">
                Add a profile image so sellers can recognize you better and manage your account easily.
              </div>

              <div className="rounded-3xl border border-dashed border-slate-200 p-4 text-center">
                <Avatar className="mx-auto mb-4 h-24 w-24">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt={avatarLabel} />
                  ) : (
                    <AvatarFallback>{avatarLabel.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <label className="block cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Choose photo
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
              Save changes
            </Button>
            {saved && <span className="text-sm text-green-600">Profile saved.</span>}
          </div>
        </Card>
      </form>
    </div>
  );
}
