"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { auth, firestore } from "@/lib/firebase/config";
import { signInWithEmailAndPassword as firebaseSignIn } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Lato } from 'next/font/google';
import Image from "next/image";
import { StatusType } from "@/models/config";
import UnderMaintenance from "../ui/UnderMaintenance";
import { retrieveStatus } from "@/services/api/request";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser } from "@/models/user";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });


const Page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<StatusType | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setLoading(true);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                setErrorMessage("Invalid email or password");
            } else {
                await firebaseSignIn(auth, email, password);
                const userRef = doc(firestore, "partners", auth.currentUser?.uid ?? "");
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data() as IUser;
                router.push(`/u/${userData.username}/coupon`);
            }
        } catch (e) {
            console.error("Login error:", e);
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email && password) {
            handleLogin();
        }
    };

    useEffect(() => {
        async function fetchStatus() {
            const webStatus = await retrieveStatus();
            if (webStatus) {
                setStatus(webStatus["status"])
            }
        }

        fetchStatus()
    }, [])

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 -mt-24 gap-16 text-white">
            {(status === "active" || status === null) && (
                <>
                    <div className="bg-(--color-bg) rounded-3xl shadow shadow-white w-full max-w-md p-8">
                        {/* Logo */}
                        <h2 className={`${lato.className} pb-1 text-[40px] flex justify-center font-bold mb-4`}>
                            flippify
                        </h2>

                        {/* Title & Subtitle */}
                        <h2 className="text-2xl font-semibold text-center mb-2">
                            Welcome back
                        </h2>
                        <p className="text-center text-gray-500 mb-6">
                            Please enter your details to sign in.
                        </p>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10"
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10"
                            />
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                            )}
                            <Button
                                type="submit"
                                disabled={loading || !status}
                                className="w-full"
                            >
                                {loading ? "Processing..." : status ? "Login" :
                                    <div className="w-full flex justify-center">
                                        <LoadingSpinner />
                                    </div>
                                }
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="flex flex-row gap-1 mt-5 justify-center">
                            <p>Don&apos;t have an account?</p>
                            <button
                                onClick={() => window.open("https://flippify.io/l/partnerships", "_blank", "noopener,noreferrer")}
                                className="text-(--color-houseBlue) hover:underline"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                    <div>
                        <Image
                            src="/auth/login.svg"
                            alt="Sign Up Image"
                            className="object-cover hidden lg:block"
                            width={700}
                            height={700}
                        />
                    </div>
                </>
            )}

            {status === "under maintenance" && (
                <UnderMaintenance />
            )}
        </div>
    )
}

export default Page
