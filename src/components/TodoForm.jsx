import { useState } from "react"


export function TodoForm({ onSubmit }) {
    const [newItem, setNewItem] = useState("");
    const [newDescription, setNewDescription] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (newItem === "") return

        onSubmit(newItem, newDescription);
        setNewItem("");
        setNewDescription("");
    }

    return (
        <>
            <h1 className="form-title">My Agenda</h1>
            <form onSubmit={handleSubmit} className="new-item-form">
                <div className="form-row">
                    <label htmlFor="item">Title</label>
                    <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="item" />
                </div>
                <div className="form-row">
                    <label htmlFor="">Description</label>
                    <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} type="text" id="description" />
                </div>
                <button className="btn">Add</button>
            </form>
        </>
    )
}