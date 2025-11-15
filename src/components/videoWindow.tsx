import ReactPlayer from 'react-player';
import {Activity} from "@/app/types";

interface Props {
    selectedActivity: Activity | null
    onCloseModal: () => void
    setIsJamPlaying: (isJamPlaying: boolean) => void
    jamToggle: boolean | null
}

const VideoWindow = ({selectedActivity, onCloseModal, setIsJamPlaying, jamToggle}: Props) => {
    return (
        <ReactPlayer src={`https://youtube.com/embed/${selectedActivity?.media}?autoplay=1`} height={840}
                     width={1493} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 25px rgba(0,0,0,0.4)' }} autoPlay={true} controls={false}
                     onEnded={() => {
                         onCloseModal()
                         if(jamToggle !== null){
                             setIsJamPlaying(jamToggle)
                         }
                     }}/>
    )
}

export default VideoWindow