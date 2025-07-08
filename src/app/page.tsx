'use client';
import { ModeToggle } from "@/components/toggle-button";
import { Button } from "@/components/ui/button";
import axiosInstance from "../../axios/axios.config";
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
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Button variant={"outline"}>Test</Button>
        <ModeToggle />
        <Button className="mt-4" variant="outline" onClick={handleGetAllVideos}>Get All Videos </Button>
        <p>{JSON.stringify(videos, null, 2)}</p>
      </div>
    </main>
  );
}
