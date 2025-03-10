import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { register } from "../../auth";
import Button from "../../components/Button";
import Input from "../../components/Input";
import InputLabel from "../../components/InputLabel";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "") return;

    await register(email, password);
  };

  return (
    <>
      <form onSubmit={handleRegister} className="mt-7">
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
          <InputLabel htmlFor="name-input" text="Name" />
          <Input
            name="name-input"
            type="text"
            placeholder="Enter your name..."
            // onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <InputLabel htmlFor="username-input" text="Username" />
          <Input
            name="username-input"
            type="text"
            placeholder="Enter a unique username..."
            // onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <InputLabel htmlFor="password-input" text="Password" />
          <Input
            name="password-input"
            type="password"
            placeholder="Enter a password..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="mt-5">
          Create
        </Button>
      </form>
      <p className="text-center my-2">or</p>
      <div className="flex justify-center">
        <Link
          to="/"
          className="text-center underline hover:cursor-pointer cursor-default"
        >
          Log In
        </Link>
      </div>
    </>
  );
}
