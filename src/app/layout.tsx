// Local Imports
import { ThemeProvider } from "@/components/theme-provider"

// External Imports
import { Inter } from "next/font/google";
import type { Metadata } from "next";

// Styles
import "@/styles/globals.css";
import Providers from "./providers";
import ServiceWorkerRegister from "./components/layout/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Partnerships",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${inter.className} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>
                        <ServiceWorkerRegister />
                        {children}
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
