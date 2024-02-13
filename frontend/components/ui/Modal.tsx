import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ show, onClose, children }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClose();
    };

    const modalOpacity = show ? "opacity-100" : "opacity-0 pointer-events-none";

    const modalContent = (
        <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 bg-black bg-opacity-50 ${modalOpacity}`}
            onClick={handleCloseClick}
        >
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                    className={`bg-transparent p-0 transition-transform duration-300 scale-100 ${modalOpacity}`}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );

    if (isBrowser) {
        const modalRoot = document.getElementById("modal-root");
        return modalRoot
            ? ReactDOM.createPortal(modalContent, modalRoot)
            : null;
    } else {
        return null;
    }
};

export default Modal;
