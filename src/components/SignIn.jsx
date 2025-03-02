import { useState } from "react";
import { signIn } from "../auth";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignIn = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };


  return (
    <form onSubmit={handleSignIn}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
};


export default SignIn;
