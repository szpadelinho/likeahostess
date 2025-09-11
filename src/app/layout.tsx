import "./globals.css";
import {BlockRightClick} from "@/components/blockRightClick";


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <BlockRightClick/>
        {children}
        </body>
        </html>
    );
}