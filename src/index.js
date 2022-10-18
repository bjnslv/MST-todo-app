import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {types} from "mobx-state-tree";

import {values} from "mobx";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Todo = types
  .model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User))),
  })
  .actions((self) => {
    function setName(newName) {
      self.name = newName;
    }
    function setUser(user) {
      if (user === "") {
        // When selected value is empty, set as undefined
        self.user = undefined;
      } else {
        self.user = user;
      }
    }
    function toggle() {
      self.done = !self.done;
    }

    return {setName, setUser, toggle};
  });

const User = types.model({
  id: types.identifier,
  name: types.optional(types.string, ""),
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .views((self) => ({
    get pendingCount() {
      return values(self.todos).filter((todo) => !todo.done).length;
    },
    get completedCount() {
      return values(self.todos).filter((todo) => todo.done).length;
    },
    getTodosWhereDoneIs(done) {
      return values(self.todos).filter((todo) => todo.done === done);
    },
  }))
  .actions((self) => {
    function addTodo(id, name) {
      self.todos.set(id, Todo.create({name}));
    }

    return {addTodo};
  });

const store = RootStore.create({
  users: {
    1: {
      id: "1",
      name: "mweststrate",
    },
    2: {
      id: "2",
      name: "mattiamanzati",
    },
    3: {
      id: "3",
      name: "johndoe",
    },
  },
  todos: {
    1: {
      name: "Eat a cake",
      done: true,
    },
  },
});

root.render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
