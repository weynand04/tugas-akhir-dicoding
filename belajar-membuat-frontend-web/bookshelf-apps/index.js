let bookshelf = {
  incomplete: [],
  complete: [],
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("bookshelf");
  if (data) {
    bookshelf = JSON.parse(data);
    updateBookshelf();
  }
}

function updateLocalStorage() {
  localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
}

function addBookToShelf(title, author, year, isComplete) {
  const id = generateId();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: parseInt(year),
    isComplete: isComplete,
  };

  if (isComplete) {
    bookshelf.complete.push(newBook);
  } else {
    bookshelf.incomplete.push(newBook);
  }

  updateBookshelf();
  updateLocalStorage();
}

function updateBookshelf() {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  bookshelf.incomplete.forEach((book) => {
    const bookItem = createBookItem(book, "incomplete");
    incompleteBookshelfList.appendChild(bookItem);
  });

  bookshelf.complete.forEach((book) => {
    const bookItem = createBookItem(book, "complete");
    completeBookshelfList.appendChild(bookItem);
  });
}

function createBookItem(book, shelfType) {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;

  const action = document.createElement("div");
  action.classList.add("action");

  const buttonToggle = document.createElement("button");
  buttonToggle.innerText =
    shelfType === "incomplete" ? "Selesai dibaca" : "Belum selesai dibaca";
  buttonToggle.classList.add(shelfType === "incomplete" ? "green" : "red");

  const buttonDelete = document.createElement("button");
  buttonDelete.innerText = "Hapus buku";
  buttonDelete.classList.add("red");

  const buttonEdit = document.createElement("button");
  buttonEdit.innerText = "Edit";
  buttonEdit.classList.add("yellow");

  action.appendChild(buttonToggle);
  action.appendChild(buttonDelete);
  action.appendChild(buttonEdit);

  bookItem.appendChild(title);
  bookItem.appendChild(author);
  bookItem.appendChild(year);
  bookItem.appendChild(action);

  buttonToggle.addEventListener("click", function () {
    toggleBookshelf(book, shelfType);
  });

  buttonDelete.addEventListener("click", function () {
    deleteBook(book, shelfType);
  });

  buttonEdit.addEventListener("click", function () {
    updateBook(book);
  });

  return bookItem;
}

function moveBook(book, fromShelf, toShelf) {
  const index = bookshelf[fromShelf].indexOf(book);
  if (index !== -1) {
    bookshelf[fromShelf].splice(index, 1);
    book.isComplete = !book.isComplete;
    bookshelf[toShelf].push(book);
    updateBookshelf();
    updateLocalStorage();
  }
}

function toggleBookshelf(book, shelfType) {
  const fromShelf = shelfType === "incomplete" ? "incomplete" : "complete";
  const toShelf = shelfType === "incomplete" ? "complete" : "incomplete";
  moveBook(book, fromShelf, toShelf);
}

function updateBook(book) {
  const newTitle = prompt("Masukkan judul baru:", book.title);
  const newAuthor = prompt("Masukkan penulis baru:", book.author);
  const newYear = prompt("Masukkan tahun baru:", book.year);

  if (newTitle !== null && newTitle.trim() !== "") {
    book.title = newTitle;
  }
  if (newAuthor !== null && newAuthor.trim() !== "") {
    book.author = newAuthor;
  }
  if (newYear !== null && !isNaN(newYear) && newYear.trim() !== "") {
    book.year = parseInt(newYear);
  }

  updateBookshelf();
}

function deleteBook(book, shelfType) {
  const index = bookshelf[shelfType].indexOf(book);
  if (index !== -1) {
    const confirmDelete = confirm(
      `Apakah Anda yakin ingin menghapus buku "${book.title}"?`
    );
    if (confirmDelete) {
      bookshelf[shelfType].splice(index, 1);
      updateBookshelf();
      updateLocalStorage();
      alert(`Buku "${book.title}" telah berhasil dihapus.`);
    }
  }
}

function init() {
  loadFromLocalStorage();
  const inputBookForm = document.getElementById("inputBook");
  const alertElement = document.getElementById("alert");
  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const titleInput = document.getElementById("inputBookTitle");
    const authorInput = document.getElementById("inputBookAuthor");
    const yearInput = document.getElementById("inputBookYear");
    const isCompleteInput = document.getElementById("inputBookIsComplete");

    const title = titleInput.value;
    const author = authorInput.value;
    const year = yearInput.value;
    const isComplete = isCompleteInput.checked;

    addBookToShelf(title, author, year, isComplete);

    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;

    alertElement.innerHTML =
      "<h2>Buku Berhasil Ditambahkan</h2><p>Buku telah berhasil ditambahkan ke dalam rak.</p>";
    alertElement.style.display = "block";
    setTimeout(function () {
      alertElement.style.display = "none";
    }, 3000);
  });
}

init();
