"use client";

import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "../Components/ui/button"; 

export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.email) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-96 bg-gray-100 shadow-lg rounded-lg p-16 m-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Button
          onClick={login}
          className="w-full flex items-center justify-center gap-2 bg-grey-500 hover:bg-grey-700 text-black font-semibold py-2 px-4 rounded-lg"
        >
          <img src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-1024.png" alt="Google Logo" className="w-5 h-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
