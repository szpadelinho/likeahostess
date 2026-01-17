import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    const { name, image } = await req.json()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try{
        await prisma.user.update({
            where: {id: session.user?.id},
            data: {
                name,
                image
            }
        })

        return NextResponse.json({message: "Successfully updated user data"})
    }
    catch(err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}