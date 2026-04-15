import {NextResponse} from "next/server";
import {prisma} from "../../../../../prisma/prisma";
import {auth} from "@/lib/auth";

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { action } = await req.json()

    try{
        const role = await prisma.user.findFirst({
            where: {
                id: session?.user?.id
            }
        })

        if (!role && role !== "MANAGER") return NextResponse.json({ error: "Illegal action" }, { status: 404 })

        switch(action) {
            case "clear":
                await prisma.chatMessage.deleteMany({
                    where: {
                        roomId: "GLOBAL"
                    }
                })
        }
        return NextResponse.json({ success: true })
    }
    catch(err){
        console.error(err)
        return NextResponse.json({error: err}, {status: 500})
    }
}