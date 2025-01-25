import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-around">
                <Link
                    to="/notes"
                    className="hover:text-gray-300 transition-colors duration-200"
                >
                    Notes
                </Link>
                <Link
                    to="/users"
                    className="hover:text-gray-300 transition-colors duration-200"
                >
                    Users
                </Link>
                <Link
                    to="/me"
                    className="hover:text-gray-300 transition-colors duration-200"
                >
                    Me
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
