import { useState } from "react";
import SearchInput from "./SearchInput";

export default function SearchContent() {
    const [searchText, setSearchText] = useState("");
    const handleClear = () => setSearchText("");
    return (
        <div className="flex flex-col h-full w-full bg-white">
            <div className="px-6 pt-6 md:pt-0">
                <h2 className="text-2xl font-bold hidden md:block">Search</h2>
                <SearchInput
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onClear={handleClear}
                />
            </div>
            <div className="flex-1 px-6 py-4">
                <div>
                    <span>Recent</span>
                </div>
                <div className="flex justify-center items-center h-40 text-gray-400">
                    No recent searches
                </div>
            </div>
        </div>
    );
}
