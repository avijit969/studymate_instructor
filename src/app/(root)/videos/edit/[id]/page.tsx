'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "../../../../../../axios/axios.config"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

type Uploader = {
    _id: string
    username: string
    fullName: string
    avatar: string
}

export type VideoType = {
    _id: string
    video_url: string
    video_type: string
    title: string
    description: string
    thumbnail: string
    category: string
    uploader: Uploader
}

export default function Page() {
    const { id } = useParams()
    const [video, setVideo] = useState<VideoType | null>(null)
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
    })
    const [newThumbnail, setNewThumbnail] = useState<File | null>(null)
    const [newVideo, setNewVideo] = useState<File | null>(null)
    const router = useRouter()
    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await axiosInstance.get(`/learning/video/${id}`)
                const data = response.data.data
                setVideo(data)
                setForm({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                })
            } catch (error) {
                console.error("Error fetching video:", error)
            }
        }

        if (id) getVideo()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        try {
            const formData = new FormData()
            formData.append("title", form.title)
            formData.append("description", form.description)
            formData.append("category", form.category)
            if (newThumbnail) formData.append("thumbnail", newThumbnail)
            if (newVideo) formData.append("video", newVideo)

            const response = await axiosInstance.patch(`/learning/learning_video/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            setVideo(response.data.data)
            setNewThumbnail(null)
            setNewVideo(null)
            toast.success("Video updated successfully.")
        } catch (error) {
            console.error("Failed to update video:", error)
            toast.error("Failed to update video.")
        }
    }

    if (!video) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <Skeleton className="w-full h-[300px] mb-4 rounded-lg" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
                {/* Thumbnail Upload & Preview */}
                <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) setNewThumbnail(e.target.files[0])
                        }}
                    />
                    <div className="mt-3">
                        <Image
                            src={newThumbnail ? URL.createObjectURL(newThumbnail) : video.thumbnail}
                            width={800}
                            height={450}
                            alt="Thumbnail"
                            className="rounded-md w-full max-w-xl aspect-video object-cover"
                        />
                    </div>
                </div>

                {/* Video Upload & Preview */}
                <div className="space-y-2">
                    <Label htmlFor="video">Video File</Label>
                    <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) setNewVideo(e.target.files[0])
                        }}
                    />
                    <div className="mt-3">
                        <video
                            controls
                            className="rounded-md w-full max-w-4xl aspect-video shadow"
                            src={newVideo ? URL.createObjectURL(newVideo) : video.video_url}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter video title"
                    />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                    />
                </div>

                <div className="flex space-x-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
