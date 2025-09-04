import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const hostesses = await prisma.hostess.findMany()
        return NextResponse.json(hostesses)
    } catch (err) {
        console.error("Hostess Route.ts", err)
        return NextResponse.json({error: "Cannot fetch hostesses"}, {status: 500})
    }
}