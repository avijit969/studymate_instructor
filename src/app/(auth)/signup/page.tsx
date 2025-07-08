'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import axiosInstance from '../../../../axios/axios.config'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
type SignupForm = {
    email: string;
    username: string;
    fullName: string;
    password: string;
}
export default function page() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isLoading },
    } = useForm<SignupForm>()
    const onSubmit: SubmitHandler<SignupForm> = async (data) => {
        console.log(data)

        try {
            const response = await axiosInstance.post('/users/registerUser', data)
            console.log(response)
            console.log(JSON.stringify(response.data, null, 2))
            toast.success("Signup successful! Please check your email for verification.")
            router.push('/login')
        } catch (error: any) {
            console.error("Error during signup:", error?.response?.data?.message);
            toast.error(error?.response?.data?.message || "An error occurred during signup");
        }

    }

    return (
        <main className="flex items-center justify-center p-2 lg:min-h-screen">
            <section className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full lg:w-1/2">
                <h1 className="text-xl lg:text-2xl font-bold">Signup As StudyMate Instructor</h1>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-4 rounded-lg">
                    <Image src="auth.svg" alt="logo" width={400} height={400} />

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-[300px]">
                        <Input placeholder="Email" {...register("email", { required: true })} />
                        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
                        <Input placeholder="Username" {...register("username", { required: true })} />
                        {errors.username && <p className="text-red-500 text-sm">Username is required</p>}
                        <Input placeholder="Full Name" {...register("fullName", { required: true })} />
                        {errors.fullName && <p className="text-red-500 text-sm">Full Name is required</p>}
                        <Input placeholder="Password" {...register("password", { required: true })} />
                        {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
                        <Button className="mt-4" variant="outline" type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Sign Up"}
                        </Button>

                        <p className="text-sm text-gray-500 mt-2">
                            Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
                        </p>

                    </form>

                </div>


            </section>
        </main>
    )
}
