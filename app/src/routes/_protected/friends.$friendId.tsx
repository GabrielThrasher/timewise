import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { dataClient } from "../../dataClient";
import FourYearPlanDetails from "../../components/FourYearPlanDetails";
import ScheduleDetails from "../../components/ScheduleDetails";

export const Route = createFileRoute("/_protected/friends/$friendId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { friendId } = Route.useParams();
  const [friendInfo, setFriendInfo] = useState<any>(null);

  useEffect(() => {
    async function getInfo() {
      if (!friendId) return;

      const data = await dataClient.getFriendInfo(friendId);
      console.log(data);

      setFriendInfo(data);
    }

    getInfo();
  }, [friendId]);

  if (!friendInfo) return <p>Loading...</p>;

  return (
    <div className="w-full overflow-auto">
      <p className="text-2xl py-5">{friendInfo.user[0].name}</p>
      {!friendInfo.schedule ? (
        <p>No schedules found.</p>
      ) : (
        <>
          <p className="text-lg p-2 bg-indigo-50 rounded-md mb-2">
            Class Schedule
          </p>
          <div className="w-full h-[500px] overflow-y-scroll border-1 border-gray-200 rounded-md  mb-10">
            <ScheduleDetails id={friendInfo.schedule.id} minimal />
          </div>
        </>
      )}

      {!friendInfo.plan ? (
        <p>No plan found.</p>
      ) : (
        <>
          <p className="text-xl p-2 bg-indigo-50 rounded-md mb-2">
            Four Year Plan
          </p>
          <div className="w-full h-[500px] overflow-y-scroll border-1 border-gray-200 rounded-md mb-20">
            <FourYearPlanDetails id={friendInfo.plan.id} minimal />
          </div>
        </>
      )}
    </div>
  );
}
