import { useState } from "react";
import { signUp } from "../auth";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUp(email, password);
  };


  return (
    <form onSubmit={handleSignUp}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  );
};


export default SignUp;


