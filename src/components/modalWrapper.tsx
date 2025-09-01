import React, {useEffect, useState} from "react"

interface ModalProps {
    children: (props: { onCloseModal: () => void }) => React.ReactElement
    onClose: () => void
}

const ModalWrapper = ({children, onClose}: ModalProps) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 10)
        return () => clearTimeout(timeout)
    }, [])

    const handleClose = () => {
        setVisible(false)
        setTimeout(() => {
            onClose()
        }, 300)
    }

    return (
        <div
            className={`fixed inset-0 flex justify-center items-center z-50 bg-black/20 backdrop-blur-xs transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        >
            <div
                className={`transition-transform duration-300 ${
                    visible ? "scale-100" : "scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {children({onCloseModal: handleClose})}
            </div>
        </div>
    );
};

export default ModalWrapper