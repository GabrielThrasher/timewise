import {
  createFileRoute,
  redirect,
  Outlet,
  Link,
} from "@tanstack/react-router";
import Input from "../../components/Input";
import FriendsList from "../../components/overview/FriendsList";
import { FileRoutesByFullPath } from "../../routeTree.gen";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    const user = await context.auth.authPromise.current!.promise;

    if (!user) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center overflow-y-auto h-full">
      {/* <LeftMenu /> */}
      {/* <TopMenu /> */}

      <main className="px-10 mx-auto mt-10 min-w-[1100px]">
        <Outlet />
      </main>
    </div>
  );
}

function Profile() {
  return (
    <div className="profile mb-6 pl-4">
      <div className="flex items-center rounded-md">
        <img
          className="block w-8 h-8 rounded-full border-primary border-1"
          src="./profile.jpeg"
          alt="Rounded avatar"
        />

        <p className="ml-2">Hieu</p>
      </div>
    </div>
  );
}

function TopMenu() {
  return (
    <div className="top-menu flex items-center justify-between pr-10 pl-8">
      <div className="flex gap-8 justify-around">
        <TopMenuItem text="📚 Explore" />
        <TopMenuItem text="⚙️ Automate" />
        <TopMenuItem text="🤖 Timewise AI" />
      </div>

      <div className="block w-full max-w-96">
        <Input placeholder="Search..." className="h-full" icon="🔎" />
      </div>

      <div className="flex">
        <p>⏰ Timewise</p>
      </div>
    </div>
  );
}

type TopMenuItemProps = {
  text: string;
};

function TopMenuItem({ text }: TopMenuItemProps) {
  return (
    <p className="p-2 rounded-md cursor-pointer hover:bg-gray-100">{text}</p>
  );
}

function LeftMenu() {
  return (
    <div className="left-menu py-3 border-r-1 border-gray-200">
      <Profile />

      {/* <PagesMenu /> */}

      <div className="mt-6">
        <FriendsList />
      </div>
    </div>
  );
}

function PagesMenu() {
  return (
    <div className="flex flex-col">
      <p className="opacity-65 text-sm pl-4 pb-2 select-none">Pages</p>
      <div className="hover:cursor-pointer">
        <PagesMenuItem title="Overview" to="/overview" />
        {/* <PagesMenuItem title="Class schedules" to="/schedules" />
        <PagesMenuItem title="4-year plans" to="/plans" /> */}
      </div>
    </div>
  );
}

type PagesMenuItemProps = {
  title: string;
  to: keyof FileRoutesByFullPath;
};

function PagesMenuItem({ title, to }: PagesMenuItemProps) {
  return (
    <div>
      <Link
        className="w-full block pl-4 py-2 hover:bg-gray-100"
        to={to}
        activeProps={{ className: "bg-gray-100" }}
      >
        {title}
      </Link>
    </div>
  );
}
