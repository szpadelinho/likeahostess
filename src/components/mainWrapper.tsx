import React from "react";
import Image from "next/image";

const MainWrapper = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <Image src={"/images/interior.png"} alt={"Interior background"} fill={true} className={"object-content opacity-2"}/>
            <div className="w-screen h-screen bg-pink-900 bg-opacity-90 justify-between flex-col flex overflow-hidden">
                {children}
            </div>
            <div className={"absolute top-0 h-25 w-screen z-[1] bg-gradient-to-t from-transparent to-black/50"}/>
            <div className={"absolute bottom-0 h-50 w-screen z-[1] bg-gradient-to-b from-transparent to-black/50"}/>
        </>
    );
};

export default MainWrapper