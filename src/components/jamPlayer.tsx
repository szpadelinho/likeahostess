import {Play, Pause, StepBack, StepForward, Disc3} from "lucide-react"
import {useEffect, useState} from "react";
import ReactPlayer from "react-player";

interface Jam {
    id: string
    title: string
    media: string
}

interface Props {
    jams: Jam[]
    isJamPlaying: boolean
    setIsJamPlaying: (isJamPlaying: boolean) => void
}

const JamPlayer = ({jams, isJamPlaying, setIsJamPlaying}: Props) => {
    const [currentTrack, setCurrentTrack] = useState(0)
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % jams.length)
        setIsJamPlaying(true)
    }

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + jams.length) % jams.length)
        setIsJamPlaying(true)
    }

    return(
        <div className={"absolute text-white z-49 top-5 right-5 flex justify-center items-center flex-row text-[15px] bg-pink-950 p-3 rounded-[20] gap-5 transition duration-200 ease-in-out opacity-30 hover:opacity-100"} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
            <div
                 className={"flex bg-red-950 justify-center items-center flex-row border-white border-2 rounded-[15] p-2 transition duration-200 ease-in-out"}>
                <p className={"w-80 flex flex-row justify-center items-center gap-2 font-[600]"}>
                    <Disc3 className={`transition-transform ${isJamPlaying ? "spin" : ""}`}/> {jams[currentTrack].title}
                </p>
            </div>
            <button onClick={prevTrack} className={"hover:text-pink-200 transition duration-200 ease-in-out scale-100 hover:scale-110"}>
                <StepBack/>
            </button>
            <button onClick={() => setIsJamPlaying(!isJamPlaying)} className="hover:text-pink-200 transition duration-200 ease-in-out scale-100 hover:scale-110">
                {isJamPlaying ? <Pause/> : <Play/>}
            </button>
            <button onClick={nextTrack} className={"hover:text-pink-200 transition duration-200 ease-in-out scale-100 hover:scale-110"}>
                <StepForward/>
            </button>
            <ReactPlayer
                src={`https://youtube.com/embed/${jams[currentTrack].media}?autoplay=1`}
                playing={isJamPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                onEnded={nextTrack}
            />
        </div>
    )
}

export default JamPlayer