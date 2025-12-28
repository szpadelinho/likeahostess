import { NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma"
import { auth } from "@/lib/auth"
import {blocksSupplies} from "@/app/types";
import {getEffect} from "@/lib/effects";

export async function POST(req: Request) {
    const session = await auth()
    const userId = session?.user?.id
    if (!session || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { clubId, amount } = await req.json()

    if (!clubId || typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const effect = await getEffect(userId, clubId)

    if(blocksSupplies(effect)){
        return NextResponse.json({ skipped: true })
    }

    try {
        const club = await prisma.userClub.update({
            where: { userId_clubId: { userId, clubId } },
            data: { supplies: { increment: amount } },
        })

        return NextResponse.json({ supplies: club.supplies })
    } catch (error) {
        console.error("Failed to update club supplies:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}