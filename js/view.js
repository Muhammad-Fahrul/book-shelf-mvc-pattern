export default class View {
  $ = {};
  constructor() {
    this.$.book_form = document.querySelector("#book-form");
    this.$.title_input = document.querySelector("#title");
    this.$.author_input = document.querySelector("#author");
    this.$.year_input = document.querySelector("#year");
    this.$.isComplete_input = document.querySelector("#isComplete");
    this.$.search_input = document.querySelector("#search");
    this.$.toggle_status_books_btn = document.querySelector(
      "#toggle-status-books-btn"
    );
    this.$.books_table_tbody = document.querySelector(".items");
  }

  render(state, search) {
    let books;

    if (search) {
      books = state.books.filter((book) =>
        book.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    } else {
      books = state.books;
    }

    let displayedBook;
    if (state.isComplete) {
      displayedBook = books.filter((book) => book.isComplete);
    } else {
      displayedBook = books.filter((book) => !book.isComplete);
    }
    this.$.books_table_tbody.innerHTML = displayedBook
      .map((book) => {
        return `<li>
                  <div class="detail-items">
                    <p>${book.id}</p>
                    <p>${book.title}</p>
                    <p>${book.author}</p>
                    <p>${book.year}</p>
                  </div>
                  <div class="book-item-btn">
                    <i data-act="move-book-btn" data-book="${book.id}" class="fa-regular fa-life-ring"></i>
                    <i data-act="delete-book-btn" data-book="${book.id}" class="fa-regular fa-trash-can"></i>
                  </div>
                </li>
                `;
      })
      .join("");
  }

  bindAddNewBook(handler) {
    this.$.book_form.addEventListener("submit", handler);
  }

  bindDeleteBook(handler) {
    this.#delegate(
      this.$.books_table_tbody,
      '[data-act="delete-book-btn"]',
      "click",
      handler
    );
  }

  bindMoveBook(handler) {
    this.#delegate(
      this.$.books_table_tbody,
      '[data-act="move-book-btn"]',
      "click",
      handler
    );
  }

  bindSearchBook(handler) {
    this.$.search_input.addEventListener("input", handler);
  }

  bindToggleBooks(handler) {
    this.$.toggle_status_books_btn.addEventListener("click", handler);
  }

  getInputValues() {
    return {
      title: this.$.title_input.value,
      author: this.$.author_input.value,
      year: this.$.year_input.value,
      isComplete: this.$.isComplete_input.checked,
    };
  }

  toggleStatusBooksBtn(isComplete) {
    this.$.search_input.value = "";
    this.$.toggle_status_books_btn.textContent = isComplete
      ? "Readed"
      : "Reading";
  }

  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event);
      }
    });
  }
}

{
  /* <tr>
<td>${book.id}</td>
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.year}</td>
<td >
    <div class="book-item-btn">
        <button data-act="move-book-btn" data-book=${book.id}>Move</button>
        <button data-act="delete-book-btn" data-book=${book.id}>Delete</button>
    </div>
</td>
</tr> */
}
