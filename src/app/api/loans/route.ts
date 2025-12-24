import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {calculateAmount, calculateInterest} from "@/app/types";

export async function GET() {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const loan = await prisma.loan.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (!loan) return NextResponse.json(null)

        const interest = calculateInterest(loan)
        const amount = calculateAmount(loan)

        return NextResponse.json({
            ...loan,
            currentInterest: interest,
            amount
        })
    } catch (err) {
        console.error("Loan Route.ts", err)
        return NextResponse.json({error: "Cannot fetch loans"}, {status: 500})
    }
}

export async function POST(req: Request){
    const session = await auth()
    const userId = session?.user?.id

    if (!session || !userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const { amount, clubId } = await req.json()

    if (typeof amount !== "number" || clubId === null || amount < 100000 || amount > 999999999) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    try{
        const existingLoan = await prisma.loan.findFirst({
            where: {
                userId: userId,
                paid: false
            }
        })

        if (existingLoan) {
            return NextResponse.json(
                { error: "You already have an active loan" },
                { status: 409 }
            )
        }

        const now = new Date()
        const dueAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        const loan = await prisma.$transaction([
            prisma.loan.create({
                data: {
                    userId: userId,
                    amount,
                    interest: 1.2,
                    createdAt: now,
                    dueAt,
                    paid: false
                }
            })
        ])

        return NextResponse.json(loan, { status: 201 })
    }
    catch(err){
        console.error("Loan POST error:", err)
        return NextResponse.json(
            { error: "Cannot create loan" },
            { status: 500 }
        )
    }
}

export async function DELETE(){
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const loan = await prisma.loan.deleteMany({
            where: {
                userId: session.user.id,
            }
        })
        return NextResponse.json(loan)
    } catch (err) {
        console.error("Loan Route.ts", err)
        return NextResponse.json({error: "Cannot delete loan"}, {status: 500})
    }
}