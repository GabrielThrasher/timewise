import { useEffect, useState } from "react";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useQueryErrorResetBoundary,
  useQueryClient,
} from "@tanstack/react-query";
import FourYearPlansList from "../../components/overview/FourYearPlansList";
import ClassSchedulesList from "../../components/overview/ClassSchedulesList";
import Calendar from "../../components/overview/Calendar";
import { overviewInfoQueryOptions } from "../../queryOptions";
import TimewiseModal from "../../components/Modal";
import FourYearPlanDetails from "../../components/FourYearPlanDetails";
import ScheduleDetails from "../../components/ScheduleDetails";
import FriendsList from "../../components/overview/FriendsList";
import { dataClient } from "../../dataClient";
import { logOut } from "../../auth";

export const Route = createFileRoute("/_protected/overview")({
  loader: async ({ context }) => {
    const user = await context.auth.authPromise.current!.promise;

    if (user) {
      context.queryClient.ensureQueryData(overviewInfoQueryOptions);
    }
  },
  component: RouteComponent,
  pendingComponent: () => <p>Loading...</p>,
  errorComponent: OverviewError,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <OverviewHeader />
      <OverviewItemsContainer />
    </div>
  );
}

function OverviewHeader() {
  const [user, setUser] = useState<any>(null);
  // const university = useSuspenseQuery({
  //   ...overviewInfoQueryOptions,
  //   select: (data) => data.university,
  // });
  // const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserInfo() {
      const user: any = await dataClient.getUserInfo();
      setUser(user[0]);
    }

    fetchUserInfo();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex items-start justify-between">
      <div className="overview-header-left">
        <div className="flex items-center rounded-md">
          {/* <img
            className="block w-8 h-8 rounded-md border-primary border-1"
            src="./profile.jpeg"
            alt="Rounded avatar"
          /> */}

          <p className="text-xl">{user.name}</p>
          <button
            className="text-sm ml-5 mt-1 text-gray-500 cursor-pointer hover:bg-gray-100 p-1"
            onClick={async () => {
              await logOut();
              // navigate({ to: "/" });
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
        <div className="mt-3">
          <p className="text-gray-500">
            Major: {user.major}
            <span className="px-3">|</span>
            Year: {user.year}
          </p>
        </div>
      </div>
      <div className="overview-header-right">
        {/* <p>{university.data}</p> */}
        <p>Timewise ⏰</p>
        <p className="text-right opacity-55">Spring 2025</p>
      </div>
    </div>
  );
}

function OverviewItemsContainer() {
  const [planSelected, setPlanSelected] = useState<string | null>(null); // the id of the selected plan
  const [scheduleSelected, setScheduleSelected] = useState<string | null>(null);
  // i don't know if this is good practice or not
  const { data } = useSuspenseQuery({
    ...overviewInfoQueryOptions,
    select: (data) => ({
      plans: data.plans,
      schedules: data.schedules,
    }),
  });
  const queryClient = useQueryClient();

  return (
    <div className="flex mt-6 justify-between gap-5 w-full">
      <OverviewItem>
        <FourYearPlansList
          data={data.plans}
          selectItem={(id) => setPlanSelected(id)}
        />
      </OverviewItem>
      <OverviewItem>
        <ClassSchedulesList
          data={data.schedules}
          selectItem={(id) => setScheduleSelected(id)}
        />
      </OverviewItem>
      <div className="w-full">
        <div className="w-full border-1 border-gray-200 rounded-md overflow-hidden">
          <Calendar />
        </div>
        <div className="mt-3 border-1 border-gray-200 rounded-md overflow-hidden">
          <div className="flex flex-col justify-center">
            <div className="p-1">
              <p className="text-base font-semibold text-gray-500 bg-indigo-50 p-2 rounded-md">
                Friends
              </p>
            </div>
            <div>
              <FriendsList />
            </div>
          </div>
        </div>
      </div>

      <TimewiseModal
        isOpen={!!planSelected || !!scheduleSelected}
        onRequestClose={() => {
          setPlanSelected(null);
          setScheduleSelected(null);
          queryClient.invalidateQueries();
        }}
      >
        {!!planSelected && <FourYearPlanDetails id={planSelected} />}
        {!!scheduleSelected && (
          <ScheduleDetails
            id={scheduleSelected}
            name={data.schedules.find((i) => i.id === scheduleSelected)?.name}
          />
        )}
      </TimewiseModal>
    </div>
  );
}

type OverviewItemProps = {
  children?: React.ReactNode;
};

function OverviewItem({ children }: OverviewItemProps) {
  return (
    <div className="w-full h-full border-1 border-gray-200 rounded-md overflow-hidden">
      {children}
    </div>
  );
}

function OverviewError({ error }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    // Reset the query error boundary
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div>
      {error.message}
      <button
        onClick={() => {
          // Invalidate the route to reload the loader, and reset any router error boundaries
          router.invalidate();
        }}
      >
        retry
      </button>
    </div>
  );
}
