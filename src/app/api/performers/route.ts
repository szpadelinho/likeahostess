import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const performers = await prisma.performer.findMany()
        return NextResponse.json(performers)
    } catch (err) {
        console.error("Performers Route.ts", err)
        return NextResponse.json({error: "Cannot fetch performers"}, {status: 500})
    }
}