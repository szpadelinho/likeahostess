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
        </>
    )
}

export default VideoWindow