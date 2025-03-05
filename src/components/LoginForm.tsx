"use client";

import { FaLock, FaUserAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const storedUsername = process.env.NEXT_PUBLIC_MAIL_USERNAME;
    const storedPassword = process.env.NEXT_PUBLIC_MAIL_PASSWORD;

    console.log("Env Username:", storedUsername);
    console.log("Env Password:", storedPassword);

    if (username === storedUsername && password === storedPassword) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/inbox");
    } else {
      setError("Invalid username or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex items-center justify-center relative overflow-hidden">
      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative h-[550px] w-[360px] bg-white-90 rounded-lg p-6 shadow-[0_0_10px_rgba(255,255,255,0.5)] shadow-white/30 overflow-hidden">
          <form className="z-10 relative h-full top-16" onSubmit={handleSubmit}>
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
                required
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-gray-500 p-2.5 pl-10 font-bold w-[75%] transition-all bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 hover:border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="uppercase bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm mt-[30px] py-4 px-5 rounded-full border border-gray-600 font-bold flex items-center justify-center w-full shadow-lg cursor-pointer transition-all duration-300 hover:from-gray-700 hover:to-gray-800 hover:border-gray-500 active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
