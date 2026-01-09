import { ChevronsLeftRight, Heart, Send, X } from "lucide-react";
import { useState } from "react";

export default function Message() {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => {};
    return (
        <div
            onClick={handleClick}
            className="fixed right-10 bottom-10 z-40 px-10 py-4 bg-white rounded-full shadow-lg cursor-pointer transition-colors hover:bg-gray-100"
        >
            <div className="flex items-center gap-10">
                <Send />
                <h3>Message</h3>
                <Heart className="hidden" />
                <ChevronsLeftRight className="-rotate-45" />
                <X />
            </div>
        </div>
    );
}
