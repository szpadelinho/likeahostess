import {X} from "lucide-react";
import {useState} from "react";
import ReactPlayer from 'react-player';

interface Activity {
    id: string
    name: string
    popularityGain: number
    cost: number
    media: string
    performerId: string
}

interface Props {
    selectedActivity: Activity | null
    onCloseModal: () => void
    setIsJamPlaying: (isJamPlaying: boolean) => void
    jamToggle: boolean | null
}

const VideoWindow = ({selectedActivity, onCloseModal, setIsJamPlaying, jamToggle}: Props) => {
    const [hover, setHover] = useState(false)

    return (
        <>
            <ReactPlayer src={`https://youtube.com/embed/${selectedActivity?.media}?autoplay=1`} height={840}
                    width={1493} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 25px rgba(0,0,0,0.4)' }} autoPlay={true} controls={false}
                    onEnded={() => {
                        onCloseModal()
                        if(jamToggle !== null){
                            setIsJamPlaying(jamToggle)
                        }
                    }}/>
            <button onClick={() => {
                onCloseModal()
                if(jamToggle !== null){
                    setIsJamPlaying(jamToggle)
                }
            }}
                    className={"absolute top-[0] -right-35 hover:cursor-pointer border-white border-2 rounded-[10] p-1 text-white hover:bg-white hover:text-black transition duration-200 ease-in-out hover:"}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
            >
                <X size={35} color={hover ? "black" : "white"} strokeWidth={3}/>
            </button>
        </>
    )
}

export default VideoWindow