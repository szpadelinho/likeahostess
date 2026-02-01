import { NextResponse } from "next/server";
import {prisma} from "../../../../../prisma/prisma";
import {auth} from "@/lib/auth";

export async function GET(req: Request) {
    const session = await auth()
    const userId = session?.user?.id

    try{
        const rooms = await prisma.chatRoom.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        })
        return NextResponse.json(rooms)
    }
    catch(err){
        return NextResponse.json({error: err})
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({error: "Unauthorized"}, {status: 401})

        const {users, name} = await req.json()
        if (!users?.length) return NextResponse.json({error: "Users required"}, {status: 400})

        const allUsers = [...new Set([session.user.id, ...users])]

        if (allUsers.length === 2) {
            const existing = await prisma.chatRoom.findFirst({
                where: {
                    AND: allUsers.map(u => ({
                        members: {some: {userId: u}}
                    }))
                },
                include: {members: true}
            })

            if (existing) return NextResponse.json(existing)
        }

        const room = await prisma.chatRoom.create({
            data: {
                name: allUsers.length > 2 ? name : allUsers[0].name,
                members: {
                    create: allUsers.map(id => ({userId: id}))
                }
            },
            include: {members: true}
        })

        return NextResponse.json(room)
    } catch (err) {
        console.error(err)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}
