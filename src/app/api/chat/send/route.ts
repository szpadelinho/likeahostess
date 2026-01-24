import {NextResponse} from "next/server";
import {prisma} from "../../../../../prisma/prisma";
import {auth} from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomId, content } = await req.json()

    const message = await prisma.chatMessage.create({
        data: {
            roomId,
            content,
            userId: session.user.id,
            username: session.user.name!,
            userImage: session.user.image,
        },
    })

    return NextResponse.json(message)
}