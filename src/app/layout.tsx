import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "sonner";

import KBar from "~/app/mail/components/kbar";
import { Noto_Sans, PT_Serif } from "next/font/google";

export const metadata: Metadata = {
    title: "Mind Mail",
    description: "AI Driven Email Client",
    icons: [{ rel: "icon", url: "/images/logo.png" }],
};

const notoSans = Noto_Sans({
    subsets: ["latin"],
    variable: "--font-noto-sans",
    display: "swap",
})

const PTSerif = PT_Serif({
    subsets: ["latin"],
    variable: "--font-pt-serif",
    display: "swap",
    weight: ["400", "700"]
})

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider>
            <html lang="en" className={`${GeistSans.variable} ${notoSans.variable} ${PTSerif.variable}`}>
                <body>
                    <ThemeProvider attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange

                    >
                        <TRPCReactProvider>
                            <KBar>
                                {children}
                                <Toaster />
                            </KBar>
                        </TRPCReactProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
