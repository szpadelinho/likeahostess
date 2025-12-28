import {prisma} from "../../prisma/prisma";
import {Effect} from "@/app/types";

export async function getEffect(userId: string, clubId: string){
    const userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId
            }
        }
    })

    if(!userClub) return null

    const effect = await prisma.effect.findFirst({
        where: {
            userClubId: userClub.id,
            expiresAt: {
                gt: new Date()
            }
        }
    })

    return effect
}

export function applyEffect(amount: number, effect: Effect | null) : number {
    if(!effect) return amount

    switch(effect.type){
        case "DRAGON_OF_DOJIMA":
            return Math.floor(amount * 2)
        case "LIFELINE_OF_KAMUROCHO":
            return Math.floor(amount * 2)
        case "FIGHTING_VIPER":
            const random = Math.floor(Math.random() * (5 - 1) + 1)
            return Math.floor(amount * random)
        default:
            return amount
    }
}