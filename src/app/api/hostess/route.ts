import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const hostesses = await tx.hostess.findMany()
            const existing = await tx.userHostess.findMany({
                where: {userId: session.user.id}
            })
            const existingIds = new Set(existing.map(e => e.hostessId))
            const missing = hostesses
                .filter(h => !existingIds.has(h.id))
                .map(h => ({
                    userId: session.user.id,
                    hostessId: h.id,
                    fatigue: 0
                }))
            if (missing.length > 0) {
                await tx.userHostess.createMany({
                    data: missing,
                    skipDuplicates: true
                })
            }
            const hostessesWithFatigue = await tx.hostess.findMany({
                include: {
                    UserHostess: {
                        where: { userId: session.user.id },
                        select: { fatigue: true }
                    }
                }
            })
            return hostessesWithFatigue.map(h => ({
                ...h,
                fatigue: h.UserHostess[0]?.fatigue ?? 0
            }))
        })
        return NextResponse.json(result)
    } catch (err) {
        console.error("Hostess Route.ts", err)
        return NextResponse.json({error: "Cannot fetch hostesses"}, {status: 500})
    }
}