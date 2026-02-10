import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const { massageId, clubData } = await req.json()
    if(massageId === undefined || clubData === undefined) return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    const massageItems = [
        {
            fatigue: 25,
            cost: 10000
        },
        {
            fatigue: 50,
            cost: 25000
        },
        {
            fatigue: 75,
            cost: 50000
        },
        {
            fatigue: 100,
            cost: 100000
        },
    ]

    try{
        const massage = massageItems[massageId]

        const hostesses = await prisma.userHostess.updateMany({
            where: {
                userId: session.user.id,
            },
            data: {
                fatigue: {
                    decrement: massage.fatigue
                }
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
                    decrement: massage.cost
                }
            }
        })

        return NextResponse.json({money: club.money, hostesses})
    }
    catch(err){
        console.error(err)
    }
}