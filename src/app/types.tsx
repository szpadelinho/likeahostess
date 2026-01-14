import {BuffetType, EffectType, type Prisma} from "@prisma/client";
import {
    Cookie, Coustard,
    Emilys_Candy,
    Fascinate_Inline, Federo, Marck_Script,
    Molle,
    Texturina,
    Tiny5,
    Yesteryear
} from "next/font/google";

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
    supplies: number
    logo: string
}

export type StoredClub = {
    id: string
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    supplies: number
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
    userClub: {
        money: number
        popularity: number
        supplies: number
    }[]
}

export interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
    fatigue: number
}

export interface HostessMassage {
    id: string
    name: string
    surname?: string
    image: string
    fatigue: number
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

export interface Loan{
    id: string
    userClubId: string
    amount: number
    interest: number
    createdAt: Date
    dueAt: Date
    paid: boolean
    paidAt: Date | null
}

export interface Drink{
    id: number
    title: string
    description: string
    price: number
    color: string
    tattoo: string
}

export interface Effect{
    id: string
    userClubId: string
    type: EffectType
    createdAt: Date
    expiresAt: Date
    active: boolean
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
    | "Tutorial"
    | "SupplyAlert"
    | "MoneyAlert"
    | null

export type Ranking = {
    id: string
    name: string | null
    image: string
    money: number
    popularity: number
    supplies: number
    experience: number
}

export interface NewSerena{
    name: string
    selection: string
    drinks: string
    supplies: string
    song: string
}

export interface Moneylender{
    name: string
    photo: string
    song: string
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

export const marckScript = Marck_Script({
    weight: "400",
    subsets: ['latin'],
})

export const coustard = Coustard({
    weight: "400",
    subsets: ['latin'],
})

export const monoton = Federo({
    weight: "400",
    subsets: ['latin'],
})

export type Rank = {
    lvl: number
    rank: string
}

export const CLUB_RANKS: Record<number, string> = {
    0: "Poor bastard",
    1: "Club Newcomer",
    2: "Backroom Helper",
    3: "Glass Runner",
    4: "Flyer Handout Kid",
    5: "Dish Collector",
    6: "Cleaner Assistant",
    7: "Entry Hall Helper",
    8: "Trainee Host",
    9: "Novice Staff",

    10: "Club Trainee",
    11: "Customer Greeter",
    12: "Floor Support",
    13: "Assistant Host",
    14: "Drink Runner",
    15: "Waiting Staff",
    16: "Service Clerk",
    17: "Table Assistant",
    18: "Entry-Level Host",
    19: "Junior Host",

    20: "Nightshift Worker",
    21: "Junior Floor Staff",
    22: "Basic Host",
    23: "Customer Handler",
    24: "Table Manager Assistant",
    25: "Apprentice Host",
    26: "Shift Helper",
    27: "Customer Service Staff",
    28: "Training Manager",
    29: "Host Trainee Leader",

    30: "Full Host",
    31: "Floor Host",
    32: "Senior Host",
    33: "Club Attendant",
    34: "VIP Room Assistant",
    35: "Daily Shift Leader",
    36: "Cashier Assistant",
    37: "Service Leader",
    38: "Promotion Runner",
    39: "VIP Host",

    40: "Floor Coordinator",
    41: "Floor Manager Assistant",
    42: "Customer Relations Junior",
    43: "Bar Support",
    44: "Service Captain",
    45: "Shift Supervisor",
    46: "Night Duty Leader",
    47: "Club Representative",
    48: "Senior Floor Host",
    49: "VIP Handler",

    50: "Floor Manager",
    51: "VIP Floor Manager",
    52: "Customer Relations Manager",
    53: "Event Staff Leader",
    54: "Club Supervisor",
    55: "Shift Manager",
    56: "Human Relations Officer",
    57: "Host Team Leader",
    58: "VIP Guest Manager",
    59: "Senior Service Manager",

    60: "Assistant Manager",
    61: "Operation Supervisor",
    62: "Night Operations Manager",
    63: "Talent Coordinator",
    64: "Club Operations Manager",
    65: "Guest Experience Manager",
    66: "Club Promotion Manager",
    67: "Lead Manager",
    68: "Assistant General Manager",
    69: "Floor Director",

    70: "Club Manager",
    71: "VIP Manager",
    72: "Guest Relations Director",
    73: "Entertainment Manager",
    74: "Senior Manager",
    75: "General Manager",
    76: "Cabaret Club Manager",
    77: "Operations Director",
    78: "Hostess Director",
    79: "Nightlife Director",

    80: "Executive Manager",
    81: "Club Executive",
    82: "Director of Operations",
    83: "Chief Experience Officer",
    84: "Executive Director",
    85: "Chief Host Director",
    86: "Nightlife Executive",
    87: "Entertainment Executive",
    88: "Senior Executive",
    89: "Executive Vice President",

    90: "Club Vice President",
    91: "President Assistant",
    92: "Acting President",
    93: "Club President",
    94: "Chief President",
    95: "Nightlife President",
    96: "Executive Club President",
    97: "Regional President",
    98: "Chairman",
    99: "Supreme Chairman",
    100: "Legendary Club Chairman"
} as const

export const newSerenaType: NewSerena[] = [
    {name: "Date", selection: "date_new_serena", drinks: "date_new_serena_2", supplies: "date_new_serena_3", song: "-hlRhz4FHkg"},
    {name: "Reina", selection: "reina_new_serena", drinks: "reina_new_serena_2", supplies: "reina_new_serena_3", song: "YFj4P2zmD5c"}
]

export const moneylenderType: Moneylender[] = [
    {name: "Mine", photo: "mine_moneylender", song: "FxPDNViVcow"},
    {name: "Hana", photo: "hana_moneylender", song: "CSulHg_OTn4"}
]

export const drinks: Drink[] = [
    {id: 0, title: "Essence of the Dragon of Dojima", description: "Apparently really pricey. However, only one person managed to demolish this booze.", price: 10000000, color: "red", tattoo: "oryu"},
    {id: 1, title: "Essence of the Lifeline of Kamurocho", description: "From what is known, this alcohol boosts your luck to gain more money... Huge if true.", price: 2000000, color: "purple", tattoo: "phoenix"},
    {id: 2, title: "Essence of the Dragon of Kansai", description: "Supposedly cools off the atmosphere of your club.", price: 3000000, color: "pink", tattoo: "yellow_dragon"},
    {id: 3, title: "Essence of the Safekeeper of the Tojo CLan", description: "The purpose of this drink is to freshen your mind to manage your resources more carefully and rationally.", price: 4000000, color: "yellow", tattoo: "kirin"},
    {id: 4, title: "Essence of the Fighting Viper", description: "A drink with no known benefit... apparently gives you a random boost.", price: 5000000, color: "green", tattoo: "viper"}
]

export const DRINKS_MAP: Record<number, EffectType> = {
    0: EffectType.DRAGON_OF_DOJIMA,
    1: EffectType.LIFELINE_OF_KAMUROCHO,
    2: EffectType.DRAGON_OF_KANSAI,
    3: EffectType.SAFEKEEPER_OF_THE_TOJO_CLAN,
    4: EffectType.FIGHTING_VIPER,
}

export const intros = [
    "9qNuScKbYuc", // YAKUZA 1
    "SbNYIduyg-U", // YAKUZA 2
    "AcUjoThA53Y", // YAKUZA 3
    "Ut37SOojuaE", // YAKUZA 4
    "Fn91JE4jYWk", // YAKUZA 5
    "CHE5PWK_ZOE", // YAKUZA 6
    "ATH0ej8Thc4", // YAKUZA 7
    "73c7cjH8NE0", // YAKUZA 8
    "sD-UJEQHXZc", // YAKUZA 0
    "GhKDpI9T1Hg", // YAKUZA KIWAMI
    "tmR_H5NZVVI", // YAKUZA KIWAMI 2
    "axnVPHo6BgI", // YAKUZA KIWAMI 3
    "M4JEwZeTKtI", // JUDGMENT
    "LiSSAV1xpYo", // LOST JUDGMENT
    "2gCemGx-W18", // KENZAN
]

export const INTROS_MAP: Record<number, string> = {
    0: "Howl of the Dragon (Yakuza)",
    1: "Roar of the Twin Dragons (Yakuza 2)",
    2: "Howl of the Dragon God (Yakuza 3)",
    3: "Roarless Dragon (Yakuza 4)",
    4: "The hearts of theirs (Yakuza 5)",
    5: "Howl of Yinglong (Yakuza 6)",
    6: "Darkness in light (Yakuza: Like a Dragon)",
    7: "Burned Out (Like a Dragon: Infinite Wealth)",
    8: "Pandora's Place (Yakuza 0)",
    9: "Howl of the Extreme Dragon (Yakuza Kiwami)",
    10: "Roar of the Twin Dragons (Yakuza Kiwami 2)",
    11: "Howl of the Extreme Dragon God (Yakuza Kiwami 3)",
    12: "DOOR (Judgment)",
    13: "Lost in the Rain (Lost Judgment)",
    14: "Howl of the Old Dragon (Ryu Ga Gotoku Kenzan)"
}

export const getLevel = (xp: number) => {
    return Math.min(Math.floor(xp / 1000), 100)
}

export const getRank = (lvl: number) => CLUB_RANKS[lvl] ?? "Weirdo"

export function calculateInterest(loan: Loan) {
    const now = new Date()

    if (now <= loan.dueAt) return loan.interest

    const overdueMs = now.getTime() - loan.dueAt.getTime()
    const intervals = Math.floor(overdueMs / (1000 * 60 * 10))

    const interestIncreasePerInterval = 0.5
    return loan.interest + intervals * interestIncreasePerInterval
}

export function calculateAmount(loan: Loan){
    const interest = calculateInterest(loan)
    return Math.floor(loan.amount * interest)
}

export function blocksFatigue(effect: Effect | null) : boolean {
    return effect?.type === "DRAGON_OF_KANSAI"
}

export function blocksSupplies(effect: Effect | null): boolean {
    return effect?.type === "SAFEKEEPER_OF_THE_TOJO_CLAN"
}