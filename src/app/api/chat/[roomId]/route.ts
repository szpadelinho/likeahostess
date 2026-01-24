import { NextResponse } from "next/server";
import {prisma} from "../../../../../prisma/prisma";

interface Props {
    params: Promise<{ roomId: string }>
}

export async function GET(_: Request, { params }: Props) {
    const { roomId } = await params

    const messages = await prisma.chatMessage.findMany({
        where: { roomId },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, image: true } } },
        take: 100,
    })

    return NextResponse.json(messages)
}
