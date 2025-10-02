import ProfileClient from "@/app/profile/profileClient";
import {Metadata} from "next";
import {auth} from "@/lib/auth";
import {prisma} from "../../../prisma/prisma";

export async function generateMetadata(): Promise<Metadata> {
    const session = await auth()
    return {
        title: `${session?.user?.name}'s card`,
        description: "Curious? Check your acknowledges here"
    }
}

const Profile = async () => {
    const session = await auth()
    if(!session?.user.email) return <div>Unauthorized</div>

    const user = await prisma.user.findUnique({
        where: {email: session.user.email},
        include: {userClub: true}
    })

    const totals = user?.userClub.reduce((acc, uc) => {
        acc.money += uc.money
        acc.popularity += uc.popularity
        return acc
    },
        {money: 0, popularity: 0}
    )
    return(
        <ProfileClient session={session} totals={totals}/>
    )
}

export default Profile