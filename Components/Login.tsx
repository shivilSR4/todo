"use client";

import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
          className="w-full flex items-center justify-center gap-2 bg-white-500 hover:bg-white-700 text-black font-semibold py-2 px-4 rounded-lg"
        >
          <Image 
            src="/google-logo.png"  
            alt="Google Logo" 
            width={24} 
            height={24} 
            priority
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
