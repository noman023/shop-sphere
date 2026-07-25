import { Card, CardHeader } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";
import useTanstackQuery from "@/hooks/useAxiosInstance";
import { Package, Heart, Truck, } from "lucide-react";
import { useContext } from "react";

type ActivitiType = {
  title: string,
  description:string,
  time:string,
}

function InfoCard({
  label,
  count,
  icon,
  iconBg,
}: {
  label: string;
  count: number | string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <Card>
      <div className="w-full flex items-center justify-between">
        <CardHeader className="w-full pb-2 flex flex-col items-center justify-between">
          <p className="text-sm text-gray-500">{label}</p>
          <span className="text-2xl font-bold">{count}</span>
        </CardHeader>

        <div className="w-full ">
          <span className={`inline-block rounded-full p-2 ${iconBg}`}>
            {icon}
          </span>
        </div>
      </div>
    </Card>
  );
}


export default function CustomerDashboard() {
  const { user } = useContext(AuthContext)!;
  const {data, isLoading} =useTanstackQuery("/dashboard/customer");

  if(isLoading) return "Loading user data..";

  return (
    <div>
      <h1 className="text-3xl font-bold">Hi, {user?.name} 👋</h1>

      <div className="w-full flex justify-end">
        <p className="">Last Updated: Today, 10:30 AM</p>
      </div>

      {/* info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        <InfoCard
          label="Total Orders"
          count={data?.totalOrders}
          icon={<Package className="w-6 h-6 text-blue-500" />}
          iconBg="bg-blue-100"
        />
        <InfoCard
          label="Wishlist Items"
          count={data?.wishlistCount}
          icon={<Heart className="w-6 h-6 text-pink-400" />}
          iconBg="bg-pink-100"
        />
        <InfoCard
          label="Pending Deliveries"
          count={data?.pendingDeliveries}
          icon={<Truck className="w-6 h-6 text-orange-400" />}
          iconBg="bg-orange-100"
        />        
      </div>

      {/* recent activities */}
      <div className="bg-white rounded-xl border py-6 px-3 shadow-sm mt-10">
        <h1 className="font-semibold text-lg mb-4">Recent Activity</h1>
        <ul>
          {data?.activities.map((activity:ActivitiType, idx:number) => (
            <li key={idx} className="flex items-start justify-between py-4">
              <div className="flex items-start gap-3">                

                <div>
                  <p className={`font-medium `}>{activity.title}</p>

                  <p className="text-gray-500 text-sm">
                    {activity.description}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-400 whitespace-nowrap mt-1">
                {activity.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
