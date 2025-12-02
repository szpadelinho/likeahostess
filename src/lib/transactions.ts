import {Club} from "@/app/types";
import {SetStateAction} from "react";

export const handleMoneyTransaction = async ({
                                      session,
                                      clubData,
                                      setMoney,
                                      setClub,
                                      change
                                  }: {
    session: any,
    clubData: any,
    setMoney: (fn: (x: number) => number) => void,
    setClub: (value: SetStateAction<Club | null>) => void
    change: number
}) => {
    if (!session?.user?.id) {
        return console.error("Missing userId")
    }
    if(!clubData?.id){
        return console.error("Missing clubData.id")
    }
    if(!clubData) return console.error("ClubData is undefined")
    setMoney(prev => prev + change)
    setClub(prev => prev ? {...prev, money: prev.money + change} : prev)
    try {
        const res = await fetch('/api/clubs/update-money', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: session?.user?.id,
                clubId: clubData.id,
                amount: change
            }),
        })

        if (!res.ok) console.error('updateMoney on CasinoClient failed')
    }
    catch (error) {
        console.error(error)
        setMoney(prev => prev - change)
        setClub(prev => prev ? {...prev, money: prev.money - change} : prev)
    }
}