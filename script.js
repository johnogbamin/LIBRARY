document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const bookTable = document.getElementById("bookTable");
  const bookModal = document.getElementById("bookModal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const editIndex = document.getElementById("editIndex");

  let books = JSON.parse(localStorage.getItem("books")) || [];

  function renderBooks() {
    bookTable.innerHTML = "";
    books.forEach((book, index) => {
      const row = document.createElement("tr");
      row.classList.add("hover:bg-gray-700");
      row.innerHTML = `
                <td class="p-2 border border-gray-700">${book.title}</td>
                <td class="p-2 border border-gray-700">${book.author}</td>
                <td class="p-2 border border-gray-700">${book.isbn}</td>
                <td class="p-2 border border-gray-700">${book.status}</td>
                <td class="p-2 border border-gray-700">
                    <button onclick="editBook(${index})" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">Edit</button>
                    <button onclick="deleteBook(${index})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                </td>
            `;
      bookTable.appendChild(row);
    });
  }

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;
    const status = document.getElementById("status").value;

    if (editIndex.value === "") {
      books.push({ title, author, isbn, status });
    } else {
      books[editIndex.value] = { title, author, isbn, status };
    }
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    bookModal.classList.add("hidden");
    bookForm.reset();
    editIndex.value = "";
  });

  window.editBook = function (index) {
    const book = books[index];
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("status").value = book.status;
    editIndex.value = index;
    modalTitle.textContent = "Edit Book";
    bookModal.classList.remove("hidden");
  };

  window.deleteBook = function (index) {
    if (confirm("Are you sure you want to delete this book?")) {
      books.splice(index, 1);
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
    }
  };

  openModal.addEventListener("click", () => {
    modalTitle.textContent = "Add a New Book";
    bookForm.reset();
    editIndex.value = "";
    bookModal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", () => {
    bookModal.classList.add("hidden");
  });

  renderBooks();
});
