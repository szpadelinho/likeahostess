import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {prisma} from "../../../../prisma/prisma";

export async function POST(){
    const session = await auth()
    const userId = session?.user?.id
    if(!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await prisma.user.update({
        where: {id: userId},
        data: {tutorialDone: true}
    })

    return NextResponse.json({ success: true })
}