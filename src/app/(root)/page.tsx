'use client';
import { Button } from "@/components/ui/button";
import axiosInstance from "../../../axios/axios.config";
import { useState } from "react";
export default function Home() {
  const [videos, setVideos] = useState([]);
  const handleGetAllVideos = async () => {
    try {
      const response = await axiosInstance.get("/learning/all_video/1/2");
      console.log(response.data);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Handle error appropriately, e.g., show a toast notification
    }
  }
  return (
    <main className='w-full'>
      <h1>Home</h1>
    </main>
  );
}
