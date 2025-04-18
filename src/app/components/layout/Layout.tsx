"use client";

// External Imports
import React from "react";

const Layout = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className="relative min-h-screen bg-(--color-bg) flex flex-col">
            <main className="relative flex-1 w-full overflow-hidden">
                <div className={`${className} relative flex justify-center z-10 mt-24 mb-24`}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
