import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "sonner";

import KBar from "~/app/mail/components/kbar";

export const metadata: Metadata = {
  title: "Mind Mail",
  description: "AI Driven Email Client",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider>
            <html lang="en" className={`${GeistSans.variable}`}>
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
