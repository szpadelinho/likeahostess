import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const buffet = await prisma.buffet.findMany()
        return NextResponse.json(buffet)
    } catch (err) {
        console.error("Buffet Route.ts", err)
        return NextResponse.json({error: "Cannot fetch buffet"}, {status: 500})
    }
}