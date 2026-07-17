"use client";

import { ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState } from "react";
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

export default function SellerProfile() {
  const { user, setUser } = useContext(AuthContext)!;

  const [storeName, setStoreName] = useState(user?.storeName || "");
  const [ownerName, setOwnerName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState(user?.country || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photoPreview, setPhotoPreview] = useState(user?.image || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timeout = window.setTimeout(() => setSaved(false), 2500);
      return () => window.clearTimeout(timeout);
    }
  }, [saved]);

  const headline = useMemo(
    () => storeName || "Your store name",
    [storeName]
  );

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser({
      ...user,
      storeName: storeName.trim(),
      name: ownerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      bio: bio.trim(),
      image: photoPreview,
    });
    setSaved(true);
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

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
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
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                  placeholder="Nimbus Studio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner-name">Owner name</Label>
                <Input
                  id="owner-name"
                  value={ownerName}
                  onChange={(event) => setOwnerName(event.target.value)}
                  placeholder="Alex Carter"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seller-email">Business email</Label>
                <Input
                  id="seller-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="store@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-phone">Contact phone</Label>
                <Input
                  id="seller-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-bio">Store description</Label>
              <Textarea
                id="seller-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Share what makes your store special and what customers can expect."
                className="min-h-35"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seller-country">Country / region</Label>
              <Input
                id="seller-country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="United States"
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
            {saved && <span className="text-sm text-green-600">Profile saved.</span>}
          </div>
        </Card>
      </form>
    </div>
  );
}

