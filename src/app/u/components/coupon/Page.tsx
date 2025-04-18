"use client";

import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { retrieveStripeCouponDetails } from '@/services/stripe/retrieve';
import { COUPON_STORAGE_KEY } from '@/utils/cache-keys';
import { formatDate } from '@/utils/format';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

import Stripe from 'stripe';

const Page = () => {
    const { data: session } = useSession()

    const [couponData, setCouponData] = useState<Stripe.PromotionCode | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        setCouponData(null);

        if (!session) return;

        // Check if the coupon data exists in session storage and is not expired
        const storedData = sessionStorage.getItem(COUPON_STORAGE_KEY);
        const storedDataParsed = storedData ? JSON.parse(storedData) : null;

        const currentTimestamp = new Date().getTime();
        const expiresAt = storedDataParsed ? storedDataParsed.timestamp : 0;

        // If the data is in session and not expired, use it
        if (storedDataParsed && currentTimestamp < expiresAt) {
            setCouponData(storedDataParsed.data);
            setLoading(false);
            return;
        }

        try {
            async function fetchCouponDetails() {
                setLoading(true);
                const stripePromotionCode = await retrieveStripeCouponDetails({
                    code: session?.user.code as string,
                });

                // Set new coupon data in session storage with timestamp (2 minutes from now)
                const expirationTime = currentTimestamp + 2 * 60 * 1000; // 2 minutes from now

                sessionStorage.setItem(
                    COUPON_STORAGE_KEY,
                    JSON.stringify({ data: stripePromotionCode, timestamp: expirationTime })
                );

                setCouponData(stripePromotionCode);
                setLoading(false);
            }

            fetchCouponDetails();
        } catch (err: unknown) {
            setError(err as string);
        } finally {
            setLoading(false);
        }
    }, [session]);


    if (loading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center'>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 lg:px-6">
            {/* Promo Code */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Promotional Code</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.code}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Used by customers to redeem this offer</div>
                    <div className="text-muted-foreground">Share this with eligible users</div>
                </CardFooter>
            </Card>

            {/* Status */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Status</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.active ? "Active" : "Inactive"}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Is this promotional code currently usable?</div>
                    <div className="text-muted-foreground">Inactive if expired or disabled</div>
                </CardFooter>
            </Card>

            {/* Coupon ID */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Coupon ID</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.coupon.id}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Underlying coupon identifier</div>
                    <div className="text-muted-foreground">Reference used within Stripe</div>
                </CardFooter>
            </Card>

            {/* Percent Off */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Percent Off</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.coupon.percent_off ?? "—"}%
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Applies a percentage discount</div>
                    <div className="text-muted-foreground">May not be combined with fixed discounts</div>
                </CardFooter>
            </Card>

            {/* Amount Off */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Amount Off</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.coupon.amount_off ? `$${couponData.coupon.amount_off / 100}` : "N/A"}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Applies a fixed discount</div>
                    <div className="text-muted-foreground">Displayed in your billing currency</div>
                </CardFooter>
            </Card>

            {/* Duration */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Duration</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums capitalize">
                        {couponData?.coupon.duration}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Discount applies over time</div>
                    <div className="text-muted-foreground">
                        {couponData?.coupon.duration === "repeating" && couponData?.coupon.duration_in_months
                            ? `Repeats for ${couponData.coupon.duration_in_months} months`
                            : couponData?.coupon.duration === "once"
                                ? "Applies only on the first invoice"
                                : "Applies for the entire subscription"}
                    </div>
                </CardFooter>
            </Card>

            {/* Times Redeemed */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Times Redeemed</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.coupon.times_redeemed ?? 0}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Number of times used</div>
                    <div className="text-muted-foreground">Tracks redemptions across customers</div>
                </CardFooter>
            </Card>

            {/* Max Redempsions */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Maximum Redemptions</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.coupon.max_redemptions ?? 0}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">How many times this coupon can be used</div>
                    <div className="text-muted-foreground">Limits total redemptions across all customers</div>
                </CardFooter>
            </Card>

            {/* Name */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Coupon Name</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.coupon.name ?? "N/A"}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">Label for internal or customer reference</div>
                    <div className="text-muted-foreground">Not required—can be used to describe the offer</div>
                </CardFooter>
            </Card>

            {/* For First Time Customers Only */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>First-Time Use Only</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.restrictions.first_time_transaction ? "Yes" : "No"}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">
                        {couponData?.restrictions.first_time_transaction
                            ? "Can only be used by first-time customers."
                            : "Not limited to new users"}
                    </div>
                    <div className="text-muted-foreground">
                        {couponData?.restrictions.first_time_transaction
                            ? "Existing customers cannot redeem this coupon."
                            : "Existing customers can redeem this coupon."}
                    </div>
                </CardFooter>
            </Card>

            {/* Expires In */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Expires In</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.expires_at
                            ? new Date(couponData.expires_at * 1000).toLocaleDateString()
                            : "No Expiration"}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">When does this coupon expire?</div>
                    <div className="text-muted-foreground">
                        {couponData?.expires_at
                            ? `Expires on ${new Date(couponData.expires_at * 1000).toLocaleDateString()}`
                            : "This coupon has no expiration date."}
                    </div>
                </CardFooter>
            </Card>

            {/* Created Date */}
            <Card className="@container/card">
                <CardHeader className="relative">
                    <CardDescription>Created</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {couponData?.created ? formatDate(couponData.created * 1000) : "—"}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="font-medium">When this code was generated</div>
                    <div className="text-muted-foreground">Based on Stripe creation timestamp</div>
                </CardFooter>
            </Card>

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    )
}

export default Page
