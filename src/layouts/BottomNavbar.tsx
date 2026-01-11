import SearchInput from "@/components/SearchInput";
import { Heart } from "lucide-react";

export default function BottomNavbar() {
    return (
        <>
            <div className="sticky top-0 left-0 right-0 z-50">
                <h2>Instagram</h2>
                <div>
                    <SearchInput />
                    <Heart />
                </div>
            </div>
            <div></div>
        </>
    );
}
