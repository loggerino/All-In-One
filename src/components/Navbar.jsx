import { Link, useMatch, useResolvedPath } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="nav">
            <Link to="/" className="home">Home</Link>
            <ul>
                <li>
                    <CustomLink to="/calculator">Calculator</CustomLink>
                </li>
                <li>
                    <CustomLink to="/TodoForm">Todo List</CustomLink>
                </li>
                <li>
                    <CustomLink to="/WeatherApp">Weather Forecast</CustomLink>
                </li>
            </ul>
        </nav>
    );
}

 export function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}