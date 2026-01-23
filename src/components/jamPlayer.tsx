import { Jam } from "@/app/types";
import {
    Play,
    Pause,
    StepBack,
    StepForward,
    Disc3,
    AudioWaveform,
    PanelRightClose,
    PanelRightOpen, Volume, VolumeX, Volume1, Volume2, Repeat, Shuffle
} from "lucide-react"
import {useState} from "react";
import ReactPlayer from "react-player";
import {useVolume} from "@/app/context/volumeContext";

interface Props {
    jams: Jam[]
    isJamPlaying: boolean
    setIsJamPlaying: (isJamPlaying: boolean) => void
}

const JamPlayer = ({jams, isJamPlaying, setIsJamPlaying}: Props) => {
    const [currentTrack, setCurrentTrack] = useState(0)
    const [hidden, setHidden] = useState<boolean>(false)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const {volume, setVolume} = useVolume()
    const [loop, setLoop] = useState<boolean>(false)
    const [shuffle, setShuffle] = useState<boolean>(false)

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    const nextTrack = () => {
        if(loop){
            return
        }
        else{
            if(shuffle){
                setCurrentTrack(Math.floor(Math.random() * jams.length))
            }
            else{
                setCurrentTrack((prev) => (prev + 1) % jams.length)
            }
            setIsJamPlaying(true)
        }
    }

    const prevTrack = () => {
        if(loop){
            return
        }
        else{
            setCurrentTrack((prev) => (prev - 1 + jams.length) % jams.length)
            setIsJamPlaying(true)
        }
    }

    return(
        <div className={`absolute text-pink-200 z-49 top-5 right-5 ${hidden && "translate-x-180"} transform flex justify-center items-center flex-row text-[15px] bg-pink-950 p-3 rounded-[20] gap-5 transition-all duration-500 opacity-30 hover:opacity-100`} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
            <button className={"hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-115 scale-100 hover:scale-110"} onClick={() => setHidden(!hidden)}>
                {!hidden ? <PanelRightClose/> : <PanelRightOpen/>}
            </button>
            <div
                className={"flex bg-rose-950 hover:bg-red-950 active:bg-pink-700 hover:scale-105 active:scale-95 hover:bg-pink justify-center items-center flex-row border-pink-200 border-2 rounded-[15] p-2 transition duration-200 ease-in-out"}
                onClick={() => {
                    navigator.clipboard.writeText(`https://youtube.com/watch/${jams[currentTrack].media}?autoplay=1`)
                        .then(() => console.log("Successfully copied the URL"))
                }}>
                <div className={"w-100 flex flex-row justify-center items-center gap-3 font-[600]"}>
                    <Disc3 className={`transition-transform ${isJamPlaying ? "spin" : ""}`}/>
                    {jams[currentTrack].title}
                    <div className={"flex justify-center items-center gap-1 text-[12px] text-pink-300 ml-5"}>
                        <p>{formatTime(currentTime)}</p>
                        <p><AudioWaveform size={15}/></p>
                        <p>{formatTime(duration)}</p>
                    </div>
                </div>
            </div>
            <button onClick={() => {setLoop(!loop)}} className={`${loop && "!text-pink-500"} hover:text-pink-300 transition duration-200 ease-in-out scale-100 hover:scale-110`}>
                <Repeat/>
            </button>
            <button onClick={() => {setShuffle(!shuffle)}} className={`${shuffle && "!text-pink-500"} hover:text-pink-300 transition duration-200 ease-in-out scale-100 hover:scale-110`}>
                <Shuffle/>
            </button>
            <div className={"flex justify-center items-center group relative"}>
                <button
                    className={"active:text-pink-500 hover:text-pink-300 transition duration-200 ease-in-out scale-100 hover:scale-110 active:scale-120"}
                    onClick={() => {
                    if(volume === 0) {
                        setVolume(100)
                    }
                    else {
                        setVolume(0)
                    }
                }}>
                    {volume === 0 && <VolumeX/>}
                    {volume > 0 && volume < 34 && <Volume/>}
                    {volume > 33 && volume < 67 && <Volume1/>}
                    {volume > 66 && <Volume2/>}
                </button>
                <div className={"absolute duration-300 ease-in-out pl-2 flex justify-center items-center h-5 bg-pink-950 -right-34 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none z-50"}>
                    <input className={"accent-pink-600"} type={"range"} value={volume} min={0} max={100} onChange={(e) => {setVolume(parseInt(e.target.value))}}/>
                </div>
            </div>
            <button onClick={prevTrack} className={"hover:text-pink-300 transition duration-200 ease-in-out transform active:-translate-x-3 active:text-pink-500 scale-100 hover:scale-110"}>
                <StepBack/>
            </button>
            <button onClick={() => setIsJamPlaying(!isJamPlaying)} className="hover:text-pink-300 transition duration-200 ease-in-out scale-100 hover:scale-110 transform active:text-pink-500 active:scale-130">
                {isJamPlaying ? <Pause/> : <Play/>}
            </button>
            <button onClick={nextTrack} className={"hover:text-pink-300 transition duration-200 ease-in-out transform active:translate-x-3 active:text-pink-500 scale-100 hover:scale-110"}>
                <StepForward/>
            </button>
            <ReactPlayer
                key={currentTrack}
                src={`https://youtube.com/embed/${jams[currentTrack].media}?autoplay=1`}
                playing={isJamPlaying}
                controls={false}
                autoPlay={true}
                muted={volume === 0}
                loop={loop}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                volume={volume / 100}
                onEnded={nextTrack}
                onReady={() => setIsJamPlaying(true)}
                onTimeUpdate={(time) => setCurrentTime(time.currentTarget.currentTime)}
                onDurationChange={(duration) => setDuration(duration.currentTarget.duration)}
            />
        </div>
    )
}

export default JamPlayer