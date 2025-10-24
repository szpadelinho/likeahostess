import {
    Play,
    Pause,
    StepBack,
    StepForward,
    Disc3,
    AudioWaveform,
    PanelRightClose,
    PanelRightOpen, Volume, VolumeX, Volume1, Volume2
} from "lucide-react"
import {useState} from "react";
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
    const [hidden, setHidden] = useState<boolean>(false)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const [volume, setVolume] = useState<number>(100)

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % jams.length)
        setIsJamPlaying(true)
    }

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + jams.length) % jams.length)
        setIsJamPlaying(true)
    }

    return(
        <div className={`absolute text-white z-49 top-5 right-5 ${hidden && "translate-x-160"} transform flex justify-center items-center flex-row text-[15px] bg-pink-950 p-3 rounded-[20] gap-5 transition-all duration-500 opacity-30 hover:opacity-100`} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
            <button className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:scale-115 scale-100 hover:scale-110"} onClick={() => setHidden(!hidden)}>
                {!hidden ? <PanelRightClose/> : <PanelRightOpen/>}
            </button>
            <div
                className={"flex bg-red-950 active:scale-105 active:bg-pink-900 justify-center items-center flex-row border-white border-2 rounded-[15] p-2 transition duration-200 ease-in-out"}
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
            <div className={"flex justify-center items-center group relative"}>
                <button
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
                <div className={"absolute duration-200 ease-in-out pl-3 flex justify-center items-center h-5 bg-pink-950 -right-34 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none z-50"}>
                    <input className={"accent-pink-600"} type={"range"} value={volume} min={0} max={100} onChange={(e) => {setVolume(parseInt(e.target.value))}}/>
                </div>
            </div>
            <button onClick={prevTrack} className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-x-3 scale-100 hover:scale-110"}>
                <StepBack/>
            </button>
            <button onClick={() => setIsJamPlaying(!isJamPlaying)} className="hover:text-pink-200 transition duration-200 ease-in-out scale-100 hover:scale-110 transform active:scale-130">
                {isJamPlaying ? <Pause/> : <Play/>}
            </button>
            <button onClick={nextTrack} className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-x-3 scale-100 hover:scale-110"}>
                <StepForward/>
            </button>
            <ReactPlayer
                src={`https://youtube.com/embed/${jams[currentTrack].media}?autoplay=1`}
                playing={isJamPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                volume={volume / 100}
                onEnded={nextTrack}
                onReady={() => setMuted(false)}
                onTimeUpdate={(time) => setCurrentTime(time.currentTarget.currentTime)}
                onDurationChange={(duration) => setDuration(duration.currentTarget.duration)}
            />
        </div>
    )
}

export default JamPlayer