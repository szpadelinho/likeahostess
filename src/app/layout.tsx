import "./globals.css";
import {BlockRightClick} from "@/components/blockRightClick";
import {SessionProvider} from "next-auth/react";


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <BlockRightClick/>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}