import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Copy, Images, Maximize2, ZoomIn } from "lucide-react";
import { Input } from "./ui/input";

interface CreatePostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreatePostModal({
    open,
    onOpenChange,
}: CreatePostModalProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedFile(null);
        }
        onOpenChange(isOpen);
    };

    const handleSelectFromComputer = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setSelectedFile(fileUrl);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={
                    !selectedFile
                        ? "flex flex-col items-center w-80 h-80 md:max-w-100 md:h-125 rounded-2xl px-2 md:px-0 py-3"
                        : "flex flex-col items-center w-80 h-80 md:max-w-100 md:h-125 rounded-2xl px-2 md:px-0 py-3 [&>button]:hidden"
                }
            >
                <DialogHeader className="w-full border-b-2 border-b-gray-200 pb-3">
                    {selectedFile ? (
                        <div className="flex justify-between items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedFile(null)}
                                className="cursor-pointer"
                            >
                                <ArrowLeft size={24} />
                            </Button>
                            <DialogTitle>Crop</DialogTitle>
                            <Button
                                variant="ghost"
                                className="text-blue-600 cursor-pointer transition-all hover:underline"
                            >
                                Next
                            </Button>
                        </div>
                    ) : (
                        <DialogTitle className="text-center">
                            Create new post
                        </DialogTitle>
                    )}
                </DialogHeader>

                <div className="w-full h-full flex-1 flex flex-col justify-center gap-4 bg-white">
                    {selectedFile ? (
                        <div className="relative w-full h-full">
                            <img
                                src={selectedFile}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-0 right-0 px-4 flex justify-between gap-4">
                                <div className="flex gap-4">
                                    <Button>
                                        <Maximize2 size={16} />
                                    </Button>
                                    <Button>
                                        <ZoomIn size={16} />
                                    </Button>
                                </div>
                                <Button>
                                    <Copy size={16} />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center gap-4">
                            <div>
                                <Images strokeWidth={1} size={90} />
                            </div>
                            <p className="text-xl">
                                Drag photos and videos here
                            </p>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleSelectFromComputer}
                    className={
                        !selectedFile
                            ? "bg-blue-700 cursor-pointer transition-colors hover:bg-blue-800"
                            : "hidden"
                    }
                >
                    Select from computer
                </Button>
                <Input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </DialogContent>
        </Dialog>
    );
}
