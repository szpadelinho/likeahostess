import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {EffectType} from "@prisma/client";
import {prisma} from "../../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const { clubData, effect } = await req.json() as {
        clubData: { id: string },
        effect: EffectType
    }
    if(clubData === undefined || !Object.values(EffectType).includes(effect)) return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    const EFFECT_PRICE_MAP: Record<EffectType, number> = {
        DRAGON_OF_DOJIMA: 10000000,
        LIFELINE_OF_KAMUROCHO: 2000000,
        DRAGON_OF_KANSAI: 3000000,
        SAFEKEEPER_OF_THE_TOJO_CLAN: 4000000,
        FIGHTING_VIPER: 5000000
    }

    try{
        const existing = await prisma.effect.findFirst({
            where: {
                userClubId: clubData.id
            }
        })

        if(existing){
            return NextResponse.json({message: "Effect already in effect"}, {status: 500})
        }

        const now = new Date()
        const expiresAt = new Date(now.getTime() + 60 * 60 * 1000)

        await prisma.effect.create({
            data: {
                userClubId: clubData.id,
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
                    decrement: EFFECT_PRICE_MAP[effect]
                }
            }
        })
    }
    catch(err){
        console.error(err)
    }
}