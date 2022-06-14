import { useState, useEffect } from 'react'
import { v4 as myNewID } from 'uuid'

import './App.css'

// button-group
const buttons = [
    {
        type: 'all',
        label: 'All',
    },
    {
        type: 'active',
        label: 'Active',
    },
    {
        type: 'done',
        label: 'Done',
    },
]

function App() {
    const [itemToDo, setItemToDo] = useState('')
    const [items, setItems] = useState(
        localStorage.getItem('todolist') !== null
            ? JSON.parse(localStorage.getItem('todolist'))
            : []
    )

    useEffect(() => {
        localStorage.setItem('todolist', JSON.stringify(items))
    }, [items])

    const [filterType, setFilterType] = useState('all')

    const handleToDoChange = (event) => {
        setItemToDo(event.target.value)
    }

    const [searchInput, setSearchInput] = useState('')

    const handleSearch = (event) => {
        setSearchInput(event.target.value)
    }

    const handleAddItem = () => {
        const newItem = { key: myNewID(), label: itemToDo }

        setItems((prevElement) => [newItem, ...prevElement])

        setItemToDo('')
    }

    const handleItemRemove = ({ key }) => {
        setItems((prevItems) =>
            prevItems.filter((item) => {
                return item.key !== key
            })
        )
    }

    const handleItemTagImportant = ({ key }) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.key === key) {
                    return { ...item, important: !item.important }
                } else return item
            })
        )
    }

    const handleItemDone = ({ key }) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.key === key) {
                    return { ...item, done: !item.done }
                } else return item
            })
        )
    }

    const handleFilterChange = ({ type }) => {
        setFilterType(type)
    }

    const moreToDo = items.filter((item) => !item.done).length

    const doneToDo = items.length - moreToDo

    const filteredArray =
        filterType === 'all'
            ? items
            : filterType === 'done'
            ? items.filter((item) => item.done)
            : items.filter((item) => !item.done)

    return (
        <div className="todo-app">
            {/* App-header */}
            <div className="app-header d-flex">
                <h1>Todo List</h1>
                <h2>
                    {moreToDo} more to do, {doneToDo} done
                </h2>
            </div>

            <div className="top-panel d-flex">
                {/* Search-panel */}
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="type to search"
                    onChange={handleSearch}
                    value={searchInput}
                />
                {/* Item-status-filter */}
                <div className="btn-group">
                    {buttons.map((item) => (
                        <button
                            key={item.type}
                            type="button"
                            className={`btn btn-info ${
                                filterType === item.type
                                    ? ''
                                    : 'btn-outline-info'
                            }`}
                            onClick={() => handleFilterChange(item)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List-group */}
            <ul className="list-group todo-list">
                {filteredArray.length > 0 &&
                    filteredArray
                        .filter((item) =>
                            item.label
                                .toLowerCase()
                                .includes(searchInput.toLowerCase())
                        )
                        .map((item) => (
                            <li key={item.key} className="list-group-item">
                                <span
                                    className={`todo-list-item ${
                                        item.done ? 'done' : ''
                                    } ${item.important ? 'important' : ''}`}
                                >
                                    <span
                                        className="todo-list-item-label"
                                        onClick={() => handleItemDone(item)}
                                    >
                                        {item.label}
                                    </span>

                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm float-right"
                                        onClick={() =>
                                            handleItemTagImportant(item)
                                        }
                                    >
                                        <i className="fa fa-exclamation" />
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm float-right"
                                        onClick={() => handleItemRemove(item)}
                                    >
                                        <i className="fa fa-trash-o" />
                                    </button>
                                </span>
                            </li>
                        ))}
            </ul>

            <div className="item-add-form d-flex">
                <input
                    value={itemToDo}
                    type="text"
                    className="form-control"
                    placeholder="What needs to be done"
                    onChange={handleToDoChange}
                />
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleAddItem}
                >
                    Add item
                </button>
            </div>
        </div>
    )
}

export default App
