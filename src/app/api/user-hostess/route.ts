import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";

export async function POST(req: Request){
    try{
        const {userId} = await req.json()

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 })
        }

        const hostess = await prisma.hostess.findMany()

        const results: any[] = []

        for(const h of hostess){
            let status = await prisma.userHostess.findFirst({
                where: {hostessId: h.id, userId}
            })

            if(!status){
                status = await prisma.userHostess.create({
                    data: {
                        hostessId: h.id,
                        userId: userId,
                        fatigue: 0,
                    }
                })
            }
            results.push(status)
        }

        return NextResponse.json(results)
    }
    catch(err){
        console.log(err)
        return NextResponse.json({error: "Failed to init fatigue"}, {status: 500})
    }
}