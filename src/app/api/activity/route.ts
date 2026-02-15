import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const {clubData, activityId} = await req.json()

    if(clubData === undefined || activityId === undefined) return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    try{
        const gameAction = await prisma.gameAction.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

        const activity = await prisma.activity.findFirst({
            where: {
                id: activityId
            }
        })

        if(!activity) return NextResponse.json({message: "Activity does not exist"}, {status: 404})

        const club = await prisma.userClub.update({
            where: {
                userId_clubId: {
                    userId: session.user.id,
                    clubId: clubData.id
                }
            },
            data: {
                money: {
                    decrement: activity.cost
                },
                popularity: {
                    increment: activity.popularityGain
                }
            }
        })

        const user = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                experience: {
                    increment: Math.floor(Math.random() * (50 - 1) + 1)
                }
            }
        })

        if(club && user) {
            await prisma.gameAction.delete({
                where: {
                    userId: session.user.id,
                    id: gameAction.id
                }
            })
        }

        return NextResponse.json({clubData: club, experience: user.experience})
    }
    catch(err){
        console.error(err)
    }
}