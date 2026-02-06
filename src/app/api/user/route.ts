import {auth} from "@/lib/auth"
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";

export async function GET(){
    try{
        const session = await auth()
        if(!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const user = await prisma.user.findUnique({
            where: {id: session?.user?.id},
            select: {experience: true}
        })

        if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        return NextResponse.json(
            {experience: user.experience},
            {status: 200}
        )
    }
    catch(err){
        console.error(err)
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request){
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { amount } = await req.json()

    if (typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    try{
        const user = await prisma.user.update({
            where: {id: session.user?.id},
            data: {
                experience: {
                    increment: amount
                }
            },
            select: { experience: true }
        })

        return NextResponse.json({experience: user.experience})
    }
    catch(err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}

export async function DELETE(){
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, {status: 401})

    try{
        const user = await prisma.user.delete({
            where: {id: session?.user?.id}
        })

        return NextResponse.json({user, success: true})
    }
    catch(err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}