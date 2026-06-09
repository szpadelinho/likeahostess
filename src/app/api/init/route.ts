import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";
import {calculateAmount, calculateInterest, ActiveLoan, Loan} from "@/app/types";

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user?.email || !session?.user?.id) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const clubId = searchParams.get("clubId")

    try {
        if (!clubId) {
            return NextResponse.json({error: "No clubId provided/found"}, {status: 400})
        }

        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        })

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        let club = await prisma.userClub.findUnique({
            where: {
                userId_clubId: {
                    userId: user.id,
                    clubId,
                }
            }
        })

        if (!club) {
            club = await prisma.userClub.create({
                data: {
                    userId: user.id,
                    clubId,
                    money: 100000,
                    popularity: 100
                }
            })
        }

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

        const activities = await prisma.activity.findMany()
        const jams = await prisma.jam.findMany()
        const buffet = await prisma.buffet.findMany()
        const performers = await prisma.performer.findMany()
        const experience = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                experience: true
            }
        })

        if(!experience) return NextResponse.json({message: "Experience cannot be null!!"}, {status: 403})

        const fetchLoan = await prisma.loan.findFirst({
            where: {
                userClubId: club.id
            }
        })

        let loan: ActiveLoan | Loan | null = fetchLoan

        if (fetchLoan){
            const interest = calculateInterest(fetchLoan)
            const amount = calculateAmount(fetchLoan)

            loan = {
                ...fetchLoan,
                currentInterest: interest,
                amount
            }
        }

        const fetchEffect = await prisma.effect.findFirst({
            where: {
                userClubId: club.id
            }
        })

        let effect = fetchEffect

        if (fetchEffect){
            const now = new Date()

            if (fetchEffect.expiresAt <= now) {
                await prisma.effect.delete({
                    where: { id: fetchEffect.id }
                })
                effect = null
            }
        }

        return NextResponse.json({hostesses: result, activities, jams, buffet, performers, experience: experience.experience, club, loan, effect})
    } catch (err) {
        console.error("Hostess Route.ts", err)
        return NextResponse.json({error: "Cannot fetch hostesses"}, {status: 500})
    }
}