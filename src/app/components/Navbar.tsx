import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const getLinkClass = (path: string) =>
        location.pathname === path
            ? "bg-blue-600 text-white p-4 w-full text-center"
            : "hover:bg-blue-600 text-white p-4 transition-colors duration-200 w-full text-center";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white">
            <div className="flex">
                <Link to="/notes" className={getLinkClass("/notes")}>
                    Notes
                </Link>
                <Link to="/users" className={getLinkClass("/users")}>
                    Users
                </Link>
                <Link to="/me" className={getLinkClass("/me")}>
                    Me
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
