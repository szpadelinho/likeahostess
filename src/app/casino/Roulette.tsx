import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"

interface RouletteProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    setWin: (value: (((prevState: (0 | 1 | 2)) => (0 | 1 | 2)) | 0 | 1 | 2)) => void
}

const Roulette = forwardRef(function Roulette({setScore, setWin}: RouletteProps, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [spinning, setSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [ballRotation, setBallRotation] = useState(0)
    const [ballDrop, setBallDrop] = useState(0)

    const wheelNumbers = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
        10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ]
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

    const degToRad = (d: number) => (d * Math.PI) / 180
    const normalizeDeg = (d: number) => ((d % 360) + 360) % 360

    const drawRoulette = (ctx: CanvasRenderingContext2D, angleOffset: number, ballAngle: number) => {
        const size = ctx.canvas.width
        const radius = size / 2
        const sliceAngle = (2 * Math.PI) / wheelNumbers.length

        ctx.clearRect(0, 0, size, size)
        ctx.save()
        ctx.translate(radius, radius)
        ctx.rotate(degToRad(angleOffset))

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

        const centerCircleRadius = 120
        const innerSliceAngle = (2 * Math.PI) / wheelNumbers.length

        wheelNumbers.forEach((_, i) => {
            const startAngle = i * innerSliceAngle
            const endAngle = startAngle + innerSliceAngle

            const baseColor = "#8c6f00"
            const lightEdgeColor = "#dcbf00"

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.arc(0, 0, centerCircleRadius, startAngle, endAngle)
            ctx.closePath()
            ctx.fillStyle = baseColor
            ctx.fill()

            ctx.beginPath()
            ctx.arc(0, 0, centerCircleRadius, endAngle - 0.02, endAngle)
            ctx.lineTo(0, 0)
            ctx.closePath()
            ctx.fillStyle = lightEdgeColor
            ctx.fill()
        })

        ctx.beginPath()
        ctx.arc(0, 0, centerCircleRadius - 20, 0, Math.PI * 2)
        ctx.fillStyle = "#c8a103"
        ctx.fill()

        const plusThickness = 5
        ctx.fillStyle = "#af7000"
        ctx.fillRect(-(centerCircleRadius - 20), -plusThickness / 2, (centerCircleRadius - 20) * 2, plusThickness)
        ctx.fillRect(-plusThickness / 2, -(centerCircleRadius - 20), plusThickness, (centerCircleRadius - 20) * 2)
        ctx.save()
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(-(centerCircleRadius - 20), -plusThickness / 2, (centerCircleRadius - 20) * 2, plusThickness)
        ctx.restore()
        ctx.save()
        ctx.rotate(-Math.PI / 4)
        ctx.fillRect(-(centerCircleRadius - 20), -plusThickness / 2, (centerCircleRadius - 20) * 2, plusThickness)
        ctx.restore()

        const crossSize = 28
        const crossThickness = 6
        const circleRadius = 4
        ctx.fillStyle = "#dcbf00"
        ctx.strokeStyle = "#af7000"
        ctx.lineWidth = 2

        ctx.fillRect(-crossSize / 2 + circleRadius, -crossThickness / 2, crossSize - 2 * circleRadius, crossThickness)
        ctx.strokeRect(-crossSize / 2 + circleRadius, -crossThickness / 2, crossSize - 2 * circleRadius, crossThickness)

        ctx.beginPath()
        ctx.arc(-crossSize/2,0,circleRadius,0,Math.PI*2); ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(crossSize/2,0,circleRadius,0,Math.PI*2); ctx.fill()
        ctx.stroke()

        ctx.fillRect(-crossThickness / 2, -crossSize / 2 + circleRadius, crossThickness, crossSize - 2*circleRadius)
        ctx.strokeRect(-crossThickness / 2, -crossSize / 2 + circleRadius, crossThickness, crossSize - 2*circleRadius)

        ctx.beginPath()
        ctx.arc(0,-crossSize/2,circleRadius,0,Math.PI*2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0,crossSize/2,circleRadius,0,Math.PI*2)
        ctx.fill()
        ctx.stroke()

        ctx.restore()

        const ballRadiusFromCenter = radius * 0.9 - ballDrop
        const ballSize = 8
        ctx.save()
        ctx.translate(radius, radius)
        ctx.rotate(degToRad(-ballAngle))
        ctx.beginPath()
        ctx.arc(ballRadiusFromCenter, 0, ballSize, 0, Math.PI * 2)
        ctx.fillStyle = "#a1a1a1"
        ctx.strokeStyle =  "#000"
        ctx.shadowColor = "rgba(76,76,76,0.3)"
        ctx.shadowBlur = 5
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.imageSmoothingEnabled = true
        drawRoulette(ctx, rotation, ballRotation)
    }, [rotation, ballRotation, ballDrop])

    const spin = () => {
        if (spinning) return
        setSpinning(true)
        setBallDrop(0)

        const randomIndex = Math.floor(Math.random() * wheelNumbers.length)
        const winningNumber = wheelNumbers[randomIndex]

        const spinsWheel = 6
        const spinsBall = 8
        const degreesPerSlice = 360 / wheelNumbers.length

        const numberAngle = randomIndex * degreesPerSlice + degreesPerSlice / 2

        setRotation(0)
        setBallRotation(0)

        const targetWheelRotation = spinsWheel * 360
        const targetBallRotation = spinsBall * 360 + targetWheelRotation - numberAngle

        const duration = 5000
        const startTime = performance.now()

        const animate = (time: number) => {
            const elapsed = time - startTime
            const t = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - t, 3)

            setRotation(targetWheelRotation * easeOut)
            setBallRotation(targetBallRotation * easeOut)

            if (t < 1) requestAnimationFrame(animate)
            else {
                setSpinning(false)
                setScore(winningNumber)

                const dropStart = performance.now()
                const dropDuration = 800
                const dropAmount = 70

                const drop = (time: number) => {
                    const elapsed = time - dropStart
                    const t = Math.min(elapsed / dropDuration, 1)
                    const ease = 1 - Math.pow(1 - t, 2)
                    setBallDrop(ease * dropAmount)
                    if (t < 1) requestAnimationFrame(drop)
                };
                requestAnimationFrame(drop)
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