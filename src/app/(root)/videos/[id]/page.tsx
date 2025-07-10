'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../../../axios/axios.config'
import { VideoType } from '../edit/[id]/page'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

export default function VideoDetailPage() {
    const { id } = useParams()
    const [video, setVideo] = useState<VideoType | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getVideoById = async () => {
            try {
                const response = await axiosInstance.get(`/learning/video/${id}`)
                setVideo(response.data.data)
            } catch (err) {
                console.error('Failed to fetch video:', err)
            } finally {
                setLoading(false)
            }
        }
        if (id) getVideoById()
    }, [id])

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="w-full aspect-video rounded-lg" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            ) : video ? (
                <div className="space-y-6">
                    <div className="w-full aspect-video rounded-lg overflow-hidden shadow">
                        <video
                            controls
                            src={video.video_url}
                            className="w-full h-full object-cover"
                            poster={video.thumbnail}
                        />
                    </div>

                    <h1 className="text-2xl font-bold">{video.title}</h1>

                    <div className="text-muted-foreground text-sm">
                        Category: <span className="capitalize">{video.category}</span>
                    </div>

                    <p className="text-base leading-relaxed">{video.description}</p>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        {video.uploader?.avatar ? (
                            <Image
                                src={video.uploader.avatar}
                                alt={video.uploader.username}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {video.uploader?.fullName?.[0]}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{video.uploader?.fullName}</p>
                            <p className="text-sm text-muted-foreground">@{video.uploader?.username}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-red-500">Video not found.</p>
            )}
        </div>
    )
}
