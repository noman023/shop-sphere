"use client";
import DataTable from "@/components/custom/global/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  X,
  Repeat,
  MoreVertical,
  PackageSearch,
  ShoppingBag,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import useTanstackQuery from "@/hooks/useAxiosInstance";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { commonButtonStyle } from "@/utils/commonButtonStyle";

const columnHelper = createColumnHelper<any>();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusStyles: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-orange-100 text-orange-700",
  Cancelled: "bg-red-100 text-red-600",
};

export default function MyOrders() {
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data } = useTanstackQuery("/orders");

  // Map API data to table format
  const allData =
    data?.orders?.map((order: any) => ({
      id: `ORD-${order._id.slice(-6)}`, // or just order._id
      date: order.createdAt,
      status: order.status,
      amount: order.total,
      orderObj: order,
    })) || [];

  // Filter by search, status tab, and dropdown
  const filteredData = allData.filter((item: any) => {
    const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase());
    const matchesDropdown =
      !orderStatus ||
      orderStatus === "all" ||
      item.status.toLowerCase() === orderStatus;
    return matchesSearch && matchesDropdown;
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "Order ID",
      cell: (info) => <span className="font-medium">#{info.getValue()}</span>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[info.getValue()] || "bg-gray-100 text-gray-700"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Total",
      cell: (info) => (
        <span className="font-medium">
          ${parseFloat(info.getValue()).toFixed(2)}
        </span>
      ),
      meta: { align: "right" },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const status = info.row.original.status;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="px-2 py-1 h-8 cursor-pointer"
              onClick={() => {
                setSelectedOrder(info.row.original);
                setViewModalOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>

            {status === "Delivered" && (
              <Button
                size="sm"
                variant="outline"
                className="px-3 cursor-pointer"
              >
                <Repeat className="w-4 h-4 mr-1" /> Buy Again
              </Button>
            )}
            {status === "Shipped" && (
              <Button
                size="sm"
                variant="outline"
                className="px-3 cursor-pointer"
              >
                <PackageSearch className="w-4 h-4 mr-1" /> Track
              </Button>
            )}
            {status === "Pending" && (
              <Button
                size="sm"
                variant="outline"
                className="px-3 cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            )}
            {status === "Cancelled" && (
              <Button
                size="sm"
                variant="outline"
                className="px-3 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 mr-1" /> Reorder
              </Button>
            )}
            <Button size="icon" variant="ghost" className="cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-gray-500">View and manage your order history.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 my-4 items-center">
        <Input
          placeholder="Search by order id"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
        />

        <div className="bg-white ">
          <Select value={orderStatus} onValueChange={setOrderStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable data={filteredData} columns={columns} />

      {/* View Order Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder ? formatDate(selectedOrder.date) : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                statusStyles[selectedOrder?.status] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {selectedOrder?.status}
            </span>
          </div>

          <div className="mb-3">
            <span className="text-gray-500 text-sm">Items:</span>
            <div className="mt-2 space-y-3">
              {selectedOrder?.orderObj?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product?.title || "Product"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.product?.title || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    $
                    {(
                      (item.product?.price || 0) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2 flex">
            <span className="w-28 text-gray-500">Delivery:</span>
            <span className="capitalize">
              {selectedOrder?.orderObj?.shippingMethod || "N/A"}
            </span>
          </div>
          <div className="mb-2 flex">
            <span className="w-28 text-gray-500">Payment:</span>
            <span className="uppercase">
              {selectedOrder?.orderObj?.paymentMethod || "N/A"}
            </span>
          </div>
          <div className="mb-2 flex">
            <span className="w-28 text-gray-500">Ship to:</span>
            <span className="text-sm">
              {[
                selectedOrder?.orderObj?.shippingAddress?.name,
                selectedOrder?.orderObj?.shippingAddress?.phone,
                selectedOrder?.orderObj?.shippingAddress?.address,
              ]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </span>
          </div>
          <div className="mb-4 flex">
            <span className="w-28 text-gray-500">Total:</span>
            <span className="font-medium">
              ${parseFloat(selectedOrder?.amount || 0).toFixed(2)}
            </span>
          </div>

          <DialogFooter className="flex justify-center gap-2">
            <Button              
              onClick={() => setViewModalOpen(false)}
              className={commonButtonStyle}              
            >
              <X className="w-4 h-4" /> Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
