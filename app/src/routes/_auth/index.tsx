import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { logIn } from "../../auth";
import Button from "../../components/Button";
import Input from "../../components/Input";
import InputLabel from "../../components/InputLabel";

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "") return;

    await logIn(email, password);
  };

  return (
    <>
      <form onSubmit={handleLogIn} className="mt-7">
        <div>
          <InputLabel htmlFor="email-input" text="Email" />
          <Input
            name="email-input"
            type="email"
            placeholder="Enter your email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <InputLabel htmlFor="email-input" text="Password" />
          <Input
            name="password-input"
            type="password"
            placeholder="Enter your password..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p className="text-right text-sm mt-2 cursor-default">
          <span className="hover:cursor-pointer hover:underline">
            Forgot password?
          </span>
        </p>
        <Button type="submit">Log In</Button>
      </form>
      <p className="text-center my-2">or</p>
      <div className="flex justify-center">
        <Link
          to="/register"
          className="text-center underline hover:cursor-pointer cursor-default"
        >
          Create an account
        </Link>
      </div>
      <div className="flex justify-center">
        <Link
          to="/home"
          className="text-center underline hover:cursor-pointer cursor-default"
        >
          Home
        </Link>
      </div>
    </>
  );
}
