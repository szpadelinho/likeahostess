import { prisma } from "../../../../prisma/prisma"
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user?.id

    const currentClub = await prisma.userClub.findFirst({
        where: { userId },
        include: {
            club: {
                include: { host: true },
            },
        },
    });

    if (!currentClub) {
        return NextResponse.json({ error: "No club found" }, { status: 404 });
    }

    return NextResponse.json({name: currentClub.club.name});
}
