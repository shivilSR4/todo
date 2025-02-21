"use client"; // Needed because we are using context and hooks

import { useAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";
import Login from "../Components/Login";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); 
    }
  }, [user, router]);

  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      
      <Login />
    </div>
  );
}
