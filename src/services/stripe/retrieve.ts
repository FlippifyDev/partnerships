"use server";

import Stripe from 'stripe';

const retrieveStripeCustomer = async (customerId: string | null, email: string, referralCode: string | null) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        let customer;

        if (customerId) {
            customer = await stripe.customers.retrieve(customerId);

            // Ensure the customer exists before trying to use it
            if (customer && !customer.deleted) {
                return customer.id;
            }
        }

        // If customerId was not provided or customer was not found, check by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customers.data.length > 0) {
            customer = customers.data[0];
            return customer.id;
        } else {
            // Create a new customer since one doesn't exist with the provided email
            customer = await stripe.customers.create({
                email: email,
                metadata: {
                    referralCode: referralCode
                }
            });
            return customer.id;
        }
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};

const retrieveStripeCouponDetails = async ({ code }: { code: string }) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error("Stripe API key not found");
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const promotionCodes = await stripe.promotionCodes.list({
            limit: 100,
        });

        const promotionCode = promotionCodes.data.find(
            (promo) => promo.code === code
        );

        if (!promotionCode || typeof promotionCode.coupon !== "object") {
            throw new Error("Promotion code not found or associated coupon is invalid.");
        }

        return promotionCode;
    } catch (error) {
        console.error("Error retrieving coupon details:", error);
        throw new Error("Failed to retrieve coupon details.");
    }

};

export { retrieveStripeCustomer, retrieveStripeCouponDetails };