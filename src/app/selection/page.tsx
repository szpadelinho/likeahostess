'use client'

import {useState} from "react";
import {ChevronsLeft, ChevronsRight} from "lucide-react";
import Image from "next/image";

const Selection = () => {
    const items = [1, 2, 3, 4, 5, 6]
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    }

    return (
        <div className={"flex justify-center content-center w-screen h-screen flex-row"}>
            <div className={"flex flex-1/10 content-center items-center justify-start m-5"}>
                <button className={"border-white border-2 rounded-[5] p-1 text-white"} onClick={prev}>
                    <ChevronsLeft/>
                </button>
            </div>
            <div className={"flex flex-8/10 content-center items-center justify-center flex-col"}>
                <div className={"flex transform translate-y-[50%]"}>
                    <img
                        src={"https://static.wikia.nocookie.net/yakuza/images/1/13/Club_Elise_Exterior_1.jpg"}
                        alt={"Club exterior"}
                        width={"400px"}
                    />
                </div>
                <div className={"flex transform translate-x-[-60%] translate-y-[-20%]"}>
                    <img
                        src={"https://img.favpng.com/20/14/5/shun-akiyama-yakuza-5-yakuza-6-kazuma-kiryu-png-favpng-CLJDhQGpK6UGZatJ7L7bfQe5d.jpg"}
                        alt={"Host"}
                        height={"500px"}
                        width={"300px"}
                    />
                </div>
                <div
                    className={"flex transform translate-y-[-140%] flex-col text-center justify-center rounded-[5] bg-pink-500 h-1/8 w-1/2"}>
                    <h1>Opis</h1>
                    <h2>{items[currentIndex]}</h2>
                </div>
            </div>
            <div className={"flex flex-1/10 content-center items-center justify-end m-5"}>
                <button className={"border-white border-2 rounded-[5] p-1 text-white"} onClick={next}><ChevronsRight/>
                </button>
            </div>
        </div>
    )
}

export default Selection;