import Image from "next/image";

const CHIP_DENOMINATIONS = [
    { value: 10000, src: "ten" },
    { value: 9000, src: "nine" },
    { value: 8000, src: "eight" },
    { value: 7000, src: "seven" },
    { value: 6000, src: "six" },
    { value: 5000, src: "five" },
    { value: 4000, src: "four" },
    { value: 3000, src: "three" },
    { value: 2000, src: "two" },
    { value: 1000, src: "one" },
]

interface ChipContainerProps {
    amount: number
}

export const ChipContainer = ({amount} : ChipContainerProps) => {
    if(amount <= 0) return null

    let remaining = Math.round(amount / 1000) * 1000
    const chipsToRender: string[] = []

    for(const chip of CHIP_DENOMINATIONS){
        while(remaining >= chip.value){
            chipsToRender.push(chip.src)
            remaining -= chip.value
        }
    }

    return(
        <div className={"flex flex-row items-center justify-center"}>
            {chipsToRender.map((src, i) => (
                <div key={i} style={{bottom: `${i * 4}px`, zIndex: i}} className={`${i === 0 ? "" : "-ml-15"}`}>
                    <Image src={`/chips/${src}.png`} alt={`Chip ${i}`} height={40} width={40} />
                </div>
            ))}
        </div>
    )
}