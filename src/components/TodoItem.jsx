export function TodoItem({ completed, id, title, description, toggleTodo, deleteTodo }) {
    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={e => toggleTodo(id, e.target.checked)}
                />
                <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </label>
            <button onClick={() => deleteTodo(id)} className="btn btn-danger">Delete</button>
        </li>
    )
}
