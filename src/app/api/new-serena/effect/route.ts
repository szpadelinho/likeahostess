import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {EffectType} from "@prisma/client";
import {prisma} from "../../../../../prisma/prisma";
import {drinks, DRINKS_MAP} from "@/app/types";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const { clubData, effect } = await req.json() as {
        clubData: { id: string },
        effect: EffectType
    }
    if(clubData === undefined || !Object.values(EffectType).includes(effect)) return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    try{
        const userClub = await prisma.userClub.findUnique({
            where: {
                userId_clubId: {
                    userId: session.user.id,
                    clubId: clubData.id
                }
            }
        })

        if(!userClub) return NextResponse.json({message: "UserClub does not exist"}, {status: 404})

        const existing = await prisma.effect.findFirst({
            where: {
                userClubId: userClub.id
            }
        })

        if(existing){
            return NextResponse.json({message: "Effect already in effect"}, {status: 500})
        }

        const now = new Date()
        const expiresAt = new Date(now.getTime() + 60 * 60 * 1000)

        const selectedDrink = drinks.find(d => DRINKS_MAP[d.id as keyof typeof DRINKS_MAP] === effect)

        if (!selectedDrink) {
            console.error("Nie znaleziono drinku dla typu:", effect)
            return NextResponse.json({ error: "Invalid effect type" }, { status: 400 })
        }

        const price = selectedDrink.price

        await prisma.effect.create({
            data: {
                userClubId: userClub.id,
                type: effect,
                createdAt: now,
                expiresAt,
            }
        })

        const club = await prisma.userClub.update({
            where: {
                userId_clubId: {
                    userId: session.user.id,
                    clubId: clubData.id
                }
            },
            data: {
                money: {
                    decrement: price
                }
            }
        })

        if(club) {
            await prisma.gameAction.delete({
                where: {
                    userId: session.user.id,
                    id: gameAction.id
                }
            })
        }

        return NextResponse.json({
            money: club.money,
            clubData: club
        })
    }
    catch(err){
        console.error(err)
    }
}