import { Search } from "lucide-react";
import { Input } from "./ui/input";

export default function SearchInput() {
    return (
        <div className="relative">
            <Input
                className="px-10 rounded-full focus-visible:ring-0"
                placeholder="Search..."
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500" />
        </div>
    );
}
