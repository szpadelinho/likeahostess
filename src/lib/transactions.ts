import {Club, Hostess, HostessMassage, StoredClub} from "@/app/types";
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
    setMoney?: (fn: (x: number) => number) => void,
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
    setMoney?.(prev => prev + change)
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

        if (!res.ok) console.error('updateMoney on transactions failed')
    }
    catch (error) {
        console.error(error)
        setMoney?.(prev => prev - change)
        setClub(prev => prev ? {...prev, money: prev.money - change} : prev)
    }
}

export const handlePopularityTransaction = async ({
                                                 session,
                                                 clubData,
                                                 setPopularity,
                                                 setClub,
                                                 change
                                             }: {
    session: any,
    clubData: any,
    setPopularity: (fn: (x: number) => number) => void,
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
    setPopularity(prev => prev + change)
    setClub(prev => prev ? {...prev, popularity: prev.popularity + change} : prev)
    try {
        const res = await fetch('/api/clubs/update-popularity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: session?.user?.id,
                clubId: clubData.id,
                amount: change
            }),
        })

        if (!res.ok) console.error('updatePopularity on transactions failed')
    }
    catch (error) {
        console.error(error)
        setPopularity(prev => prev - change)
        setClub(prev => prev ? {...prev, popularity: prev.popularity - change} : prev)
    }
}

export const handleSuppliesTransaction = async ({
                                                      session,
                                                      clubData,
                                                      setSupplies,
                                                      setClub,
                                                      change
                                                  }: {
    session: any,
    clubData: any,
    setSupplies: (fn: (x: number) => number) => void,
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
    setSupplies(prev => prev + change)
    setClub(prev => prev ? {...prev, supplies: prev.supplies + change} : prev)
    try {
        const res = await fetch('/api/clubs/update-supplies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: session?.user?.id,
                clubId: clubData.id,
                amount: change
            }),
        })

        if (!res.ok) console.error('updateSupplies on transactions failed')
    }
    catch (error) {
        console.error(error)
        setSupplies(prev => prev - change)
        setClub(prev => prev ? {...prev, supplies: prev.supplies - change} : prev)
    }
}

export const handleExperienceTransaction = async ({
                                                      session,
                                                      setExperience,
                                                      change
                                                  }: {
    session: any,
    setExperience: (fn: (x: number) => number) => void,
    change: number
}) => {
    if (!session?.user?.id) {
        return console.error("Missing userId")
    }
    setExperience(prev => prev + change)
    try {
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: change
            }),
        })

        if (!res.ok) console.error('updateExperience on transactions failed')
    }
    catch (error) {
        console.error(error)
        setExperience(prev => prev - change)
    }
}

export const handleFatigueTransaction = async ({
                                                      session,
                                                      setHostesses,
                                                      change
                                                  }: {
    session: any,
    setHostesses: React.Dispatch<React.SetStateAction<HostessMassage[]>>,
    change: number
}) => {
    if (!session?.user?.id) {
        return console.error("Missing userId")
    }
    setHostesses(prev =>
        prev.map(h => ({
            ...h,
            fatigue: Math.max((h.fatigue ?? 0) - change, 0)
        }))
    )
    try {
        const res = await fetch('/api/user-hostess/update-fatigue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: change
            }),
        })

        if (!res.ok) console.error('updateFatigue on transactions failed')
    }
    catch (error) {
        console.error(error)
        setHostesses(prev =>
            prev.map(h => ({
                ...h,
                fatigue: Math.max((h.fatigue ?? 0) + change, 100)
            }))
        )
    }
}

export const handleHostessFatigueTransaction = async ({
                                                   session,
                                                   setHostesses, hostessId,
                                                   change
                                               }: {
    session: any,
    setHostesses: React.Dispatch<React.SetStateAction<(Hostess | null)[]>>,
    hostessId: string
    change: number
}) => {
    if (!session?.user?.id) {
        return console.error("Missing userId")
    }
    setHostesses(prev =>
        prev.map(h =>
            h
                ? {
                    ...h,
                    fatigue: Math.min(
                        100,
                        Math.max((h.fatigue ?? 0) - change, 0)
                    )
                }
                : null
        )
    )
    try {
        const res = await fetch('/api/user-hostess/update-fatigue-hostess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hostessId: hostessId,
                amount: change
            }),
        })

        if (!res.ok) console.error('updateHostessFatigue on transactions failed')
    }
    catch (error) {
        console.error(error)
        setHostesses(prev =>
            prev.map(h =>
                h
                    ? {
                        ...h,
                        fatigue: Math.min(
                            100,
                            Math.max((h.fatigue ?? 0) - change, 0)
                        )
                    }
                    : null
            )
        )
    }
}

export const handleLoanTransaction = async ({session, clubData, amount, type} : {session: any, clubData: StoredClub, amount: number, type: "Payment" | "Takeout"}) => {
    if (!session?.user?.id) {
        return console.error("Missing userId")
    }
    try{
        if(type === "Takeout"){
            const res = await fetch('/api/loans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    clubId: clubData.id,
                }),
            })
            if (!res.ok) console.error('handleLoanTransaction takeout on transactions failed')
        }
        else{
            const res = await fetch('/api/loans', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clubId: clubData.id,
                })
            })
            if (!res.ok) console.error('handleLoanTransaction payment on transactions failed')
        }
    }
    catch(err){
        console.error("handleLoanTransaction failed", err)
    }
}