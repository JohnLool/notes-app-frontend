import classNames from "classnames";
import React, {ReactNode} from "react";

export interface DialogProps {
    title: string;
    message?: string;
    children?: ReactNode;
    buttons?: DialogButton[]
}

export interface DialogButton {
    text: string;
    onClick: () => void;
    color?: "gray" | "blue" | "red";
}

export const Dialog: React.FC<DialogProps> = ({title, message, children, buttons}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-4">{children}</div>
                <div className="flex justify-end space-x-4 mt-6">
                    {buttons && buttons.map((button, index) => (
                        <button
                            key={index}
                            className={classNames({
                                'bg-gray-300': button.color === "gray",
                                'hover:bg-gray-400': button.color === "gray",
                                'text-gray-700': button.color === "gray",
                                'text-white': button.color !== "gray",
                                'bg-blue-500': button.color === "blue",
                                'hover:bg-blue-600': button.color === "blue",
                                'bg-red-500': button.color === "red",
                                'hover:bg-red-600': button.color === "red",
                            }, 'px-4 py-2 rounded-lg transition-colors')}
                            onClick={button.onClick}
                        >{button.text}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dialog;
