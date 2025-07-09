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
    SelectItem
} from '@/components/ui/select'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axiosInstance from '../../../../../axios/axios.config'

export default function Page() {
    const router = useRouter()

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
    })

    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [video, setVideo] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!form.title || !form.description || !form.category || !thumbnail || !video) {
            alert('All fields are required.')
            return
        }

        try {
            setLoading(true)

            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('description', form.description)
            formData.append('category', form.category)
            formData.append('thumbnail', thumbnail)
            formData.append('learning_video', video)

            await axiosInstance.post('/learning/learning_video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            alert('Video uploaded successfully!')
            router.push('/')
        } catch (err) {
            console.error(err)
            alert('Upload failed.')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setForm({
            title: '',
            description: '',
            category: '',
        })
        setThumbnail(null)
        setVideo(null)
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Upload New Video</h1>

            <div className="space-y-4">
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
                        placeholder="Enter video description"
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={form.category}
                        onValueChange={(value) => setForm({ ...form, category: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="programming">Programming</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="math">Math</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="language">Language</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="thumbnail">Thumbnail</Label>
                    <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) setThumbnail(e.target.files[0])
                        }}
                    />
                    {thumbnail && (
                        <div className="mt-2">
                            <Image
                                src={URL.createObjectURL(thumbnail)}
                                width={800}
                                height={450}
                                alt="Thumbnail Preview"
                                className="rounded-md w-full max-w-xl aspect-video object-cover"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="video">Video File</Label>
                    <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) setVideo(e.target.files[0])
                        }}
                    />
                    {video && (
                        <div className="mt-2">
                            <video
                                controls
                                className="w-full max-w-4xl rounded-md aspect-video shadow"
                                src={URL.createObjectURL(video)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button variant="outline" type="button" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}
