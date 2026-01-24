'use client'

import {useEffect, useRef, useState} from "react"
import { supabase } from "@/lib/supabaseClient"
import {ChatUser, Message} from "@/app/types";
import {useSession} from "next-auth/react";

export default function ChatClient() {
    const {data: session} = useSession()
    const [user, setUser] = useState<ChatUser | null>(null)
    const [roomId, setRoomId] = useState("GLOBAL")
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if(session?.user?.name && session?.user?.id && session?.user?.image){
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomId,
                content: input,
            }),
        })

        setInput("")
    }

    return (
        <div className={"absolute left-10 top-50 p-4 border rounded w-full max-w-lg mx-auto bg-white"}>
            <div className={"h-32 overflow-y-auto border p-2 mb-2"}>
                {messages.map(msg => (
                    <div key={msg.id} className={"flex items-center gap-2"}>
                        <img src={msg.userImage ?? "/images/dragon.png"} alt={msg.username} className={"w-8 h-8 rounded-full"} />
                        <p><strong>{msg.username}:</strong> {msg.content}</p>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className={"border p-1 w-full"}
                placeholder={"Type a message..."}
            />
            <button onClick={sendMessage} className={"mt-2 border px-4 py-1 rounded"}>Send</button>
        </div>
    )
}
