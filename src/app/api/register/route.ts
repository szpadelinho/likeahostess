import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request){
    try{
        const {email, username, password} = await req.json()

        if (!email || !username || !password) {
            return NextResponse.json({error: "Missing fields"}, {status: 400})
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing){
            return NextResponse.json({error: "User already exists"}, {status: 409})
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name: username,
                password: hashed
            }
        })

        return NextResponse.json({ success: true, user})
    }
    catch(err){
        console.error(err)
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}