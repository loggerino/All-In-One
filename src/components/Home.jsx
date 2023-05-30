import { CustomLink } from "./Navbar";

export function Home() {
    return (
        <div className="Selection">
            <h1 className="home-title">Apps</h1>
            <ul className="homelist">
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
        </div>
    );
}
