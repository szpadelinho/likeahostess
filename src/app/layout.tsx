import "./globals.css";
import {BlockRightClick} from "@/components/blockRightClick";
import {SessionProvider} from "next-auth/react";
import {VolumeProvider} from "@/app/context/volumeContext";


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <VolumeProvider>
                    <SessionProvider>
                        <BlockRightClick/>
                        {children}
                    </SessionProvider>
                </VolumeProvider>
            </body>
        </html>
    );
}