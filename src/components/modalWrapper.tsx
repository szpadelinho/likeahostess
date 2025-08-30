import React from "react";

const ModalWrapper = ({children, onClose}: { children: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 backdrop-blur-xs bg-black/20"
         onClick={() => onClose()}>
        <div onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
)

export default ModalWrapper