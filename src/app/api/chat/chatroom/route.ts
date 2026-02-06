import { NextResponse } from "next/server";
import {prisma} from "../../../../../prisma/prisma";
import {auth} from "@/lib/auth";

export async function GET() {
    const session = await auth()
    const userId = session?.user?.id

    try{
        const rooms = await prisma.chatRoom.findMany({
            where: {
                members: {
                    some: { userId }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        })
        const formattedRooms = rooms.map(room => ({
            ...room,
            members: room.members.map(m => ({
                userId: m.user.id,
                username: m.user.name,
                userImage: m.user.image
            }))
        }))

        return NextResponse.json(formattedRooms)
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
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
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
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        })

        const formattedRoom = {
            ...room,
            members: room.members.map(m => ({
                userId: m.user.id,
                username: m.user.name,
                userImage: m.user.image
            }))
        }

        return NextResponse.json(formattedRoom)
    } catch (err) {
        console.error(err)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}
