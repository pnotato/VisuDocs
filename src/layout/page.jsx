import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/navbar";

export default function BaseLayout({ children }) {
    const location = useLocation();
    const currentPage = location.pathname;

    console.log(currentPage)
    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar currentPage={currentPage} />
            {children}
        </div>
    );
}