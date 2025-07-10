'use client'

import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../../axios/axios.config'
import Image from 'next/image'
import { Edit, EllipsisVertical, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import Link from 'next/link'

export default function Page() {
    const [videos, setVideos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const router = useRouter()
    const pageSize = 5

    const getAllVideos = async (currentPage: number) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/learning/user_videos/${currentPage}/${pageSize}`)
            setVideos(response.data.data.docs || [])
            setTotalPages(response.data.data.totalPages || 1)
        } catch (error) {
            console.error("Error fetching videos", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedVideoId) return
        try {
            await axiosInstance.delete(`/learning/learning_video/${selectedVideoId}`)
            toast.success("Video deleted successfully")
            setSelectedVideoId(null)
            setDialogOpen(false)
            getAllVideos(page)
        } catch (err) {
            console.error("Delete failed", err)
            toast.error("Failed to delete video")
        }
    }

    useEffect(() => {
        getAllVideos(page)
    }, [page])

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return
        setPage(newPage)
    }

    return (
        <div className="w-full p-4">
            <h1 className="text-md lg:text-2xl font-bold">Your All Learning Videos</h1>
            <p className="text-sm text-muted-foreground">Here you can find all the videos you have uploaded.</p>

            <div className="mt-4">
                {loading ? (
                    <div className="flex gap-4">
                        <Skeleton className="lg:h-44 lg:w-[400px] h-24 w-1/2" />
                        <div className="flex flex-col gap-4 justify-center">
                            <Skeleton className="lg:h-20 lg:w-[400px] h-10 w-30" />
                            <Skeleton className="lg:h-20 lg:w-[400px] h-10 w-30" />
                        </div>
                    </div>
                ) : videos.length > 0 ? (
                    <>
                        {videos.map((video: any, index: number) => (
                            <div key={index} className="flex justify-between border p-4 rounded-lg mt-4">
                                <Link href={`/videos/${video._id}`} className="flex">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">{(page - 1) * pageSize + index + 1}</span>
                                        <Image
                                            src={video.thumbnail || '/placeholder.png'}
                                            alt={video.title || 'No title'}
                                            width={400}
                                            height={250}
                                            className="rounded-2xl w-40 h-24 lg:w-[400px] lg:h-[250px] object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col ml-4">
                                        <p className="font-medium">{video.title || 'Untitled'}</p>
                                        <p className="text-sm text-muted-foreground text-wrap">{video.description || 'No description provided.'}</p>
                                    </div>
                                </Link>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedVideoId(video._id)
                                                setDialogOpen(true)
                                            }}>
                                                <Trash className="mr-2" color="red" /> Delete
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push(`/videos/edit/${video._id}`)}>
                                                <Edit className="mr-2" /> Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <Pagination className="mt-6">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(page - 1)}
                                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, idx) => (
                                    <PaginationItem key={idx}>
                                        <PaginationLink
                                            isActive={page === idx + 1}
                                            onClick={() => handlePageChange(idx + 1)}
                                        >
                                            {idx + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(page + 1)}
                                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </>
                ) : (
                    <p className="text-muted-foreground mt-4">No videos found.</p>
                )}
            </div>

            {/* Global Delete Confirmation Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>This action will permanently delete the video.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
