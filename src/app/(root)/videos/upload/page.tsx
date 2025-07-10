'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axiosInstance from '../../../../../axios/axios.config'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

interface VideoForm {
    title: string
    description: string
    selectedCategory: string
    customCategory: string
    thumbnail: FileList
    video: FileList
}

const learningCategories = [
    { label: "Programming", value: "programming" },
    { label: "Design", value: "design" },
    { label: "Math", value: "math" },
    { label: "Science", value: "science" },
    { label: "Language", value: "language" },
    { label: "History", value: "history" },
    { label: "Geography", value: "geography" },
    { label: "Biology", value: "biology" },
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Economics", value: "economics" },
    { label: "Psychology", value: "psychology" },
    { label: "Business", value: "business" },
    { label: "Marketing", value: "marketing" },
    { label: "Photography", value: "photography" },
    { label: "Art", value: "art" },
    { label: "Music", value: "music" },
    { label: "Health", value: "health" },
    { label: "Fitness", value: "fitness" },
    { label: "Finance", value: "finance" }
];

export default function Page() {
    const router = useRouter()
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
    const [videoPreview, setVideoPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<VideoForm>()

    const onSubmit = async (data: VideoForm) => {
        if (!data.thumbnail?.[0] || !data.video?.[0]) {
            toast.error('Thumbnail and video are required.')
            return
        }

        const finalCategory = data.customCategory.trim() || data.selectedCategory

        if (!finalCategory) {
            toast.error('Please select or enter a category.')
            return
        }

        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('category', finalCategory)
        formData.append('thumbnail', data.thumbnail[0])
        formData.append('learning_video', data.video[0])

        try {
            setLoading(true)
            await axiosInstance.post('/learning/learning_video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            toast.success('Video uploaded successfully.')
            router.push('/')
        } catch (err) {
            console.error(err)
            toast.error('Failed to upload video.')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        reset()
        setThumbnailPreview(null)
        setVideoPreview(null)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Upload New Video</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input {...register('title', { required: true })} placeholder="Enter video title" />
                    {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        {...register('description', { required: true })}
                        placeholder="Enter video description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
                </div>

                <div className="space-y-2 w-full">
                    <Label htmlFor="selectedCategory">Category</Label>
                    <Controller
                        name="selectedCategory"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {learningCategories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <p className='text-sm text-muted-foreground'>Or type your own</p>
                    <Input {...register('customCategory')} placeholder="Enter custom category" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        {...register('thumbnail', { required: true })}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setThumbnailPreview(URL.createObjectURL(file))
                        }}
                    />
                    {thumbnailPreview && (
                        <div className="mt-2">
                            <Image
                                src={thumbnailPreview}
                                width={800}
                                height={450}
                                alt="Thumbnail Preview"
                                className="rounded-md w-full max-w-xl aspect-video object-cover"
                            />
                        </div>
                    )}
                    {errors.thumbnail && <p className="text-red-500 text-sm">Thumbnail is required</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="video">Video File</Label>
                    <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        {...register('video', { required: true })}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setVideoPreview(URL.createObjectURL(file))
                        }}
                    />
                    {videoPreview && (
                        <div className="mt-2">
                            <video
                                controls
                                className="w-full max-w-4xl rounded-md aspect-video shadow"
                                src={videoPreview}
                            />
                        </div>
                    )}
                    {errors.video && <p className="text-red-500 text-sm">Video is required</p>}
                </div>

                <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button variant="outline" type="button" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    )
}
