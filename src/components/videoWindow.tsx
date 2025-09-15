import {X} from "lucide-react";
import {useState} from "react";

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
}

const VideoWindow = ({selectedActivity, onCloseModal}: Props) => {
    const [hover, setHover] = useState(false)

    return (
        <>
            <iframe src={`https://youtube.com/embed/${selectedActivity?.media}?autoplay=1`} className={"flex rounded-[20]"} height={840}
                    width={1493} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}} referrerPolicy="strict-origin-when-cross-origin"/>
            <button onClick={() => {
                onCloseModal()
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