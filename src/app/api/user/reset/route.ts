import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../prisma/prisma";

export async function POST(){
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try{
        await prisma.user.update({
            where: {id: session.user?.id},
            data: {
                experience: 0
            }
        })

        return NextResponse.json({message: "Successfully reset the user experience"})
    }
    catch(err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}