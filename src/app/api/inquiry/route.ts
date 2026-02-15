import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user?.id) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    const { hostessId, clubId, mealId, beverageId, type, endOption } = await req.json()

    if(hostessId === null || clubId === null ||  mealId === null || beverageId === null) return NextResponse.json({ error: "Incorrect data types" }, { status: 402 })

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    try{
        let popularity = Math.floor(Math.random() * (10 - 1) + 1)
        const experience = Math.floor(Math.random() * (10 - 1) + 1)
        let money = 0
        let supplies = 0

        switch(type){
            case "START":
                const [meal, beverage] = await Promise.all([
                    prisma.buffet.findFirst({ where: { id: mealId } }),
                    prisma.buffet.findFirst({ where: { id: beverageId } })
                ])

                if(meal) {
                    money += meal.price
                    supplies += 1
                }
                if(beverage) {
                    money += beverage.price
                    supplies += 1
                }
                break
            case "SERVICE":
                money = Math.floor(Math.random() * (1000 - 100) + 100)
                break
            case "END":
                switch(endOption) {
                    case "gift":
                        money = Math.floor(money / 2)
                        supplies += 1
                        break

                    case "cut":
                        money = 0
                        popularity *= 2
                        break
                }
        }

        const updatedHostess = await prisma.userHostess.update({
            where: { userId_hostessId: { userId: session.user.id, hostessId } },
            data: { fatigue: { decrement: 1 } }
        })
        const hostesses = await prisma.userHostess.findMany({
            where: { userId: session.user.id }
        })

        const updatedHostesses = hostesses.map(h =>
            h.id === updatedHostess.id ? updatedHostess : h
        )

        const club = prisma.userClub.findFirst({
            where: {
                userId: session.user.id,
                clubId: clubId,
            }
        })

        if(club === null) return NextResponse.json({error: "No such club"}, {status: 404})

        const updatedClub = await prisma.userClub.update({
            where: {
                userId_clubId: {
                    userId: session.user.id,
                    clubId
                }
            },
            data: {
                money: { increment: money },
                popularity: { increment: popularity },
                supplies: { increment: supplies }
            }
        })

        const user = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                experience: {
                    increment: experience
                }
            }
        })

        if(updatedClub && user) {
            await prisma.gameAction.delete({
                where: {
                    userId: session.user.id,
                    id: gameAction.id
                }
            })
        }

        return NextResponse.json({money: updatedClub.money, popularity: updatedClub.popularity, supplies: updatedClub.supplies, experience: user.experience, hostesses: updatedHostesses})
    }
    catch(err){
        console.error(err)
    }
}