import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const clubs = await prisma.club.findMany({
        include: {
            host: true,
            userClub: {
                where: {
                    userId: session?.user?.id
                },
                select: {
                    money: true,
                    popularity: true,
                    supplies: true
                }
            }
        }
    })

    return NextResponse.json(clubs)
}