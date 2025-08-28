import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";

export async function GET() {
    const clubs = await prisma.club.findMany({
        include: {
            host: true
        }
    })

    return NextResponse.json(clubs)
}