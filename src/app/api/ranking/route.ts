import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const statistics = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                userClub: {
                    select: {
                        money: true,
                        popularity: true,
                        supplies: true
                    }
                }
            }
        })

        function aggregatedRanking(ranking: typeof statistics) {
            return ranking.map(user => {
                const clubCount = user.userClub.length || 1

                const totals = user.userClub.reduce(
                    (acc, club) => {
                        acc.money += club.money
                        acc.popularity += club.popularity
                        acc.supplies += club.supplies
                        return acc
                    },
                    {money: 0, popularity: 0, supplies: 0}
                )

                return {
                    id: user.id,
                    name: user.name,
                    money: totals.money,
                    popularity: totals.popularity,
                    supplies: Math.round((totals.supplies / clubCount) * 100) / 100
                }
            })
        }

        const aggregated = aggregatedRanking(statistics)

        const moneyRanking = [...aggregated].sort((a, b) => b.money - a.money)
        const popularityRanking = [...aggregated].sort((a, b) => b.popularity - a.popularity)
        const suppliesRanking = [...aggregated].sort((a, b) => b.supplies - a.supplies)

        return NextResponse.json({
            money: moneyRanking.slice(0, 10),
            popularity: popularityRanking.slice(0, 10),
            supplies: suppliesRanking.slice(0, 10)
        })
    }
    catch (err) {
        console.error("Ranking Route.ts", err)
        return NextResponse.json({error: "Cannot fetch ranking"}, {status: 500})
    }
}