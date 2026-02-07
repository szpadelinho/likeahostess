import {useDrag, useDrop} from 'react-dnd';
import {iconConverter} from "@/scripts/iconConverter";
import {Dispatch, ReactNode, SetStateAction, useMemo, useRef, useState} from "react";
import {
    Annoyed, ConciergeBell,
    BookUser, Box,
    Droplet,
    EyeClosed, Flame,
    HeartPlus,
    Laugh, LucideIcon, Martini,
    Meh,
    Smile, Snowflake, Sun, SunMoon,
    VenetianMask
} from "lucide-react";
import Image from "next/image";
import {Hostess, WindowType, Buffet, Client, clientMugshots} from "@/app/types";

interface DroppableSlotsProps {
    type: 'beverage' | 'meal'
    onDrop: (id: string, correct: boolean) => void
    children: ReactNode
    expectedId: string
}

interface DraggableDoorProps {
    waitingClient: boolean
}

interface DroppableClientProps {
    index: number,
    clients: (Client | null)[],
    setClients: Dispatch<SetStateAction<(Client | null)[]>>,
    hostesses: (Hostess | null)[],
    InquiryHandler: (i: number, type: "Service" | "Buffet" | "End" | null, status: boolean) => void,
    setWaitingClient: Dispatch<SetStateAction<boolean>>,
    inquiryType: ("Service" | "Buffet" | "End" | null)[],
    attractiveness?: number
}

interface DraggableHostessProps {
    hostess: Hostess
    source: "management" | "panel"
    selectedHostess?: Hostess | null
    setSelectedHostess?: (hostess: Hostess | null) => void
}

interface DroppableHostessSlotProps {
    index: number
    hostesses: (Hostess | null)[]
    setHostesses: (value: (Hostess | null)[]) => void
    setHostessesManagement: (fn: (prev: Hostess[]) => Hostess[]) => void
    selectedHostess: Hostess | null
    setSelectedHostess: (h: Hostess | null) => void
    setWindow: (
        value:
            | WindowType
            | ((prevState: WindowType) => WindowType)
    ) => void
}

interface DroppableHostessTableSlotProps {
    index: number,
    hostessAtTable: Hostess | null,
    setHostesses: (value: (Hostess | null)[]) => void,
    hostesses: (Hostess | null)[],
    setHostessesPanel: Dispatch<SetStateAction<(Hostess | null)[]>>,
    wiggleHostess: boolean[],
    setWiggleHostess: (value: boolean[]) => void,
    clients: (Client | null)[],
    inquiryType: ("Service" | "Buffet" | "End" | null)[],
    InquiryHandler: (i: number, type: ("Service" | "Buffet" | "End" | null), status: boolean) => void
}

