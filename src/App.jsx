import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import SignIn from "./components/SignIn.jsx";
import useAuth from "./hooks/useAuth.jsx";
import { logOut } from "./auth.jsx";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";


function App() {
  const [count, setCount] = useState(0);
  const user = useAuth(); // Check if user is logged in


  return (
    <Router>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>


      <h1>Vite + React + Firebase Auth</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>


      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {user ? (
          <>
            <h2>Welcome, {user.email}</h2>
            <button onClick={logOut}>Log Out</button>
            <p><Link to="/dashboard">Go to Dashboard</Link></p>
          </>
        ) : (
          <>
            <h2>You are not logged in</h2>
            <p><Link to="/signup">Sign Up</Link> | <Link to="/signin">Sign In</Link></p>
          </>
        )}
      </div>


      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
       
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}


const Home = ({ user }) => (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <h2>{user ? "You're logged in!" : "Please sign in or sign up"}</h2>
  </div>
);


const Dashboard = () => (
  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <h1>Dashboard</h1>
    <p>This is a protected page. Only logged-in users can access it.</p>
  </div>
);


export default App;
