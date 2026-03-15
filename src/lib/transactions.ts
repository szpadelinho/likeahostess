import {Club, EndTypes, Hostess, HostessMassage, InquiryTypes, StoredClub} from "@/app/types";
import {Dispatch, SetStateAction} from "react";
import {ActionStatus, ActionType, EffectType} from "@prisma/client";

interface InquiryHandler {
    setMoney: (fn: (x: number) => number) => void
    setPopularity: (fn: (x: number) => number) => void
    setExperience: (fn: (x: number) => number) => void
    setSupplies: (fn: (x: number) => number) => void
    setHostesses: React.Dispatch<React.SetStateAction<(Hostess | null)[]>>
    hostessId: string
    clubId: string
    type: InquiryTypes
    endOption?: EndTypes
    mealId?: string
    beverageId?: string
}

interface ActivityHandler {
    clubData: StoredClub
    activityId: number
    setClub: (value: SetStateAction<Club | null>) => void
    setPopularity: (fn: (x: number) => number) => void
    setExperience: (fn: (x: number) => number) => void
    setMoney: (fn: (x: number) => number) => void
}

interface MassageHandler {
    clubData: StoredClub
    massageId: number
    setHostesses: Dispatch<SetStateAction<HostessMassage[]>>
    setMoney: (fn: (x: number) => number) => void
}

interface LoanHandler {
    clubData: StoredClub
    amount?: number
    setMoney: (fn: (x: number) => number) => void
    setClub: (value: SetStateAction<Club | null>) => void
}

interface EffectHandler {
    clubData: StoredClub
    effect: EffectType
    setMoney: (fn: (x: number) => number) => void
    setClub: (value: SetStateAction<Club | null>) => void
}

interface SuppliesHandler {
    clubData: StoredClub
    amount: number
    setMoney: (fn: (x: number) => number) => void
    setSupplies: (fn: (x: number) => number) => void
    setClub: (value: SetStateAction<Club | null>) => void
}

interface GameAction {
    type: ActionType
    status: ActionStatus
}

export const handleGameAction = async ({type, status}: GameAction) => {
    try{
        await fetch("api/action", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                status
            }),
        })
    }
    catch(err){
        console.error(err)
    }
}

export const handleInquiry = async ({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId, clubId, mealId, beverageId, type, endOption} : InquiryHandler) => {
    try{
        const res = await fetch("api/inquiry", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hostessId,
                clubId,
                mealId,
                beverageId,
                type,
                endOption
            }),
        })
        const data = await res.json()

        if (data.hostesses) {
            setHostesses(prev => {
                const updated = [...prev]
                return updated.map(tableSlot => {
                    if (!tableSlot) return null
                    const updatedData = data.hostesses.find((h: any) => h.id === tableSlot.id)
                    return updatedData ? updatedData : tableSlot
                })
            })
        }

        setMoney(data.money)
        setPopularity(data.popularity)
        setExperience(data.experience)
        setSupplies(data.supplies)
    }
    catch(err){
        console.error(err)
    }
}

export const handleActivity = async ({clubData, activityId, setClub, setPopularity, setExperience, setMoney} : ActivityHandler) => {
    try{
        const res = await fetch("api/activity", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clubData,
                activityId
            }),
        })

        const data = await res.json()

        setClub(data.clubData)
        setPopularity(data.clubData.popularity)
        setExperience(data.experience)
        setMoney(data.clubData.money)
    }
    catch(err){
        console.error(err)
    }
}

export const handleMassage = async ({clubData, massageId, setHostesses, setMoney} : MassageHandler) => {
    try{
        const res = await fetch("api/massage", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clubData,
                massageId
            })
        })

        const data = await res.json()
        setHostesses(data.hostesses)
        setMoney(data.money)
    }
    catch(err){
        console.error(err)
    }
}

export const handleLoan = async ({clubData, amount, setMoney, setClub}: LoanHandler) => {
    try{
        const res = await fetch("api/moneylender", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clubData,
                amount
            })
        })

        const data = await res.json()
        setClub(data.clubData)
        setMoney(data.clubData.money)
    }
    catch(err){
        console.error(err)
    }
}

export const handleEffect = async ({clubData, effect, setMoney, setClub}: EffectHandler) => {
    try{
        const res = await fetch("api/new-serena/effect", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clubData,
                effect
            })
        })

        const data = await res.json()
        setClub(prev => prev ? { ...prev, money: data.money } : null)
        setMoney(data.money)
    }
    catch(err){
        console.error(err)
    }
}

export const handleSupplies = async ({clubData, amount, setMoney, setSupplies, setClub}: SuppliesHandler) => {
    try{
        const res = await fetch("api/new-serena/supplies", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clubData,
                amount
            })
        })

        const data = await res.json()

        setClub(prev => prev ? {
            ...prev,
            money: data.money,
            supplies: data.supplies
        } : null)
        setMoney(data.money)
        setSupplies(data.supplies)
    }
    catch(err){
        console.error(err)
    }
}