import React from "react";

const MainWrapper = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <div
                className="w-screen h-screen bg-pink-900 bg-opacity-90 justify-between flex-col flex overflow-hidden">
                {children}
            </div>
            <div className={"absolute top-0 h-18 w-screen z-[1] bg-gradient-to-t from-pink-900 to-black/50"}/>
            <div className={"absolute bottom-0 h-50 w-screen z-[1] bg-gradient-to-b from-pink-900 to-black/50"}/>
        </>
    );
};

export default MainWrapper