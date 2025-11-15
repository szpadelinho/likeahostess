import {BuffetType, type Prisma} from "@prisma/client";
import {Cookie, Emilys_Candy, Fascinate_Inline, Molle, Texturina, Tiny5, Yesteryear} from "next/font/google";

export type FavClub = Prisma.UserClubGetPayload<{
    include: {
        club: {
            include: { host: true }
        }
    }
}>

export type Club = {
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    logo: string
}

export type ClubSelection = {
    id: string;
    name: string
    description: string
    cost: number
    exterior: string
    logo: string
    host: {
        image: string
    }
}

export interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
}

export interface HostessMassage {
    id: string
    name: string
    surname?: string
    image: string
}

export interface Performer {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    bio: string
}

export interface Activity {
    id: string
    name: string
    popularityGain: number
    cost: number
    media: string
    performerId: string
}

export interface Jam {
    id: string
    title: string
    media: string
}

export interface Buffet{
    id: string
    name: string
    price: number
    description: string
    type: BuffetType
    icon: string
}

export const SERVICE_TYPES = [
    "ashtray",
    "lady_glass",
    "guest_glass",
    "towel",
    "menu",
    "ice"
] as const

export type ServiceType = typeof SERVICE_TYPES[number]

export type WindowType =
    | "Management"
    | "Activities"
    | "Profile"
    | "Casino"
    | "NewSerena"
    | "Moneylender"
    | "Selection"
    | "LogOff"
    | "LoveInHeart"
    | null

export interface Drink{
    title: string
    description: string
    price: number
    color: string
    tattoo: string
}


//fonts
export const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

export const tiny5 = Tiny5({
    weight: "400",
    subsets: ['latin'],
})

export const cookie = Cookie({
    weight: "400",
    subsets: ['latin'],
})

export const fascinateInline = Fascinate_Inline({
    weight: "400",
    subsets: ['latin'],
})

export const texturina = Texturina({
    weight: "400",
    subsets: ['latin'],
})

export const molle = Molle({
    weight: "400",
    subsets: ['latin'],
})

export const emilysCandy = Emilys_Candy({
    weight: "400",
    subsets: ['latin'],
})