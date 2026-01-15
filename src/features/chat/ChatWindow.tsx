import { ChevronsLeftRight, Heart, Send, SquarePen, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();

    if (location.pathname.startsWith("/message")) {
        return null;
    }

    const handleClick = () => {
        setIsOpen(false);
        navigate("/message");
    };

    return (
        <div className="fixed right-10 bottom-20 md:bottom-10 z-40">
            {!isOpen ? (
                <div
                    onClick={() => setIsOpen(true)}
                    className="p-3 md:w-60 bg-white border border-gray-200 rounded-full shadow-lg cursor-pointer transition-colors hover:bg-gray-100"
                >
                    <div className="flex gap-4">
                        <Send />
                        <h3 className="hidden md:inline">Message</h3>
                    </div>
                </div>
            ) : (
                <div className="relative bg-white border border-gray-200 rounded-xl shadow-lg">
                    <div className="flex flex-col w-60 h-full md:w-80 md:h-60 lg:h-100">
                        <div className="w-full flex justify-between items-center p-4 border-b-2 border-b-gray-100">
                            <h3 className="font-bold">Message</h3>
                            <div className="flex gap-4">
                                <Heart className="hidden" />
                                <ChevronsLeftRight
                                    onClick={handleClick}
                                    className="-rotate-45 cursor-pointer"
                                />
                                <X
                                    onClick={() => setIsOpen(false)}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="p-4">hello</div>
                    </div>
                    <div className="absolute right-4 bottom-4 w-14 h-14 flex justify-center items-center bg-white border border-gray-200 rounded-full shadow-lg cursor-pointer hover:bg-secondary transition-all">
                        <SquarePen size={24} />
                    </div>
                </div>
            )}
        </div>
    );
}
