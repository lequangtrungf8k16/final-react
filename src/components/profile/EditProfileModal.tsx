import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { updateUserProfile } from "@/store/slices/userSlice";
import ChangePasswordModal from "./ChangePasswordModal";
import type { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
}

const API_URL = import.meta.env.VITE_BASE_URL;

export default function EditProfileModal({
  open,
  onOpenChange,
  currentUser,
}: EditProfileModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isUpdating } = useSelector((state: RootState) => state.user);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [gender, setGender] = useState("male");

  // File State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  // Reset form khi mở modal
  useEffect(() => {
    if (open && currentUser) {
      setFullName(currentUser.fullName || "");
      setBio(currentUser.bio || "");
      setWebsite(currentUser.website || "");
      setGender(currentUser.gender || "male");
      setFile(null);
      setPreviewUrl(getFullImageUrl(currentUser.profilePicture || ""));
    }
  }, [open, currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Thêm các trường text
    formData.append("fullName", fullName.trim());
    formData.append("bio", bio.trim());
    formData.append("website", website.trim());
    formData.append("gender", gender);

    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Update profile failed:", error);
      toast.error((error as string) || "Failed to update profile");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106 max-h-[90vh] overflow-y-auto bg-white dark:bg-black dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center font-bold cursor-pointer">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="hidden">
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-white dark:border-gray-700 shadow-sm">
                  <AvatarImage
                    src={previewUrl || ""}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {currentUser.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-sm">
                  {currentUser.username}
                </span>
                <Button
                  variant="link"
                  className="text-blue-500 h-auto p-0 font-semibold text-sm cursor-pointer hover:no-underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change profile photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Name"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  Website
                </label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website"
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  Bio
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-1 resize-none h-20"
                  maxLength={150}
                />
                <div className="text-right text-xs text-gray-400">
                  {bio.length} / 150
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">
                  Gender
                </label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-900 cursor-pointer border-gray-200 dark:border-gray-800">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-semibold text-gray-500">
                  Security
                </label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  <Lock className="mr-2 h-4 w-4 text-gray-500" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Done"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ChangePasswordModal
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </>
  );
}
