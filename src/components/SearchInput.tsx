import { Search, XCircle } from "lucide-react";
import { Input } from "./ui/input";

interface SearchInputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
    autoFocus?: boolean;
}

export default function SearchInput({
    value,
    onChange,
    onClear,
    autoFocus,
}: SearchInputProps) {
    return (
        <div className="relative">
            <Input
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                className="px-10 rounded-full focus-visible:ring-0"
                placeholder="Search..."
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500" />
            {value && (
                <XCircle
                    size={16}
                    onClick={onClear}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
                />
            )}
        </div>
    );
}
