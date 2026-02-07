import {prisma} from "../../prisma/prisma";

export async function getCurrentClub(userId: string) {
    return prisma.userClub.findFirst({
        where: { userId },
        include: {
            club: {
                include: { host: true }
            }
        }
    })
}