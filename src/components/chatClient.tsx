'use client'

import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react"
import {supabase} from "@/lib/supabaseClient"
import {
    ChatUser,
    ChatUserList,
    getPageStyle,
    Message,
    PageType,
    Room,
    RoomDisplay,
    yesteryear
} from "@/app/types";
import {useSession} from "next-auth/react";
import {EyeClosed, List, MessageSquare, MessageSquarePlus, Plus, Send} from "lucide-react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {handleChat} from "@/lib/transactions";
import MessageContent from "@/components/messageContent";
import Embed from "@/components/embed";

interface ChatClientProps {
    page?: PageType,
    setIsTyping?: Dispatch<SetStateAction<boolean>>,
    setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function ChatClient({page, setIsTyping, setLoading}: ChatClientProps) {
    const router = useRouter()
    const {data: session} = useSession()
    const userRef = useRef<ChatUser | null>(null)
    const [currentRoom, setCurrentRoom] = useState<Room>({id: "GLOBAL", name: "Global Chat", createdAt: "2026-01-24 15:47:43"})
    const [list, setList] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [rooms, setRooms] = useState<Room[]>([])
    const [users, setUsers] = useState<ChatUserList[]>([])
    const [roomCreation, setRoomCreation] = useState<boolean>(false)
    const [selectedUsers, setSelectedUsers] = useState<ChatUserList[]>([])
    const [roomName, setRoomName] = useState("")
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
        const loadRooms = async () => {
            const res = await fetch(`/api/chat/chatroom`)
            const data = await res.json()
            const globalRoom = {
                id: "GLOBAL",
                name: "Global Chat",
                createdAt: "2026-01-24 15:47:43"
            }

            setRooms([globalRoom, ...data])
        }

        const loadUsers = async () => {
            const res = await fetch(`/api/users`)
            const data = await res.json()
            setUsers(data.filter((u: ChatUserList) => u.id !== session?.user?.id))
        }
        loadRooms()
        loadUsers()
    }, [session?.user?.id])

    useEffect(() => {
        if (!currentRoom) return

        const loadHistory = async () => {
            const res = await fetch(`/api/chat/${currentRoom.id}`)
            const data = await res.json()
            setMessages(data)
        }

        loadHistory()

        const channel = supabase
            .channel('room-' + currentRoom.id)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'ChatMessage',
                filter: `roomId=eq.${currentRoom.id}`
            }, payload => {
                if (payload.new.content.includes(`@${userRef?.current?.username}`)) {
                    chatRef.current = new Audio("/sfx/msg_ping.mp3")
                } else {
                    chatRef.current = new Audio("/sfx/msg.mp3")
                }
                chatRef.current.play().catch()
                setMessages(prev => [...prev, payload.new as Message])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentRoom])

    const sendMessage = async () => {
        if (!input.trim() || !userRef.current) return

        if(input.toLowerCase() === "/clear" || input.toLowerCase() === "/c"){
            const status = await handleChat("clear")
            if (status.success) {
                setMessages([])
                setInput("")
            }
            return
        }

        await fetch("/api/chat/send", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                roomId: currentRoom.id,
                content: input,
            }),
        })

        setInput("")
    }

    const newRoom = async () => {
        if (!selectedUsers.length) return

        const userIds = selectedUsers.map(u => u.id)

        const res = await fetch("/api/chat/chatroom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                users: userIds,
                ...(selectedUsers.length > 1 && { name: roomName })
            })
        })

        const room = await res.json()

        setRooms(prev => {
            if (prev.find(r => r.id === room.id)) return prev
            return [...prev, room]
        })

        setCurrentRoom(room)
        setRoomCreation(false)
        setSelectedUsers([])
        setRoomName("")
    }

    const lastMessage = messages.at(-1)

    return (
        <div className={`w-[512px] relative ${page === "Main" ? "fixed left-50 top-5" : "fixed -top-5"}`}>
            <button
                className={`${mode === "COMPACT" && "opacity-50 hover:opacity-100"} absolute right-0 z-[10] rounded-[10] active:scale-105 hover:scale-102 -top-2 right-[-20] p-2 ${page && getPageStyle(page)} transform duration-300 ease-in-out`}
                style={page === "LoveInHeart" ? {
                    borderWidth: "8px",
                    borderStyle: "solid",
                    borderImageSource: "url('/images/wood_texture2.png')",
                    borderImageSlice: 30,
                    borderImageRepeat: "round",
                } : {}}
                onClick={() => {
                    mode === "COMPACT" ? setMode("EXPANDED") : setMode("COMPACT")
                }}>
                {mode === "COMPACT" ? <MessageSquare/> : <EyeClosed/>}
            </button>
            <div
                className={`absolute ${mode === "COMPACT" ? "opacity-50 hover:scale-105 pointer-events-auto z-[0]" : "opacity-0 pointer-events-none z-[-999]"} ${page && getPageStyle(page)} overflow-hidden hover:opacity-100 transform duration-300 ease-in-out w-full max-w-lg rounded-[15] z-[49]`}
                style={page === "LoveInHeart" ? {
                    borderWidth: "8px",
                    borderStyle: "solid",
                    borderImageSource: "url('/images/wood_texture2.png')",
                    borderImageSlice: 30,
                    borderImageRepeat: "round",
                } : {}}
            >
                <div className={"overflow-y-auto p-2 overflow-x-hidden"}>
                    {messages.length === 0 ? (
                        <p className={`text-[20px] ${yesteryear.className}`}>Silence was louder than words...</p>
                    ) : (
                        <div className={"flex items-center gap-2"}>
                            <Image src={lastMessage?.userImage ?? "/images/dragon.png"} alt={lastMessage?.username ?? "Unknown"}
                                   height={32} width={32} className={"h-6 w-6 object-content overflow-hidden rounded-full transition-all transform"}/>
                            <p><strong>{lastMessage?.username}:</strong> {lastMessage?.content}</p>
                        </div>
                    )}
                    <div ref={bottomRef}/>
                </div>
            </div>
            <div
                className={`absolute ${mode === "EXPANDED" ? "opacity-100 h-[390px]" : "opacity-0 pointer-events-none h-[50px]"} ${page && getPageStyle(page, true)} transition-all duration-300 ease-in-out fixed w-full max-w-lg mx-auto z-[48]`}
                style={page === "LoveInHeart" ? {
                    borderWidth: "8px",
                    borderStyle: "solid",
                    borderImageSource: "url('/images/wood_texture2.png')",
                    borderImageSlice: 30,
                    borderImageRepeat: "round"
                } : {}}
            >
                <h1 className={"flex justify-center items-center text-center w-full border-b-2 rounded-[10] font-[700]"}>
                    {currentRoom && (
                        <RoomDisplay
                            room={currentRoom}
                            currentUserId={userRef.current?.userId}
                        />
                    )}
                </h1>
                <div className={`flex flex-col relative`}>
                    <div className={`${(!roomCreation && !list) ? "opacity-100 " : "opacity-0 pointer-events-none"} h-64 overflow-y-auto p-2 mb-2 overflow-x-hidden flex flex-col gap-1`}>
                        {messages.map(msg => (
                            <div key={msg.id} className={"flex items-center gap-2"}>
                                <h1 className={"flex flex-col gap-1"}
                                    onClick={() => {
                                        if (!input.includes(msg.username)) {
                                            setInput(`@${msg.username}`)
                                        }
                                    }}
                                    onDoubleClick={() => {
                                        setLoading(true)
                                        if(msg.userId === session?.user?.id) {
                                            router.push(`/profile`)
                                        }
                                        else {
                                            router.push(`/profile/${msg.userId}`)
                                        }
                                    }}
                                >
                                    <div className={"flex flex-row gap-1"}>
                                        <Image
                                            onClick={() => {
                                                if (!input.includes(msg.username)) {
                                                    setInput(`@${msg.username}`)
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                setLoading(true)
                                                if(msg.userId === session?.user?.id) {
                                                    router.push(`/profile`)
                                                }
                                                else {
                                                    router.push(`/profile/${msg.userId}`)
                                                }
                                            }}
                                            src={msg.userImage ?? "/images/dragon.png"} alt={msg.username}
                                            height={24} width={24}
                                            className={"object-content rounded-full hover:scale-110 hover:opacity-50 transition-all transform duration-100 ease-in-out"}/>
                                        <p className={"hover:scale-102 hover:opacity-50 font-[700] duration-100 ease-in-out"}>
                                            {msg.username}:
                                        </p>
                                        <MessageContent content={msg.content}/>
                                    </div>
                                    <Embed message={msg.content}/>
                                </h1>
                            </div>
                        ))}
                        <div ref={bottomRef}/>
                    </div>
                    <div className={`${(!roomCreation && !list) ? "opacity-100 " : "opacity-0 pointer-events-none"} flex items-center justify-center w-full`}>
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
                    <div className={`absolute inset-0 z-[1] flex flex-col gap-2 items-center p-2 ${roomCreation ? "opacity-100 " : "opacity-0 pointer-events-none"} duration-300 ease-in-out`}>
                        <div className={`duration-300 ease-in-out flex flex-col justify-between ${page && getPageStyle(page, true)}`}>
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => {
                                        setSelectedUsers(prev =>
                                            prev.includes(user)
                                                ? prev.filter(u => u.id !== user.id)
                                                : [...prev, user]
                                        )
                                    }}
                                    className={`
                                    flex flex-row gap-2 items-center cursor-pointer p-1 rounded duration-200 ease-in-out hover:bg-pink-600/40
                                    ${selectedUsers.includes(user) ? "bg-pink-400/40" : ""}
                                `}
                                >
                                    <Image src={user.image ?? "/images/dragon.png"} alt={user.name} height={32} width={32} className={"object-content rounded-full"}/>
                                    <h1 className={"font-[700]"}>
                                        {user.name}
                                    </h1>
                                </div>
                            ))}
                        </div>
                        <div className={"flex flex-row gap-2"}>
                            {selectedUsers.length > 1 && (
                                <input
                                    value={roomName}
                                    onChange={e => setRoomName(e.target.value)}
                                    placeholder="Room name"
                                    className={`${page && getPageStyle(page)} p-1 mt-2`}
                                />
                            )}
                            <button
                                className={`absolute rounded-[10] active:scale-105 hover:scale-102 -bottom-14 left-1/2 -translate-x-[50%] p-2 ${page && getPageStyle(page)} ${page === "Casino" && "bg-black"} transform duration-300 ease-in-out`}
                                onClick={newRoom}>
                                <MessageSquarePlus/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`absolute inset-0 ${list ? "opacity-100 " : "opacity-0 pointer-events-none"} gap-2 duration-300 ease-in-out flex flex-col`}>
                    {rooms.map(room => (
                        <div
                            onClick={() => {
                                setCurrentRoom(room)
                                setList(false)
                            }}
                            key={room.id} className={`flex flex-row justify-center items-center text-center gap-2 rounded-[10] font-[700] duration-200 ease-in-out w-full ${page && getPageStyle(page)}`}>
                            <h1>
                                <RoomDisplay
                                    room={room}
                                    currentUserId={userRef.current?.userId}
                                />
                            </h1>
                        </div>
                    ))}
                    <div onClick={() => {
                        setRoomCreation(true)
                        setList(false)
                    }} className={`flex flex-row justify-center items-center text-center gap-2 w-full rounded-[10] duration-200 ease-in-out font-[700] ${page && getPageStyle(page)}`}>
                        <Plus/>
                    </div>
                </div>
                <div className={"flex flex-row justify-between"}>
                    <button onClick={sendMessage}
                            className={`${(!roomCreation && !list) ? "opacity-100 " : "opacity-0 pointer-events-none"} m-2 p-2 rounded-[10] transform duration-300 ease-in-out ${page && getPageStyle(page)}`}>
                        <Send/>
                    </button>
                    <button
                        onClick={() => {
                            if(roomCreation) {
                                setRoomCreation(false)
                                return
                            }
                            if(list){
                                setList(false)
                            }
                            else {
                                setList(true)
                            }
                        }}
                        className={`z-[50] m-2 p-2 rounded-[10] transform duration-300 ease-in-out ${page && getPageStyle(page)}`}>
                        <List/>
                    </button>
                </div>
            </div>
        </div>
    )
}