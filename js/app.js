import Store from "./store.js";
import View from "./view.js";

function init() {
  const store = new Store("books");

  const view = new View();

  view.render(store.state);
  view.toggleStatusBooksBtn(store.state.isComplete);

  store.addEventListener("statechange", () => {
    view.render(store.state);
  });

  view.bindAddNewBook((e) => {
    e.preventDefault();
    store.addNewBook(view.getInputValues());
    e.target.reset();
  });

  view.bindDeleteBook((e) =>
    store.deleteBook(e.target.getAttribute("data-book"))
  );

  view.bindMoveBook((e) => {
    store.moveBook(e.target.getAttribute("data-book"));
  });

  view.bindSearchBook((e) => view.render(store.state, e.target.value));

  view.bindToggleBooks(() => {
    store.toggleIsComplete();
    view.toggleStatusBooksBtn(store.state.isComplete);
  });
}

window.addEventListener("load", init());
