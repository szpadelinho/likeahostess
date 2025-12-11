import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const clubId = searchParams.get("clubId")

    if (!clubId) {
        return NextResponse.json(
            { error: "No clubId provided or found" },
            { status: 400 }
        )
    }

    const user = await prisma.user.findUnique({
        where: { id: session?.user?.id }
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const DEFAULT_VALUES = {
        money: 100000,
        popularity: 100,
        supplies: 100
    }

    const club = await prisma.userClub.update({
        where: {
            userId_clubId: {
                userId: user.id,
                clubId,
            }
        },
        data: DEFAULT_VALUES
    })

    return NextResponse.json({
        success: true,
        message: "Club values successfully reset",
        club
    })
}
