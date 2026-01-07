import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="flex flex-col justify-between items-center gap-4 py-8 text-xs text-gray-800">
            <div className="flex justify-center gap-4 shrink-0 flex-wrap px-4">
                <NavLink to="/meta" className="hover:underline">
                    Meta
                </NavLink>
                <NavLink to="/about" className="hover:underline">
                    About
                </NavLink>
                <NavLink to="/blog" className="hover:underline">
                    Blog
                </NavLink>
                <NavLink to="/jobs" className="hover:underline">
                    Jobs
                </NavLink>
                <NavLink to="/help" className="hover:underline">
                    Help
                </NavLink>
                <NavLink to="/api" className="hover:underline">
                    API
                </NavLink>
                <NavLink to="/privacy" className="hover:underline">
                    Privacy
                </NavLink>
                <NavLink to="/term" className="hover:underline">
                    Terms
                </NavLink>
                <NavLink to="/locations" className="hover:underline">
                    Locations
                </NavLink>
                <NavLink to="/instagram-lite" className="hover:underline">
                    Instagram Lite
                </NavLink>
                <NavLink to="/meta-ai" className="hover:underline">
                    Meta AI
                </NavLink>
                <NavLink to="/threads" className="hover:underline">
                    Threads
                </NavLink>
                <NavLink to="/contact-non-users" className="hover:underline">
                    Contact Uploading & Non-Users
                </NavLink>
                <NavLink to="/meta-verified" className="hover:underline">
                    Meta Verified
                </NavLink>
            </div>
            <div className="flex items-center gap-4">
                <Button variant={"ghost"}>English</Button>
                <span>© 2026 Instagram from Meta</span>
            </div>
        </footer>
    );
}
