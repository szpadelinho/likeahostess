function getEmbedType(url: string) {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
    if (url.includes("giphy.com") || url.includes("tenor.com")) return "gif"
    if (url.match(/\.(mp4|webm)$/)) return "video"
    if (url.match(/\.(png|jpg|jpeg|gif|webp)$/)) return "image"
    return "link"
}

function extractYouTubeId(url: string) {
    const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/)
    return match?.[1]
}

function Embed({ message }: { message: string }) {
    const urlRegex = /(https?:\/\/[^\s]+)/g

    const urls = message.match(urlRegex) || []

    if (!urls.length) return null

    return (
        <div className="ml-10 mt-2 flex flex-col gap-2">
            {urls.map((url, i) => {
                const type = getEmbedType(url)

                switch (type) {
                    case "youtube": {
                        const id = extractYouTubeId(url)

                        if (!id) return null

                        return (
                            <iframe
                                key={i}
                                className="rounded-md max-w-full"
                                src={`https://www.youtube.com/embed/${id}`}
                                allowFullScreen
                            />
                        )
                    }

                    case "image":
                    case "gif":
                        return (
                            <img
                                key={i}
                                src={url}
                                alt={message}
                                className="max-w-[100px] rounded-md hover:scale-105 transition"
                            />
                        )

                    case "video":
                        return (
                            <video
                                key={i}
                                src={url}
                                controls
                                className="max-w-[300px] rounded-md"
                            />
                        )

                    default:
                        return (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                className="text-pink-300 underline"
                            >
                                {url}
                            </a>
                        )
                }
            })}
        </div>
    )
}

export default Embed