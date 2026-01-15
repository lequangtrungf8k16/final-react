import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Send, SquarePen } from "lucide-react";

export default function MessagePage() {
    return (
        <div className="flex w-full h-full">
            <div className="h-full w-20 md:w-80 flex flex-col gap-4 px-4 py-6 border-r border-r-gray-200 bg-white">
                <div className="flex justify-center md:justify-between">
                    <h2 className="hidden md:inline">hello</h2>
                    <SquarePen />
                </div>
                <div className="relative hidden md:block">
                    <SearchInput />
                </div>

                <div className="hidden md:block">
                    <p>Message</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-4 p-4">
                <div className="w-20 h-20 flex justify-center items-center rounded-full border-3 border-gray-400">
                    <Send />
                </div>
                <div className="text-center">
                    <h3 className="text-xl text-gray-800 font-bold">
                        Your Message
                    </h3>
                    <p className="text-gray-700">
                        Send a message to start a chat.
                    </p>
                </div>
                <Button className="bg-blue-600 cursor-pointer hover:bg-blue-800">
                    Send message
                </Button>
            </div>
        </div>
    );
}
