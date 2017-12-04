import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {combineReducers, createStore} from "redux";

import shortId from 'shortid';


const todo = (state, action) => {

    switch (action.type) {
        case "ADD_TODO":
            return {
                id: action.id,
                text: action.text,
                completed: false,
            };
        case "TOGGLE_TODO":

            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed,
            }
        default:
            return state;
    }
}

const todos = (state = [], action) => {

    switch (action.type) {
        case "ADD_TODO":
            return [
                ...state,
                todo(undefined, action),
            ];
        case "TOGGLE_TODO":
            return state.map(t => todo(t, action))
        default:
            return state;
    }
}


const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};


const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter((t) => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        default:
            return todos;
    }
}
const todoApp = combineReducers({
    todos,
    visibilityFilter
})

const store = createStore(todoApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


const FilterLink = ({filter, currentFilter, children, onClick}) => (
    <span>
            {currentFilter === filter ? <span>{children}</span> :
                <a href="#" onClick={e => {
                    e.preventDefault();
                    onClick(filter);
                }}>{children}</a>}

            </span>
);


const TodoItem = ({id, text, completed}) => (
    <li
        onClick={
            () => {
                store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: id
                })
            }}
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}>
        {text}
    </li>
);


const TodoList = ({todos, onTodoClick}) => (
    <ul>
        {todos.map(todo =>
            <TodoItem
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />)}
    </ul>
)


const AddTodo = ({onAddClick}) => {
    let input;
    return (
        <div>
            <input ref={node => {
                input = node
            }}/>
            <button onClick={
                () => {
                    onAddClick(input.value)
                    input.value = ''
                }
            }>
                Add todo
            </button>

        </div>
    );
};


const Footer = ({visibilityFilter, onFilterClick}) => (
    <p>
        <FilterLink
            filter='SHOW_ALL' currentFilter={visibilityFilter} onClick={onFilterClick}>All</FilterLink>{' '}
        <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}
                    onClick={onFilterClick}>Active</FilterLink>{' '}
        <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}
                    onClick={onFilterClick}>Complete</FilterLink>{' '}
    </p>
);


const TodoApp = ({todos, visibilityFilter}) => (
    <div>
        <AddTodo
            onAddClick={text => {
                store.dispatch({
                    type: "ADD_TODO",
                    text: text,
                    id: shortId.generate(),
                })
            }}/>
        <TodoList
            todos={getVisibleTodos(
                todos,
                visibilityFilter
            )}
            onTodoClick={id =>
                store.dispatch({
                    type: "TOGGLE_TODO",
                    id
                })
            }/>
        <Footer visibilityFilter={visibilityFilter}
                onFilterClick={filter => store.dispatch(
                    {
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    })
                }/>
    </div>
)


const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()} />,
        document.getElementById('root')
    )

};

store.subscribe(render);
render();