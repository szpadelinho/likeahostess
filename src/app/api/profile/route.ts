import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({
        where: {email: session?.user?.email},
    })
    if(!user) return NextResponse.json({ error: "UPDATE USERCLUBS: Cannot find user"}, {status: 404})

    await prisma.userClub.updateMany({
        where: {userId: user.id},
        data: {money: 100000, popularity: 100}
    })

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request){
    const session = await auth()
    if(!session?.user?.email) return NextResponse.json({ error: "Unauthorized" })

    const user = await prisma.user.findUnique({
        where: {email: session.user.email}
    })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    await prisma.user.delete({
        where: {id: user.id}
    })
}