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
import DarkVeil from "@/ui/DarkVeil";
import Aurora from "@/ui/Aurora";
import FloatingLines from "@/ui/FloatingLines";
import Dither from "@/ui/Dither";
import LightRays from "@/ui/LightRays";
import LiquidChrome from "@/ui/LiquidChrome";
import Particles from "@/ui/Particles";
import Plasma from "@/ui/Plasma";
import LiquidEther from "@/ui/LiquidEther";
import PixelBlast from "@/ui/PixelBlast";
import LightPillar from "@/ui/LightPillar";
import Ballpit from "@/ui/Ballpit";

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

export interface Client {
    present: boolean
    expectedAttractiveness: number
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

export type PageType =
    "Main"
    | "Auth"
    | "Casino"
    | "Moneylender"
    | "NewSerena"
    | "Profile"
    | "Selection"
    | "Tutorial"
    | "LoveInHeart"
    | "Ranking"

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

export interface ProfileUser {
    id: string
    name: string | null
    image: string | null
    experience: number
}

export interface VolumeContextType {
    volume: number
    setVolume: (v: number) => void
    fadeTo: (v: number, duration?: number) => void
    restore: () => void
}

export interface Message{
    id?: string
    userId: string
    username: string
    content: string
    roomId: string
    createdAt?: string
    name?: string
    userImage?: string
}

export interface ChatUser{
    userId: string,
    username: string
    userImage: string
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

export const GAMES = [
    { title: "Howl of the Dragon (Yakuza)", intro: "9qNuScKbYuc", main: "9qNuScKbYuc" },
    { title: "Roar of the Twin Dragons (Yakuza 2)", intro: "SbNYIduyg-U", main: "SbNYIduyg-U" },
    { title: "Howl of the Dragon God (Yakuza 3)", intro: "Ga_NC3pXvbc", main: "AcUjoThA53Y" },
    { title: "Roarless Dragon (Yakuza 4)", intro: "Ut37SOojuaE", main: "Ut37SOojuaE" },
    { title: "The hearts of theirs (Yakuza 5)", intro: "Fn91JE4jYWk", main: "Fn91JE4jYWk" },
    { title: "Howl of Yinglong (Yakuza 6)", intro: "9laKzDA-klQ", main: "9laKzDA-klQ" },
    { title: "Darkness in light (Yakuza: Like a Dragon)", intro: "ATH0ej8Thc4", main: "Esoo3VaxGHI" },
    { title: "Burned Out (Like a Dragon: Infinite Wealth)", intro: "73c7cjH8NE0", main: "73c7cjH8NE0" },
    { title: "Pandora's Place (Yakuza 0)", intro: "Yy_kAjr0Ero", main: "sD-UJEQHXZc" },
    { title: "Howl of the Extreme Dragon (Yakuza Kiwami)", intro: "GhKDpI9T1Hg", main: "oZWyNXZyk1A" },
    { title: "Roar of the Twin Dragons (Yakuza Kiwami 2)", intro: "tmR_H5NZVVI", main: "djFlYHGWKiM" },
    { title: "Howl of the Extreme Dragon God (Yakuza Kiwami 3)", intro: "yt5pHeJHRDc", main: "U_-3ezL8nUM" },
    { title: "DOOR (Judgment)", intro: "M4JEwZeTKtI", main: "M4JEwZeTKtI" },
    { title: "Lost in the Rain (Lost Judgment)", intro: "LiSSAV1xpYo", main: "LiSSAV1xpYo" },
    { title: "Howl of the Old Dragon (Ryu Ga Gotoku Kenzan)", intro: "cxz7RqRPCpo", main: "cxz7RqRPCpo" },
]

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

export const getPageStyle = (page: string, isChatPanel?: boolean): string => {
    if(isChatPanel === null || isChatPanel === undefined) {
        isChatPanel = false
    }
    switch (page) {
        case "Main":
            return `border-2 border-pink-200 text-pink-200 rounded-[10] bg-pink-900 ${!isChatPanel && "hover:bg-pink-950 hover:text-pink-400"}`
        case "Auth":
            return `border-1 border-white text-white rounded-[10] ${!isChatPanel && "hover:bg-white hover:text-black"}`
        case "Casino":
            return `border-2 backdrop-blur-sm text-white rounded-[10] hover:backdrop-blur-xl hover:opacity-100`
        case "Moneylender":
            return `rounded-[5] bg-[url(/images/paper_texture.png)] bg-center text-stone-700 border-none ${!isChatPanel && "hover:text-black"}`
        case "NewSerena":
            return `rounded-[5] border-white text-white bg-black/20 ${!isChatPanel && "hover:bg-white hover:text-black"}`
        case "Profile":
            return `rounded-[5] border-stone-400 text-stone-200 ${!isChatPanel && "hover:bg-stone-200 hover:text-stone-950"} hover:border-stone-200`
        case "Selection":
            return `rounded-[10] border-white text-white ${!isChatPanel && "hover:bg-white hover:text-black"}`
        case "Tutorial":
            return `rounded-[10] border-white text-white ${!isChatPanel && "hover:bg-white hover:text-black"}`
        case "LoveInHeart":
            return `bg-[url(/images/wood_texture.png)] text-rose-100 ${!isChatPanel && "hover:text-rose-500"}`
        case "Ranking":
            return `rounded-[5] border-stone-400 text-stone-200 ${!isChatPanel && "hover:bg-stone-200 hover:text-stone-950"} hover:border-stone-200`
        default:
            return ""
    }
}

export const backgroundRenders = [
    <DarkVeil
        hueShift={302}
        noiseIntensity={.01}
        scanlineIntensity={0}
        speed={.5}
        scanlineFrequency={0}
        warpAmount={0}
        grayscale={true}
    />,
    <Aurora
        colorStops={["#fff","#fff","#fff"]}
        blend={0.5}
        amplitude={1.0}
        speed={.5}
    />,
    <FloatingLines
        linesGradient={["#fff", "#878787", "#232323"]}
        enabledWaves={["top","middle","bottom"]}
        lineCount={10}
        lineDistance={20}
        bendRadius={10}
        bendStrength={-1.5}
        interactive={true}
        parallax={true}
    />,
    <Dither
        waveColor={[0.5,0.5,0.5]}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
    />,
    <LightRays
        raysOrigin="top-center"
        raysColor="#fff"
        raysSpeed={1}
        lightSpread={0.5}
        rayLength={3}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0}
        distortion={0}
        className="custom-rays"
        pulsating={false}
        fadeDistance={1}
        saturation={1}
    />,
    <LiquidChrome
        baseColor={[.02, .02, .02]}
        speed={.5}
        amplitude={0.6}
        interactive={true}
    />,
    <Particles
        particleColors={["#ffffff"]}
        particleCount={1000}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover
        alphaParticles
        disableRotation={false}
        pixelRatio={1}
    />,
    <Plasma
        color="#ffffff"
        speed={0.6}
        direction="forward"
        scale={1.1}
        opacity={0.8}
        mouseInteractive={true}
    />,
    <LiquidEther
        colors={[ '#fff', '#808080', '#000000' ]}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
    />,
    <PixelBlast
        variant="square"
        pixelSize={4}
        color="#ffffff"
        patternScale={2}
        patternDensity={1}
        pixelSizeJitter={0}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid={false}
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.5}
        edgeFade={0.25}
        transparent
    />,
    <LightPillar
        topColor="#ffffff"
        bottomColor="#ffffff"
        intensity={1}
        rotationSpeed={0.3}
        glowAmount={0.002}
        pillarWidth={3}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
    />,
    <Ballpit
        count={440}
        gravity={0.01}
        friction={0.987}
        wallBounce={1}
        followCursor={false}
        colors={[ '#fff', '#808080', '#000000' ]}
    />
]