'use client'

import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react"
import {supabase} from "@/lib/supabaseClient"
import {ChatUser, getPageStyle, Message, PageType, yesteryear} from "@/app/types";
import {useSession} from "next-auth/react";
import {EyeClosed} from "lucide-react";

interface ChatClientProps {
    page?: PageType,
    setIsTyping?: Dispatch<SetStateAction<boolean>>
}

export default function ChatClient({page, setIsTyping}: ChatClientProps) {
    const {data: session} = useSession()
    const [user, setUser] = useState<ChatUser | null>(null)
    const [roomId, setRoomId] = useState("GLOBAL")
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [mode, setMode] = useState<"COMPACT" | "EXPANDED">("COMPACT")
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    useEffect(() => {
        if (session?.user?.name && session?.user?.id && session?.user?.image) {
            setUser({userId: session.user.id, username: session.user.name, userImage: session.user.image})
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
        if (!input.trim() || !user) return

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
                className={`${mode === "COMPACT" ? "opacity-50" : "opacity-0 pointer-events-none"} ${page && getPageStyle(page)} ${page === "Main" && "fixed top-5 left-50"} transform duration-500 ease-in-out w-full max-w-lg mx-auto z-[50]`}
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
                className={`${mode === "EXPANDED" ? "opacity-100" : "opacity-0 pointer-events-none"} ${page && getPageStyle(page)} transform duration-500 ease-in-out fixed left-50 ${page === "Main" ? "top-5" : "top-10"} w-full max-w-lg mx-auto z-[50]`}
                style={page === "LoveInHeart" ? {
                    borderWidth: "8px",
                    borderStyle: "solid",
                    borderImageSource: "url('/images/wood_texture2.png')",
                    borderImageSlice: 30,
                    borderImageRepeat: "round",
                    bottom: -35
                } : {}}
            >
                <div className={"h-64 overflow-y-auto p-2 mb-2 overflow-x-hidden"}>
                    {messages.map(msg => (
                        <div key={msg.id} className={"flex items-center gap-2"}>
                            <img src={msg.userImage ?? "/images/dragon.png"} alt={msg.username}
                                 className={"w-8 h-8 rounded-full"}/>
                            <p><strong>{msg.username}:</strong> {msg.content}</p>
                        </div>
                    ))}
                    <div ref={bottomRef}/>
                </div>
                <input
                    value={input}
                    onFocus={() => setIsTyping?.(true)}
                    onBlur={() => setIsTyping?.(false)}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    className={"p-1 w-full"}
                    placeholder={"Type a message..."}
                />
                <button
                    className={`absolute -right-4 -top-4 p-2 ${page && getPageStyle(page)}`}
                    onClick={() => setMode("COMPACT")}>
                    <EyeClosed size={20}/>
                </button>
                <button onClick={sendMessage} className={"mt-2 px-4 py-1 rounded"}>Send</button>
            </div>
        </>
    )
}
