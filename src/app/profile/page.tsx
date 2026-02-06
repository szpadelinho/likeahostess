import ProfileClient from "@/app/profile/profileClient";
import {Metadata} from "next";
import {auth} from "@/lib/auth";
import {prisma} from "../../../prisma/prisma";
import LoadingBanner from "@/components/loadingBanner";
import {redirect} from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const session = await auth()
    return {
        title: `${session?.user?.name}'s card`,
        description: "Curious? Check your acknowledges here"
    }
}

const Profile = async () => {
    const session = await auth()
    if(!session || !session?.user?.email) redirect("/auth")

    const user = await prisma.user.findUnique({
        where: {email: session.user.email},
        include: {userClub: true}
    })

    if(!user) redirect("/")

    const totals = user?.userClub.reduce((acc, uc) => {
        acc.money += uc.money
        acc.popularity += uc.popularity
        acc.supplies += uc.supplies
        return acc
    },
        {money: 0, popularity: 0, supplies: 0}
    )

    if(totals && user?.userClub){
        totals.supplies /= user?.userClub.length
    }

    const favClub = await prisma.userClub.findFirst({
        where: {userId: session.user.id},
        orderBy: [
            {money: "desc"},
            {popularity: "desc"}
        ],
        include: {
            club: {
                include: {host: true}
            }
        }
    })


    if (!totals || !favClub) return <LoadingBanner show={true} />

    return(
        <ProfileClient totals={totals} favClub={favClub!} user={user} isMe/>
    )
}

export default Profile