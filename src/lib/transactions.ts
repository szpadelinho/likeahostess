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
    mealId?: number
    beverageId?: number
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

interface RouletteBet {
    type: string
    amount: number
}

interface RouletteHandler {
    bets: RouletteBet[]
    setMoney: (fn: (x: number) => number) => void
    setScore: Dispatch<SetStateAction<string | number | boolean | null>>
    setWin: Dispatch<SetStateAction<0 | 2 | 1>>
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

        setMoney(data.money)
        setPopularity(data.popularity)
        setExperience(data.exp)
        setSupplies(data.supplies)
        setHostesses(data.hostesses)
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
        setClub(data.clubData)
        setMoney(data.clubData.money)
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
        setClub(data.clubData)
        setMoney(data.clubData.money)
        setSupplies(data.clubData.supplies)
    }
    catch(err){
        console.error(err)
    }
}

export const handleRoulette = async ({bets, setMoney, setScore, setWin}: RouletteHandler) => {
    try{
        const res = await fetch("api/roulette", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bets
            })
        })

        if(!res.ok) return console.error("Error on handleRoulette")

        const data = await res.json()

        setMoney(data.money)
        setScore(data.score)
        setWin(data.payout)

        return data.winningNumber
    }
    catch(err){
        console.error(err)
    }
}

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
    try {
        const res = await fetch('/api/clubs/update-supplies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clubId: clubData.id,
                amount: change
            }),
        })

        if (!res.ok) console.error('updateSupplies on transactions failed')

        const data = await res.json()
        if(data.skipped) return

        setSupplies(prev => prev + change)
        setClub(prev => prev ? {...prev, supplies: prev.supplies + change} : prev)
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
                                                   setHostesses, clubId, hostessId,
                                                   change
                                               }: {
    session: any,
    setHostesses: React.Dispatch<React.SetStateAction<(Hostess | null)[]>>,
    clubId: string
    hostessId: string
    change: number
}) => {
    if (!session?.user?.id) {
        return console.error("Missing userId")
    }
    try {
        const res = await fetch('/api/user-hostess/update-fatigue-hostess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hostessId: hostessId,
                amount: change,
                clubId
            }),
        })

        if (!res.ok) console.error('updateHostessFatigue on transactions failed')
        const data = await res.json()
        if(data.skipped) return

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

export const handleEffectTransaction = async ({session, clubData, type, action} : {session: any, clubData: StoredClub, type?: EffectType, action: "CREATE" | "DELETE"}) => {
    if (!session?.user?.id) return console.error("Missing userId")
    try{
        if(action === "CREATE"){
            const res = await fetch('/api/effect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    clubId: clubData.id,
                }),
            })
            if (!res.ok) console.error('handleEffectTransaction CREATE on transactions failed')
        }
        else{
            const res = await fetch('/api/effect', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clubId: clubData.id,
                })
            })
            if (!res.ok) console.error('handleEffectTransaction DELETE on transactions failed')
        }
    }
    catch(err){
        console.error("handleEffectTransaction failed", err)
    }
}