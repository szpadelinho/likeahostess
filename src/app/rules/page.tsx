'use client'

import {useEffect, useRef} from "react";
import {redirect} from "next/navigation";

const Rules = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play();
        }
    }, []);

    return(
        <div className={"flex h-screen w-screen items-center justify-center"}>
            <video ref={videoRef} src={"/videos/rules.mp4"} loop={true} autoPlay={true} muted={true} className={"absolute inset-0 w-full h-full object-cover"}/>
            <button onClick={() => {
                redirect("/auth")
            }}
                    className={"absolute bottom-5 right-5 text-[15px] border-white border-2 rounded-[10] p-1 cursor-zoom-in w-50 hover:bg-white hover:text-black text-white transition duration-200 ease-in-out"}>
                I fully understand the rules
            </button>
        </div>
    )
}

export default Rules