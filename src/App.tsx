import Footer from "./layouts/Footer";
import Message from "./layouts/Message";
import Sidebar from "./layouts/Sidebar";

export default function App() {
    return (
        <div className="container relative md:flex md:mx-auto">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="h-screen px-4 py-4">
                    <h1>Hello</h1>
                </main>
                <Footer />
            </div>
            <Message />
        </div>
    );
}
