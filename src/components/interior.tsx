import React from "react";
import {Armchair} from "lucide-react";

const Interior = () => {
    const items = Array(6).fill(null)

    return (
        <div className="w-screen h-full flex justify-center items-center p-10 text-white">
            <div className="grid grid-cols-6 gap-6">
                {items.map((_, i) => (
                    <div key={i} className="flex space-x-4 justify-center items-center bg-pink-700 p-4 rounded-lg">
                        <Armchair/>
                        <Armchair/>
                    </div>
                ))}
                {items.map((_, i) => (
                    <div key={i} className="flex space-x-4 justify-center items-center bg-pink-700 p-4 rounded-lg">
                        <Armchair/>
                        <Armchair/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Interior