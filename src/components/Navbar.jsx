import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="nav">
            <Link to="/" className="home">Home</Link>
            <ul>
                <li>
                    <a href="/calculator">Calculator</a>
                </li>
                <li>
                    <a href="/TodoForm">Todo List</a>
                </li>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const path = window.location.pathname;

    return (
        <li className={path === to ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}