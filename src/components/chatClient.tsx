'use client'

import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react"
import {supabase} from "@/lib/supabaseClient"
import {ChatUser, getPageStyle, Message, PageType, yesteryear} from "@/app/types";
import {useSession} from "next-auth/react";
import {EyeClosed} from "lucide-react";
import {useRouter} from "next/navigation";

interface ChatClientProps {
    page?: PageType,
    setIsTyping?: Dispatch<SetStateAction<boolean>>,
    setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function ChatClient({page, setIsTyping, setLoading}: ChatClientProps) {
    const router = useRouter()
    const {data: session} = useSession()
    const userRef = useRef<ChatUser | null>(null)
    const [roomId, setRoomId] = useState("GLOBAL")
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [mode, setMode] = useState<"COMPACT" | "EXPANDED">("COMPACT")
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const chatRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    useEffect(() => {
        if (session?.user?.name && session?.user?.id && session?.user?.image) {
            userRef.current = {userId: session.user.id, username: session.user.name, userImage: session.user.image}
        }
    }, [session])

    useEffect(() => {
        if (!roomId) return

        const loadHistory = async () => {
            const res = await fetch(`/api/chat/${roomId}`)
            const data = await res.json()
            setMessages(data)
        }

        loadHistory()

        const channel = supabase
            .channel('room-' + roomId)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ChatMessage'
            }, payload => {
                console.log('Otrzymano nową wiadomość:', payload)
                if (payload.new.content.includes(`@${userRef?.current?.username}`)) {
                    chatRef.current = new Audio("/sfx/msg_ping.mp3")
                } else {
                    chatRef.current = new Audio("/sfx/msg.mp3")
                }
                chatRef.current.play().catch()
                setMessages(prev => [...prev, payload.new as Message])
            })
            .subscribe((status) => {
                console.log("Status subskrypcji:", status)
            })

        channel.subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId])

    const sendMessage = async () => {
        if (!input.trim() || !userRef.current) return

        await fetch("/api/chat/send", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                roomId,
                content: input,
            }),
        })

        setInput("")
    }

    const lastMessage = messages.at(-1)

    return (
        <>
            <div
                onClick={() => setMode("EXPANDED")}
                className={`${mode === "COMPACT" ? "opacity-50 hover:scale-105" : "opacity-0 pointer-events-none"} ${page && getPageStyle(page)} ${page === "Main" && "fixed top-5 left-50"} hover:opacity-100 transform duration-300 ease-in-out w-full max-w-lg rounded-[15] z-[50]`}
                style={page === "LoveInHeart" ? {
                    borderWidth: "8px",
                    borderStyle: "solid",
                    borderImageSource: "url('/images/wood_texture2.png')",
                    borderImageSlice: 30,
                    borderImageRepeat: "round",
                    bottom: -35
                } : {}}
            >
                <div className={"overflow-y-auto p-2 overflow-x-hidden"}>
                    {messages.length === 0 ? (
                        <p className={`text-[20px] ${yesteryear.className}`}>Silence was louder than words...</p>
                    ) : (
                        <div className={"flex items-center gap-2"}>
                            <img src={lastMessage?.userImage ?? "/images/dragon.png"} alt={lastMessage?.username}
                                 className={"w-8 h-8 rounded-full"}/>
                            <p><strong>{lastMessage?.username}:</strong> {lastMessage?.content}</p>
                        </div>
                    )}
                    <div ref={bottomRef}/>
                </div>
            </div>
            <div
                className={`${mode === "EXPANDED" ? "opacity-100" : "opacity-0 pointer-events-none"} ${page && getPageStyle(page, true)} duration-300 ease-in-out fixed left-50 ${page === "Main" ? "top-5" : "top-10"} w-full max-w-lg mx-auto z-[50]`}
                style={page === "LoveInHeart" ? {
                    borderWidth: "8px",
                    borderStyle: "solid",
                    borderImageSource: "url('/images/wood_texture2.png')",
                    borderImageSlice: 30,
                    borderImageRepeat: "round",
                    bottom: -35
                } : {}}
            >
                <div className={"h-64 overflow-y-auto p-2 mb-2 overflow-x-hidden flex flex-col gap-1"}>
                    {messages.map(msg => (
                        <div key={msg.id} className={"flex items-center gap-2"}>
                            <img
                                onDoubleClick={() => {
                                setLoading(true)
                                router.push(`/profile/${msg.userId}`)
                            }} src={msg.userImage ?? "/images/dragon.png"} alt={msg.username}
                                 className={"w-8 h-8 rounded-full hover:w-8.5 hover:h-8.5 hover:opacity-50 transition-all transform duration-100 ease-in-out"}/>
                            <h1 className={"flex justify-center items-center gap-1"}
                                onClick={() => {
                                if (!input.includes(msg.username)) {
                                    setInput(`@${msg.username}`)
                                }
                            }}>
                                <p className={"hover:scale-102 hover:opacity-50 font-[700] duration-100 ease-in-out"}>{msg.username}:</p> {msg.content}
                            </h1>
                        </div>
                    ))}
                    <div ref={bottomRef}/>
                </div>
                <div className={"flex items-center justify-center w-full"}>
                    <input
                        value={input}
                        onFocus={() => setIsTyping?.(true)}
                        onBlur={() => setIsTyping?.(false)}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        className={`p-1 border-1 rounded-[10] w-[97%] transform duration-300 ease-in-out ${page && getPageStyle(page)}`}
                        placeholder={"Type a message..."}
                    />
                </div>
                <button
                    className={`absolute rounded-[10] active:scale-105 hover:scale-102 -right-4 -top-4 p-2 ${page && getPageStyle(page)} transform duration-300 ease-in-out`}
                    onClick={() => setMode("COMPACT")}>
                    <EyeClosed size={20}/>
                </button>
                <button onClick={sendMessage}
                        className={`m-2 p-2 rounded-[10] transform duration-300 ease-in-out ${page && getPageStyle(page)}`}>Send
                </button>
            </div>
        </>
    )
}
