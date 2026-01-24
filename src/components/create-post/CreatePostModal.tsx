import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { createPost } from "@/store/slices/postSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Copy,
  Images,
  Maximize2,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Định nghĩa các bước của Modal
type Step = "select" | "preview" | "caption";

export default function CreatePostModal({
  open,
  onOpenChange,
}: CreatePostModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  // State quản lý dữ liệu
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isSubmitting) {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
    setStep("select");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Chọn file từ máy tính
  const handleSelectFromComputer = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        !selectedFile.type.startsWith("image/") &&
        !selectedFile.type.startsWith("video/")
      ) {
        toast.error("File type not supported. Please choose image or video.");
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStep("preview");
    }
  };

  // Xử lý nút Back
  const handleBack = () => {
    if (step === "caption") setStep("preview");
    else if (step === "preview") {
      setStep("select");
      setFile(null);
      setPreviewUrl(null);
    }
  };

  // Xử lý nút Next
  const handleNext = () => {
    if (step === "preview") setStep("caption");
  };

  // Xử lý nút Đăng bài
  const handleShare = async () => {
    if (!file) return;

    setIsSubmitting(true);
    try {
      await dispatch(createPost({ file, caption })).unwrap();

      toast.success("Post created successfully!");
      handleOpenChange(false);
    } catch (error) {
      toast.error((error as string) || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          step === "select"
            ? "flex flex-col items-center w-80 h-80 md:max-w-120 md:h-125 lg:w-240 rounded-xl px-0 py-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border-none outline-none"
            : "flex flex-col items-center w-80 h-80 md:max-w-120 md:h-125 rounded-xl px-0 py-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border-none outline-none"
        }
      >
        {/* HEADER */}
        <DialogHeader className="w-full h-11 border-b border-gray-200 dark:border-gray-800 flex flex-row items-center justify-between px-4 shrink-0">
          {step === "select" ? (
            <DialogTitle className="w-full text-center font-semibold text-base">
              Create new post
            </DialogTitle>
          ) : (
            <>
              {/* Nút Back */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="cursor-pointer hover:bg-transparent -ml-2"
                disabled={isSubmitting}
              >
                <ArrowLeft size={24} />
              </Button>

              {/* Title thay đổi theo bước */}
              <DialogTitle className="font-semibold text-base">
                {step === "preview" ? "Crop" : "Create new post"}
              </DialogTitle>

              {/* Nút Action (Next hoặc Share) */}
              {step === "preview" ? (
                <Button
                  variant="ghost"
                  onClick={handleNext}
                  className="text-blue-500 font-semibold hover:text-blue-700 hover:bg-transparent mr-4"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleShare}
                  disabled={isSubmitting}
                  className="text-blue-500 font-semibold hover:text-blue-700 hover:bg-transparent -mr-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Share"
                  )}
                </Button>
              )}
            </>
          )}
        </DialogHeader>

        {/* BODY */}
        <div className="w-full h-full flex flex-row">
          {/* Cột Trái: Ảnh/Video Preview */}
          <div
            className={`relative flex items-center justify-center bg-gray-100 dark:bg-black transition-all duration-300 ${
              step === "caption"
                ? "w-[60%] border-r border-gray-200 dark:border-gray-800"
                : "w-full"
            }`}
          >
            {previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {file?.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                )}

                {/* Các nút công cụ ảnh (Crop/Zoom) - Chỉ hiện ở Preview */}
                {step === "preview" && (
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full w-8 h-8 opacity-75 hover:opacity-100 bg-black/50 text-white hover:bg-black/70 border-none"
                      >
                        <Maximize2 size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full w-8 h-8 opacity-75 hover:opacity-100 bg-black/50 text-white hover:bg-black/70 border-none"
                      >
                        <ZoomIn size={16} />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full w-8 h-8 opacity-75 hover:opacity-100 bg-black/50 text-white hover:bg-black/70 border-none"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // Màn hình chọn ảnh ban đầu
              <div className="flex flex-col justify-center items-center gap-4 p-8">
                <Images
                  strokeWidth={1}
                  size={80}
                  className="text-gray-800 dark:text-gray-200"
                />
                <p className="text-xl font-light text-gray-600 dark:text-gray-300">
                  Drag photos and videos here
                </p>
                <Button
                  onClick={handleSelectFromComputer}
                  className="bg-[#0095f6] hover:bg-[#1877f2] font-semibold px-4 py-2 h-auto text-sm"
                >
                  Select from computer
                </Button>
              </div>
            )}
          </div>

          {/* Cột Phải: Nhập Caption */}
          {step === "caption" && (
            <div className="w-[40%] flex flex-col bg-white dark:bg-zinc-900">
              {/* User Info */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={user?.profilePicture || "/default-avatar.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-sm">
                  {user?.username || "username"}
                </span>
              </div>

              {/* Text Area */}
              <div className="px-4 flex-1">
                <Textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full h-50 border-none shadow-none resize-none focus-visible:ring-0 p-0 text-sm bg-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>

        {/* Input file ẩn */}
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
