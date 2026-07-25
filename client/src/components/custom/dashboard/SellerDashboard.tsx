"use client";
import { Bar, BarChart } from "recharts";
import { useContext } from "react";

import { AuthContext } from "@/context/AuthContext";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTanstackQuery from "@/hooks/useAxiosInstance";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

function CountCard({
  text,
  count,
  description,
}: {
  text: string;
  count: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-xl">{text}</CardDescription>
        <CardTitle className="text-2xl">{count}</CardTitle>
      </CardHeader>

      <CardContent className="-mt-4">
        <p className="text-green-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full inline-block ${color}`} />
          <span className="font-medium text-base">{label}</span>
        </div>
        <CardTitle className="text-2xl mt-2">{count}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function SellerDashboard() {
  const { user } = useContext(AuthContext)!;

  const {data, isLoading} =useTanstackQuery("/dashboard/seller")
  const orderStatus = data?.orderStatus || {};
  
  if(isLoading) return "Loading user data";

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="">
          You've made <span className="font-bold">${data?.sales.today.amount}</span> today.
        </p>
      </div>

      {/* order count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        <CountCard
          text="Sales Today"
          count={data?.sales.today.amount}
          description={`+${data?.sales.today.changePct}% from last period`}
          />
        <CountCard
          text="Sales This Week"
          count={data?.sales.thisWeek.amount}
          description={`+${data?.sales.thisWeek.changePct}% from last period`}          
        />
        <CountCard
          text="Sales This Month"          
          count={data?.sales.thisMonth.amount}
          description={`+${data?.sales.thisMonth.changePct}% from last period`}          
        />
      </div>

      {/* order status cards */}
      <div className="p-3 bg-white rounded-xl border mt-8">
        <h1 className="text-xl font-bold">Orders Status</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
          <StatusCard label="Pending" count={orderStatus.Pending} color="bg-orange-400" />
          <StatusCard label="Shipped" count={orderStatus.Shipped} color="bg-blue-500" />
          <StatusCard label="Delivered" count={orderStatus.Delivered} color="bg-green-500" />
          <StatusCard label="Cancelled" count={orderStatus.Cancelled} color="bg-red-400" />
        </div>
      </div>

      {/* revenue graph */}
      <div className="p-3 bg-white rounded-xl border mt-8">
        <h1 className="text-xl font-bold">Revenue Trend (30 days)</h1>

        <ChartContainer config={chartConfig} className="min-h-50 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
