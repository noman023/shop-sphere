"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { AlertCircle, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { commonButtonStyle } from "@/utils/commonButtonStyle";
import Link from "next/link";
import { toast } from "react-toastify";
import { axiosInstance } from "@/hooks/useAxiosInstance";
import { useRouter } from "next/navigation";

type AddressForm = {
  name: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type CheckoutForm = {
  shippingMethod: string;
  paymentMethod: string;
  promo: string;
} & AddressForm;

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      shippingMethod: "home",
      paymentMethod: "cod",
      promo: "",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    setCartItems(items);
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  // Handle form submit
  const onSubmit = async (data: CheckoutForm) => {
    try {
      // Prepare order payload
      const orderItems = cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const payload = {
        ...data,
        items: orderItems,
        total,
      };

      await axiosInstance.post("orders/create", payload);
      toast.success("Order placed successfully!");
      localStorage.removeItem("checkoutItems");

      setCartItems([]);
      router.push("/my-orders");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Order failed");
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-bold mb-2">CHECKOUT</h1>
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href={"/cart"}>
          <span className="font-semibold text-blue-500">Cart</span>
        </Link>
        <span className="text-gray-400">{">"}</span>
        <span className="font-semibold text-blue-500">Checkout</span>
        <span className="text-gray-400">{">"}</span>
        <span className="text-gray-400">Order Complete</span>
      </div>

      {/* Shipping Information */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Shipping Information</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <RadioGroup
            value={watch("shippingMethod")}
            className="flex flex-row gap-4"
            onValueChange={(val) => setValue("shippingMethod", val)}
          >
            <label
              className={`flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer`}
            >
              <RadioGroupItem value="home" />
              <span>Home Delivery</span>
            </label>
            <label
              className={`flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer`}
            >
              <RadioGroupItem value="store" />
              <span>Store Pickup</span>
            </label>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Full Name"
              {...register("name", {
                validate: (value) =>
                  value.trim() !== "" || "Name is required",
              })}
              className="mb-2"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mb-2">{errors.name.message}</p>
            )}
            <label className="block text-sm font-medium mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Phone Number"
              {...register("phone", {
                validate: (value) =>
                  value.trim() !== "" || "Phone is required",
              })}
              className="mb-2"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mb-2">
                {errors.phone.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Street address"
              {...register("address", {
                validate: (value) =>
                  value.trim() !== "" || "Address is required",
              })}
              className="mb-2"
              rows={2}
              aria-invalid={!!errors.address}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mb-2">
                {errors.address.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input placeholder="City" {...register("city")} className="mb-2" />
            <label className="block text-sm font-medium mb-1">State</label>
            <Input
              placeholder="State"
              {...register("state")}
              className="mb-2"
            />
            <label className="block text-sm font-medium mb-1">
              Zip/Postal Code
            </label>
            <Input
              placeholder="Zip/Postal Code"
              {...register("zip")}
              className="mb-2"
            />
            <label className="block text-sm font-medium mb-1">Country</label>
            <Input
              placeholder="Country"
              {...register("country")}
              className="mb-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Checkbox id="save-address" />
          <label htmlFor="save-address" className="text-sm text-gray-600">
            Save this address for future orders
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Payment Method</h2>
        <div className="flex flex-col gap-2 mb-4">
          <RadioGroup
            value={watch("paymentMethod")}
            className="flex flex-row gap-4"
            onValueChange={(val) => setValue("paymentMethod", val)}
          >
            <label className="flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer">
              <RadioGroupItem value="cod" />
              <span>Cash on Delivery</span>
            </label>

            <label className="flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer">
              <RadioGroupItem value="card" />
              <span>Credit/Debit Card</span>
            </label>
          </RadioGroup>
        </div>

        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-md px-4 py-2 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            For security, we do not store your card details. All payments are
            processed securely.
          </span>
        </div>
        {/* Optionally show card fields if paymentMethod === "card" */}
      </div>

      {/* Promo code */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder="Promo code"
          {...register("promo")}
          className="w-60"
        />
        <Button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          Apply
        </Button>
      </div>

      {/* Order Summary */}
      <div className="bg-white border rounded-lg p-6 mb-5">
        <h2 className="font-semibold mb-4">Order Summary</h2>

        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center py-3">
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">{item.variant}</div>
              </div>

              <div className="w-16 text-right font-medium">
                ${item.price.toFixed(2)}
              </div>

              <div className="w-12 text-center text-gray-500">
                x{item.quantity}
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-red-500 ml-2"
                aria-label="Remove"
                type="button"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-end">
          <Button className={commonButtonStyle} type="submit">
            Place Order
          </Button>
        </div>
      </div>
    </form>
  );
}
