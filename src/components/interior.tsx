import React from "react";
import Image from "next/image";

const Interior = () => {
    const items = Array(6).fill(null)

    return (
        <div className="w-screen h-full flex justify-center items-center p-10 text-white">
            <div className="grid grid-cols-6 gap-10 h-full w-full">
                {items.map((_, i) => (
                    <div key={i}
                         className="flex space-x-4 justify-center items-center bg-[radial-gradient(ellipse_at_center,_rgba(163,0,76,1)_50%,_rgba(134,16,67,1)_75%,_rgba(134,16,67,1)_100%)] p-4 rounded-lg">
                        <Image
                            src={"/images/position_empty.png"}
                            alt={"Meeting position"}
                            height={424}
                            width={528}
                        />
                    </div>
                ))}
                {items.map((_, i) => (
                    <div key={i}
                         className="flex space-x-4 justify-center items-center bg-[radial-gradient(ellipse_at_center,_rgba(163,0,76,1)_50%,_rgba(134,16,67,1)_75%,_rgba(134,16,67,1)_100%)] p-4 rounded-lg">
                        <Image
                            src={"/images/position_empty.png"}
                            alt={"Meeting position"}
                            height={424}
                            width={528}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Interior