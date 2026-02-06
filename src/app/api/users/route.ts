import { NextResponse } from "next/server";
import {prisma} from "../../../../prisma/prisma";

export async function GET() {
    try{
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
            }
        })
        return NextResponse.json(users)
    }
    catch(err){
        return NextResponse.json({error: err})
    }
}
