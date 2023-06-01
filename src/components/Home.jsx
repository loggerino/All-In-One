import { CustomLink } from "./Navbar";

export function Home() {
  return (
    <div className="Selection">
      <h1 className="home-title">Apps</h1>
      <ul className="homelist">
        <li>
          <img src="/calculator.jpg" alt="Calculator" className="app-image" />
          <CustomLink to="/calculator">Calculator</CustomLink>
        </li>
        <li>
          <img src="/todolist.jpg" alt="Todo List" className="app-image" />
          <CustomLink to="/TodoForm">Todo List</CustomLink>
        </li>
        <li>
          <img src="/weatherapp.jpg" alt="Weather Forecast" className="app-image" />
          <CustomLink to="/WeatherApp">Weather Forecast</CustomLink>
        </li>
      </ul>
    </div>
  );
}
