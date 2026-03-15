import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";
import {ActionStatus, ActionType} from "@prisma/client";

export async function GET(){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({error: "Unauthorized"}, {status: 401})
    try{
        const gameAction = await prisma.gameAction.findFirst({
            where: {
                userId: session?.user.id
            }
        })
        if(!gameAction){
            return NextResponse.json({error: "No game action"}, {status: 404})
        }
        return NextResponse.json(gameAction)
    }
    catch(err){
        return NextResponse.json({error: err})
    }
}

export async function POST(req: Request){
    const session = await auth()
    const {type, status} = await req.json()
    if (!Object.values(ActionType).includes(type as ActionType) ||
        !Object.values(ActionStatus).includes(status as ActionStatus)) {
        return NextResponse.json({ error: "Incorrect type or status" }, { status: 402 })
    }

    if(!session?.user.id) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    try{
        const existing = await prisma.gameAction.findFirst({
            where: {
                userId: session?.user.id
            }
        })
        if(existing) return NextResponse.json({error: "Game action already active"}, {status: 400})

        const now = new Date()
        const future = new Date(now.getTime() + 10000)

        const gameAction = await prisma.gameAction.create({
            data: {
                userId: session.user.id,
                type,
                status,
                startedAt: now,
                endsAt: future,
            }
        })

        return NextResponse.json(gameAction)
    }
    catch(err){
        console.error(err)
    }
}

export async function DELETE(){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    try{
        const gameAction = await prisma.gameAction.findFirst({
            where: { userId: session.user.id }
        })

        if (!gameAction) {
            return NextResponse.json({ error: "No active game action" }, { status: 404 })
        }

        await prisma.gameAction.delete({
            where: { id: gameAction.id }
        })

        return NextResponse.json({success: true})
    }
    catch(err){
        console.error(err)
    }
}