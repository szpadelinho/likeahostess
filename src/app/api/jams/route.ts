import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const jams = await prisma.jam.findMany()
        return NextResponse.json(jams)
    } catch (err) {
        console.error("Jams Route.ts", err)
        return NextResponse.json({error: "Cannot fetch jams"}, {status: 500})
    }
}