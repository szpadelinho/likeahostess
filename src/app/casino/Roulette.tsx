import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"

interface RouletteProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    setWin: (value: (((prevState: (0 | 1 | 2)) => (0 | 1 | 2)) | 0 | 1 | 2)) => void
}

const Roulette = forwardRef(function Roulette({setScore, setWin}: RouletteProps, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [spinning, setSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)

    const wheelNumbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
        10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ]
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

    const drawRoulette = (ctx: CanvasRenderingContext2D, angleOffset: number) => {
        const size = ctx.canvas.width
        const radius = size / 2
        const sliceAngle = (2 * Math.PI) / wheelNumbers.length

        ctx.clearRect(0, 0, size, size)
        ctx.save()
        ctx.translate(radius, radius)
        ctx.rotate((angleOffset * Math.PI) / 180)

        wheelNumbers.forEach((num, i) => {
            const startAngle = i * sliceAngle
            const endAngle = startAngle + sliceAngle
            const color =
                num === 0 ? "#0a7d30" : redNumbers.includes(num) ? "#b91c1c" : "#1e1e1e"

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.arc(0, 0, radius, startAngle, endAngle)
            ctx.closePath()
            ctx.fillStyle = color
            ctx.fill()

            const textAngle = startAngle + sliceAngle / 2
            ctx.save()
            ctx.rotate(textAngle)
            ctx.translate(radius * 0.8, 0)
            ctx.rotate(Math.PI / 2)
            ctx.fillStyle = "#fff"
            ctx.font = `20px Yesteryear`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(num.toString(), 0, 0)
            ctx.restore()
        })

        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        ctx.strokeStyle = "#af7000"
        ctx.lineWidth = 5
        ctx.stroke()

        const centerCircleRadius = 100
        ctx.beginPath()
        ctx.arc(0, 0, centerCircleRadius, 0, Math.PI * 2)
        ctx.fillStyle = "#c8a103"
        ctx.fill()
        ctx.strokeStyle = "#af7000"
        ctx.lineWidth = 5
        ctx.stroke()

        const plusThickness = 5
        ctx.fillStyle = "#af7000"
        ctx.fillRect(-centerCircleRadius, -plusThickness / 2, centerCircleRadius * 2, plusThickness)
        ctx.fillRect(-plusThickness / 2, -centerCircleRadius, plusThickness, centerCircleRadius * 2)
        ctx.save(); ctx.rotate(Math.PI/4); ctx.fillRect(-centerCircleRadius, -plusThickness/2, centerCircleRadius*2, plusThickness); ctx.restore()
        ctx.save(); ctx.rotate(-Math.PI/4); ctx.fillRect(-centerCircleRadius, -plusThickness/2, centerCircleRadius*2, plusThickness); ctx.restore()

        const crossSize = 28
        const crossThickness = 6
        const circleRadius = 4
        ctx.fillStyle = "#dcbf00"
        ctx.strokeStyle = "#af7000"
        ctx.lineWidth = 2

        ctx.fillRect(-crossSize / 2 + circleRadius, -crossThickness / 2, crossSize - 2 * circleRadius, crossThickness)
        ctx.strokeRect(-crossSize / 2 + circleRadius, -crossThickness / 2, crossSize - 2 * circleRadius, crossThickness)

        ctx.beginPath(); ctx.arc(-crossSize/2,0,circleRadius,0,Math.PI*2); ctx.fill(); ctx.stroke()
        ctx.beginPath(); ctx.arc(crossSize/2,0,circleRadius,0,Math.PI*2); ctx.fill(); ctx.stroke()

        ctx.fillRect(-crossThickness / 2, -crossSize / 2 + circleRadius, crossThickness, crossSize - 2*circleRadius)
        ctx.strokeRect(-crossThickness / 2, -crossSize / 2 + circleRadius, crossThickness, crossSize - 2*circleRadius)

        ctx.beginPath(); ctx.arc(0,-crossSize/2,circleRadius,0,Math.PI*2); ctx.fill(); ctx.stroke()
        ctx.beginPath(); ctx.arc(0,crossSize/2,circleRadius,0,Math.PI*2); ctx.fill(); ctx.stroke()

        ctx.restore()
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.imageSmoothingEnabled = true
        drawRoulette(ctx, rotation)
    }, [rotation])

    const spin = () => {
        if (spinning) return
        setSpinning(true)

        const randomIndex = Math.floor(Math.random() * wheelNumbers.length)
        const winningNumber = wheelNumbers[randomIndex]

        const spins = 6
        const degreesPerSlice = 360 / wheelNumbers.length

        const start = rotation % 360
        const targetRotation = start + spins * 360 + (360 - randomIndex * degreesPerSlice)

        const duration = 5000
        const startTime = performance.now()

        const animate = (time: number) => {
            const elapsed = time - startTime
            const t = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - t, 3)
            setRotation(start + (targetRotation - start) * easeOut)

            if (t < 1) requestAnimationFrame(animate)
            else {
                setSpinning(false)
                setScore(winningNumber)
                setRotation(prev => prev % 360)
            }
        }
        requestAnimationFrame(animate)
    }

    useImperativeHandle(ref, () => ({
        spin
    }))

    return (
        <div className={"relative"}>
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className={"rounded-full"}/>
        </div>
    )
})

export default Roulette