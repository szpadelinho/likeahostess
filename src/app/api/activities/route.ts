import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const activities = await prisma.activity.findMany()
        return NextResponse.json(activities)
    } catch (err) {
        console.error("Performers Route.ts", err)
        return NextResponse.json({error: "Cannot fetch activities"}, {status: 500})
    }
}