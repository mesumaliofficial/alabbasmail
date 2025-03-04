"use client";

import { FaLock, FaUserAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
          router.push("/");
      }
  }, [router]);

  const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const storedUsername = process.env.MAIL_USERNAME;
      const storedPassword = process.env.MAIL_PASSWORD;

      console.log("Env Username:", storedUsername);
      console.log("Env Password:", storedPassword);

      if (username === storedUsername && password === storedPassword) {
          localStorage.setItem("isLoggedIn", "true");
          router.push("/inbox");
      } else {
          setError("Invalid username or password.");
      }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex items-center justify-center relative overflow-hidden">

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative h-[550px] w-[360px] bg-white-90 rounded-lg p-6 shadow-[0_0_10px_rgba(255,255,255,0.5)] shadow-white/30 overflow-hidden">
          <form className="z-10 relative h-full top-16" onSubmit={handleLogin}>
          <h2 className="text-white text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-300 text-center">{error}</p>}
            <div className="py-5 relative">
              <FaUserAlt size={16} className="absolute top-10 left-2 text-[#7875B5]" />
              <input
                type="text"
                value={username}
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
                className="border-b-2 border-gray-500 p-2.5 pl-10 font-bold w-[75%] transition-all bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 hover:border-gray-300"
              />
            </div>
            <div className="py-5 relative">
              <FaLock size={16} className="absolute top-10 left-2 text-[#7875B5]" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-gray-500 p-2.5 pl-10 font-bold w-[75%] transition-all bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 hover:border-gray-300"
              />
            </div>
            <button
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm mt-[30px] py-4 px-5 rounded-full border border-gray-600 font-bold flex items-center justify-center w-full shadow-lg cursor-pointer transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:border-gray-500 active:scale-95"
            >
              SUBMIT
            </button>
          </form>
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0 z-0" style={{ clipPath: "inset(0 0 0 0)" }} >
          {/* Background Design Shapes */}
          <span className="absolute h-[400px] w-[200px] bg-gray-700 top-[420px] right-[50px] rounded-[60px] rotate-45"></span>
          <span className="absolute h-[540px] w-[190px] bg-gradient-to-r from-gray-600 to-gray-800 top-[-24px] right-[0px] rounded-[32px] rotate-45 opacity-65"></span>
          <span className="absolute h-[220px] w-[220px] bg-gray-800 top-[-172px] right-[0px] rounded-[32px] rotate-45"></span>
          <span className="absolute h-[520px] w-[520px] bg-gray-900 top-[-50px] right-[120px] rounded-tr-[72px] rotate-45"></span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
