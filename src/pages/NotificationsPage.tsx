import { Button } from "@/components/ui/button";
import { Circle, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-4 md:w-140 md:mx-auto">
            <div className="flex items-center">
                <ArrowLeft
                    onClick={() => navigate(-1)}
                    className="cursor-pointer"
                />
                <h3 className="flex-1 text-center">NotificationsPage</h3>
            </div>

            <div className="flex flex-col items-center gap-4 text-center mt-4 px-10">
                <div className="flex justify-center items-center h-16 w-16 border-2 border-gray-900 rounded-full">
                    <Heart />
                </div>
                <p>Activity On Your Posts</p>
                <p>
                    When someone likes or comments on one of your posts, you'll
                    see it here.
                </p>
            </div>
            <div>
                <p className="mt-4 font-bold">Suggested for you</p>
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 mt-4">
                        <Circle size={46} />
                        <div className="flex flex-col font-light">
                            <span className="font-bold">username</span>
                            <span>fullname</span>
                            <span>Suggested</span>
                        </div>
                    </div>
                    <Button className="select-none">Follow</Button>
                </div>
            </div>
        </div>
    );
}
