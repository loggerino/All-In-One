export function Navbar() {
    return (
        <nav className="nav">
            <a href="/" className="home">Home</a>
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