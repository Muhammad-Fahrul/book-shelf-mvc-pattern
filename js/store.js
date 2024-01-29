const initialState = {
  books: [],
  isComplete: false,
};

class Book {
  constructor(id, title, author, year, isComplete = false) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.isComplete = isComplete;
  }
}

export default class Store extends EventTarget {
  constructor(storageKey) {
    super();
    this.storageKey = storageKey;
  }

  get state() {
    const state = this.#getState();
    return state;
  }

  addNewBook({ title, author, year, isComplete }) {
    const stateClone = structuredClone(this.#getState());

    const id = stateClone.books.length > 0 ? stateClone.books.length + 1 : 1;
    const newBook = new Book(id, title, author, year, isComplete);

    stateClone.books.push(newBook);
    this.#saveState(stateClone);
  }

  deleteBook(id) {
    const stateClone = structuredClone(this.#getState());

    const newBooks = {
      ...stateClone,
      books: stateClone.books.filter((book) => Number(book.id) !== Number(id)),
    };

    this.#saveState(newBooks);
  }

  moveBook(id) {
    const stateClone = structuredClone(this.#getState());

    const currentBook = stateClone.books.filter(
      (book) => Number(book.id) === Number(id)
    )[0];

    const movingBook = {
      ...currentBook,
      isComplete: !currentBook.isComplete,
    };

    const newBooks = {
      ...stateClone,
      books: [
        ...stateClone.books.filter((book) => Number(book.id) !== Number(id)),
        movingBook,
      ],
    };

    this.#saveState(newBooks);
  }

  toggleIsComplete() {
    const stateClone = structuredClone(this.#getState());

    stateClone.isComplete = !stateClone.isComplete;
    this.#saveState(stateClone);
  }

  #saveState(stateOrFn) {
    const prevState = this.#getState();

    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveBooks");
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.dispatchEvent(new Event("statechange"));
  }

  #getState() {
    const item = window.localStorage.getItem(this.storageKey);
    return item ? JSON.parse(item) : initialState;
  }
}
