import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const { clubData, amount } = await req.json()
    if(clubData === undefined || amount !== "number") return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    try{
        const club = await prisma.userClub.update({
            where: {
                userId_clubId: {
                    userId: session.user.id,
                    clubId: clubData.id
                }
            },
            data: {
                supplies: {
                    increment: amount
                }
            }
        })

        return NextResponse.json({clubData: club})
    }
    catch(err){
        console.error(err)
    }
}