export const DraggableItem = ({item, type}: { item: Buffet; type: 'beverage' | 'meal' }) => {
    const Icon = iconConverter(item.icon)

    const [{isDragging}, drag] = useDrag(() => ({
        type,
        item: {id: item.id, icon: <Icon size={50}/>},
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
            <Icon size={30}/>
        </button>
    )
}

export const DroppableSlot = ({type, onDrop, children, expectedId}: DroppableSlotsProps) => {
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [droppedChild, setDroppedChild] = useState<ReactNode | null>(null)

    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: type,
        drop: (item: { id: string, icon: ReactNode }) => {
            const correct = item.id === expectedId
            if (correct) {
                setStatus('correct')
                setDroppedChild(item.icon)
            } else {
                setStatus('wrong')
                setTimeout(() => setStatus('idle'), 500)
            }
            onDrop(item.id, correct)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
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
                : 'bg-pink-950/70'

    return (
        <button
            ref={buttonRef}
            className={`border-2 ${canDrop && "border-dotted"} p-5 rounded-[15] transition-all duration-300 hover:scale-110 ease-in-out ${colorStatus}`}>
            {status === 'correct' ? droppedChild : children}
        </button>
    )
}

export const DraggableDoor = ({waitingClient}: DraggableDoorProps) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'client',
        item: {id: -1, type: 'client'},
        canDrag: waitingClient,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [waitingClient])

    const buttonRef = useRef<HTMLButtonElement>(null)
    drag(buttonRef)

    const image = useMemo(() => {
        return clientMugshots[
            Math.floor(Math.random() * clientMugshots.length)
            ]
    }, [])

    return (
        <button
            ref={buttonRef}
            className={`absolute flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-pink-400 border-2 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120 z-49 ${
                waitingClient ? 'bg-red-950 text-pink-500 hover:bg-pink-950/70 hover:text-pink-700 active:text-pink-500 active:bg-pink-900' : 'bg-pink-900 text-pink-400 hover:bg-pink-800 hover:text-pink-500 active:text-pink-300 active:bg-pink-700'
            } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            {waitingClient ? <Image className={"rounded-[20]"} src={`/images/${image}`} alt={"Client mugshot"} fill={true}/> : <ConciergeBell size={50}/>}
        </button>
    )
}

export const DroppableClient = ({
                                    index,
                                    clients,
                                    setClients,
                                    hostesses,
                                    InquiryHandler,
                                    setWaitingClient,
                                    inquiryType,
                                    attractiveness
                                }: DroppableClientProps) => {
    const [{isOver, canDrop}, drop] = useDrop<{ id: number, type: "client" }, void, {
        isOver: boolean;
        canDrop: boolean
    }>({
        accept: 'client',
        drop: () => {
            if (!clients[index]) {
                const updatedClients = [...clients]
                updatedClients[index] = {present: true, expectedAttractiveness: Math.round(Math.random() * 6)}
                setClients(updatedClients)
                setWaitingClient(false)
                if (hostesses[index] !== null && inquiryType[index] !== "Buffet") {
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

    const calculateAttractivenessIcon = (value?: number) => {
        if(value === undefined) return
        let Icon: LucideIcon
        switch(value){
            case 0:
                Icon = Box
                break
            case 1:
                Icon = Snowflake
                break
            case 2:
                Icon = Droplet
                break
            case 3:
                Icon = SunMoon
                break
            case 4:
                Icon = Sun
                break
            case 5:
                Icon = Flame
                break
            default:
                Icon = Martini
        }
        return (
            <p className={"absolute text-pink-200 pointer-events-none"}>
                <Icon size={50}/>
            </p>
        )
    }

    const renderIcons = () => {
        let content
        if (!clients[index]) {
            content = <BookUser size={50} />
        } else if (clients[index] && !hostesses[index]) {
            content = calculateAttractivenessIcon(clients[index].expectedAttractiveness)
        } else if (clients[index] && hostesses[index]) {
            const expected = clients[index].expectedAttractiveness
            if (attractiveness && expected > attractiveness) {
                content = <Meh size={50} />
            } else if (expected === attractiveness) {
                content = <Smile size={50} />
            } else {
                content = <Laugh size={50} />
            }
        }

        return content
    }

    return (
        <button
            ref={buttonRef}
            className={`flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-pink-200 hover:border-pink-400 hover:text-pink-400 border-2 opacity-70 hover:opacity-100 bg-pink-600 hover:bg-pink-950/70 transition-all duration-200 ease-in-out transform active:scale-90 ${
                clients[index] ? 'bg-pink-800 opacity-100' : 'bg-pink-700'
            } ${
                isOver && canDrop ? 'scale-110 bg-pink-900' : ''
            }
            ${canDrop && "border-dotted"}`}
        >
            {renderIcons()}
        </button>
    )
}

export const DraggableHostess = ({hostess, source, selectedHostess, setSelectedHostess}: DraggableHostessProps) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: "hostess",
        item: {hostess, source},
        canDrag: hostess.fatigue < 100,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }))

    const buttonRef = useRef<HTMLButtonElement>(null)
    drag(buttonRef)

    return (
        <button
            ref={buttonRef}
            onClick={() => {
                if (!setSelectedHostess) return
                if (selectedHostess?.id === hostess.id) {
                    setSelectedHostess(null)
                } else {
                    setSelectedHostess(hostess)
                }
            }}
            className={`flex justify-center items-center rounded-[20] cursor-pointer transition-all transform duration-300 hover:scale-105 ${
                selectedHostess?.id === hostess.id && "!bg-violet-950"
            }${
                isDragging ? "opacity-50 !scale-90" : "opacity-100"
            } ${
                source === "management"
                    ? "border-pink-400 bg-pink-950/70/50 hover:bg-pink-900 border-2"
                    : "bg-pink-800 hover:bg-pink-900"
            }
            ${
                hostess.fatigue >= 100 && "opacity-50 mix-blend-color-burn"
            }`}
        >
            <Image
                src={hostess.image}
                alt={hostess.name}
                width={100}
                height={100}
                className="rounded-[18]"
            />
        </button>
    )
}

export const DroppableHostessSlot = ({
                                         index,
                                         hostesses,
                                         setHostesses,
                                         setHostessesManagement,
                                         setWindow,
                                     }: DroppableHostessSlotProps) => {
    const hostess = hostesses[index]

    const [{isOver, canDrop}, drop] = useDrop<
        { hostess: Hostess; source: "management" | "panel" },
        void,
        { isOver: boolean; canDrop: boolean }
    >({
        accept: "hostess",
        canDrop: (item) => {
            return (
                item != null &&
                typeof item === "object" &&
                "hostess" in item &&
                item.hostess != null &&
                typeof item.hostess.id !== "undefined"
            )
        },
        drop: (item) => {
            const updated = [...hostesses]
            const target = hostesses[index]

            if (target) {
                setHostessesManagement((prev) => {
                    if (!prev.find((h) => h.id === target.id)) return [...prev, target]
                    return prev
                })
            }

            updated[index] = item.hostess
            setHostesses(updated)

            if (item.source === "panel") {
                const oldIndex = hostesses.findIndex((h) => h?.id === item.hostess.id)
                if (oldIndex !== -1 && oldIndex !== index) {
                    updated[oldIndex] = null
                    setHostesses(updated)
                }
            }

            if (item.source === "management") {
                setHostessesManagement((prev) => prev.filter((h) => h.id !== item.hostess.id))
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!hostess) return
        const updated = [...hostesses]
        updated[index] = null
        setHostesses(updated)
        setHostessesManagement((prev) =>
            [...prev, hostess].sort((a, b) => Number(a.id) - Number(b.id))
        )
    }

    const divRef = useRef<HTMLDivElement>(null)
    drop(divRef)

    return (
        <div
            ref={divRef}
            className={`relative flex justify-center items-center bg-pink-800 rounded-[20] border-pink-200 hover:border-pink-400 hover:text-pink-400 text-pink-200 border-2 ${canDrop && "border-dotted"} transition duration-200 ease-in-out transform active:scale-105 ${
                isOver && canDrop ? "bg-pink-900 scale-105" : ""
            }`}
        >
            {hostess ? (
                <div className="flex justify-center items-center flex-col">
                    <DraggableHostess hostess={hostess} source="panel"/>
                    <button
                        onClick={handleRemove}
                        className="absolute bottom-[-20] flex justify-center items-center bg-pink-900 hover:bg-pink-950 transition duration-200 ease-in-out rounded-[7] h-[25px] w-[50px] transform active:scale-110"
                    >
                        <EyeClosed size={20}/>
                    </button>
                </div>
            ) : (
                <button
                    className={`flex justify-center items-center rounded-[17] transform active:scale-105 w-[100px] h-[100px] ${
                        hostess
                            ? "hover:bg-pink-200 hover:text-pink-950"
                            : "hover:bg-pink-900 hover:text-pink-300"
                    } transition duration-300 ease-in-out`}
                    onClick={() => {
                        if (!hostess) setWindow("Management")
                    }}
                >
                    <HeartPlus/>
                </button>
            )}
        </div>
    )
}

export const DroppableHostessTableSlot = ({
                                              hostessAtTable,
                                              setHostesses,
                                              hostesses,
                                              setHostessesPanel,
                                              index,
                                              wiggleHostess,
                                              setWiggleHostess,
                                              clients,
                                              inquiryType,
                                              InquiryHandler
                                          }: DroppableHostessTableSlotProps) => {
    const [{isOver, canDrop}, drop] = useDrop<
        { hostess: Hostess, source: "panel" | "management" }, void, { isOver: boolean, canDrop: boolean }>({
        accept: "hostess",
        canDrop: (item) => {
            return (
                item != null &&
                typeof item === "object" &&
                "hostess" in item &&
                item.hostess != null &&
                typeof item.hostess.id !== "undefined"
            )
        },
        drop: (item) => {
            if (!hostessAtTable) {
                const updated = [...hostesses]
                updated[index] = item.hostess
                setHostesses(updated)

                if (clients[index] && inquiryType[index] !== "Buffet") {
                    InquiryHandler(index, "Buffet", true)
                }

                if (item.source === "panel") {
                    setHostessesPanel((prev) =>
                        prev.map((h) => (h?.id === item.hostess.id ? null : h))
                    )
                }
            } else {
                const newWiggle = [...wiggleHostess];
                newWiggle[index] = true
                setWiggleHostess(newWiggle)
                setTimeout(() => {
                    const reset = [...newWiggle]
                    reset[index] = false
                    setWiggleHostess(reset)
                }, 200)
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const divRef = useRef<HTMLDivElement>(null)
    drop(divRef)

    return (
        <div
            ref={divRef}
            className={`flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-pink-200 hover:border-pink-400 hover:text-pink-400 border-2 ${canDrop && "border-dotted"} opacity-70 hover:opacity-100 bg-pink-600 hover:bg-pink-950/70 transition-all duration-200 ease-in-out transform active:scale-90 ${
                hostesses[index] ? 'bg-pink-800 opacity-100' : 'bg-pink-700'
            } ${wiggleHostess[index] ? '!bg-red-600 scale-120' : 'scale-100'} ${
                isOver && canDrop ? 'scale-110 bg-pink-900' : ''
            }`}
        >
            {hostessAtTable ? (
                <Image
                    src={hostessAtTable.image}
                    alt={hostessAtTable.name}
                    width={100}
                    height={100}
                    className={`rounded-[18]`}
                />
            ) : <VenetianMask size={50}/>}
        </div>
    )
}