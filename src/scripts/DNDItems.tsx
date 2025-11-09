import {useDrag, useDrop} from 'react-dnd';
import {iconConverter} from "@/scripts/iconConverter";
import {BuffetType} from "@prisma/client";
import {Dispatch, ReactNode, SetStateAction, useRef, useState} from "react";
import {BookUser, DoorClosed, DoorOpen, Meh} from "lucide-react";

interface Buffet {
    id: string
    name: string
    price: number
    description: string
    type: BuffetType
    icon: string
}

interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
}

interface DroppableSlotsProps{
    type: 'beverage' | 'meal'
    onDrop: (id: string, correct: boolean) => void
    children: ReactNode
    expectedId: string
}

interface DraggableDoorProps{
    waitingClient: boolean
}

interface DroppableClientProps {
    index: number
    clients: boolean[]
    setClients: Dispatch<SetStateAction<boolean[]>>
    hostesses: (Hostess | null)[]
    setSelectedClient: Dispatch<SetStateAction<boolean>>
    InquiryHandler: (i: number, type: "Service" | "Buffet" | "End" | null, status: boolean) => void
    wiggleClient: boolean[]
    setWaitingClient: Dispatch<SetStateAction<boolean>>
}

interface DragItem {
    id: number
    type: 'client'
}


export const DraggableItem = ({ item, type }: { item: Buffet; type: 'beverage' | 'meal' }) => {
    const Icon = iconConverter(item.icon)

    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: { id: item.id, icon: <Icon size={50}/> },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }))

    const buttonRef = useRef<HTMLButtonElement>(null)
    drag(buttonRef)

    return (
        <button
            ref={buttonRef}
            className={`flex justify-center items-center rounded-[10] border-pink-100 text-pink-100 border-2 p-2 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-pink-900 ${
                isDragging ? 'opacity-50' : 'opacity-100'
            }`}
        >
            <Icon size={30} />
        </button>
    )
}

export const DroppableSlot = ({type, onDrop, children, expectedId}: DroppableSlotsProps) => {
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [droppedChild, setDroppedChild] = useState<ReactNode | null>(null)

    const [{ isOver }, drop] = useDrop(() => ({
        accept: type,
        drop: (item: { id: string, icon: ReactNode }) => {
            const correct = item.id === expectedId
            if(correct){
                setStatus('correct')
                setDroppedChild(item.icon)
            }
            else{
                setStatus('wrong')
                setTimeout(() => setStatus('idle'), 500)
            }
            onDrop(item.id, correct)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }))

    const buttonRef = useRef<HTMLButtonElement>(null)
    drop(buttonRef)

    const colorStatus = status === 'correct'
        ? 'bg-pink-400 text-pink-950'
        : status === "wrong"
            ? 'bg-red-600'
            : isOver
                ? 'bg-pink-900 scale-110'
                : 'bg-pink-950'

    return (
        <button
            ref={buttonRef}
            className={`border-2 p-5 rounded-[15] transition-all duration-300 hover:scale-110 ease-in-out ${colorStatus}`}>
            {status === 'correct' ? droppedChild : children}
        </button>
    )
}

export const DraggableDoor = ({waitingClient} : DraggableDoorProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'client',
        item: { id: -1, type: 'client' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }))

    const buttonRef = useRef<HTMLButtonElement>(null)
    drag(buttonRef)

    return (
        <button
            ref={buttonRef}
            className={`absolute flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-pink-400 border-2 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120 z-49 ${
                waitingClient ? 'bg-red-950 text-pink-500 hover:bg-pink-950 hover:text-pink-700 active:text-pink-500 active:bg-pink-900' : 'bg-pink-900 text-pink-400 hover:bg-pink-800 hover:text-pink-500 active:text-pink-300 active:bg-pink-700'
            } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            {waitingClient ? <DoorOpen size={50}/> : <DoorClosed size={50}/>}
        </button>
    )
}

export const DroppableClient = ({
                                    index,
                                    clients,
                                    setClients,
                                    hostesses,
                                    setSelectedClient,
                                    InquiryHandler,
                                    wiggleClient,
                                    setWaitingClient
                                }: DroppableClientProps) => {
    const [{ isOver, canDrop }, drop] = useDrop<{id: number, type: "client"}, void, { isOver: boolean; canDrop: boolean }>({
        accept: 'client',
        drop: (item) => {
            if (!clients[index]) {
                const updatedClients = [...clients]
                updatedClients[index] = true
                setClients(updatedClients)
                setSelectedClient(false)
                setWaitingClient(false)
                if (hostesses[index]) {
                    InquiryHandler(index, 'Buffet', true)
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const buttonRef = useRef<HTMLButtonElement>(null)
    drop(buttonRef)

    return (
        <>
            <button
                ref={buttonRef}
                className={`flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-white border-2 opacity-70 hover:opacity-100 bg-pink-600 hover:bg-pink-950 transition-all duration-200 ease-in-out transform active:scale-90 hover:shadow-sm hover:shadow-white ${
                    clients[index] ? 'bg-pink-800 opacity-100' : 'bg-pink-700'
                } ${wiggleClient[index] ? '!bg-red-600 scale-120' : 'scale-100'} ${
                    isOver && canDrop ? 'scale-110 bg-pink-900' : ''
                }`}
            >
                {clients[index] ? <Meh size={50} /> : <BookUser size={50} />}
            </button>
        </>
    )
}