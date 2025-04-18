import { Suspense } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Page from "./components/login/Page";
import Layout from "./components/layout/Layout";
import type { Metadata } from 'next';

const root = process.env.ROOT as string;

export const metadata: Metadata = {
    title: 'Partnerships Program - Flippify | Exclusive Discounts & AI-Powered Tools for eBay Resellers',
    description: 'Partner with Flippify to empower your reselling group with exclusive discounts, 40% revenue sharing, and collaborative opportunities. Automate eBay stores with AI-powered tools—open to all partners!',
    openGraph: {
        title: 'Partnerships Program - Flippify | Exclusive Discounts & AI-Powered Tools for eBay Resellers',
        description: 'Partner with Flippify to empower your reselling group with exclusive discounts, 40% revenue sharing, and collaborative opportunities. Automate eBay stores with AI-powered tools—open to all partners!',
        url: root,
        images: [
            {
                url: "[https://i.imgur.com/ANvOtZD.png",
                width: 2600,
                height: 1440,
                alt: "Login Flippify mobile app showing eBay inventory management, stock control, and automated order tracking for sellers"
            }
        ]
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};


export default function Home() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Layout>
                <Page />
            </Layout>
        </Suspense>
    );
}
