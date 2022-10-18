import React from "react";
import { types, getSnapshot } from "mobx-state-tree";
import { observer } from "mobx-react";
import { values } from "mobx";

let id = 1;
const randomId = () => ++id;

const Todo = types
  .model({
    id: types.identifierNumber,
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
  })
  .actions(self => {
    function setName(newName) {
      self.name = newName;
    }

    function toggle() {
      self.done = !self.done;
    }

    return { setName, toggle };
  });

const User = types.model({
  name: types.optional(types.string, "")
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {})
  })
  .actions(self => {
    function addTodo(id, name) {
      self.todos.set(id, Todo.create({ id, name }));
    }

    return { addTodo };
  });

const store = RootStore.create({
  users: {},
  todos: {
    "1": {
      id: id,
      name: "Eat a cake",
      done: true
    }
  }
});

const App = observer(() => (
  <div>
    <button onClick={e => store.addTodo(randomId(), "New Task")}>
      Add Task
    </button>
    {values(store.todos).map(todo => (
      <div key={todo.id}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={e => todo.toggle()}
        />
        <input
          type="text"
          value={todo.name}
          onChange={e => todo.setName(e.target.value)}
        />
      </div>
    ))}
  </div>
));

export default App;
