function MessageContent({ content }: { content: string }) {
    const urlRegex = /(https?:\/\/[^\s]+)/g

    return (
        <span>
            {content.split(urlRegex).map((part, i) => {
                if (part.match(urlRegex)) return null
                return <span key={i}>{part}</span>
            })}
        </span>
    )
}

export default MessageContent