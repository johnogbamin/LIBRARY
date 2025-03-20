function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bg-white text-black px-4 py-2 rounded-md shadow-lg transition-opacity duration-300';
    toast.textContent = message;

    document.getElementById('toastContainer').appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
    const totalBooks = document.getElementById("totalBooks");
    const availableBooks = document.getElementById("availableBooks");
    const unavailableBooks = document.getElementById("unavailableBooks");

    const books = JSON.parse(localStorage.getItem("books")) || [];

    function updateDashboard() {
        let available = 0;
        let unavailable = 0;

        for (let i = 0; i < books.length; i++) {
            if (books[i].status === "Available") {
                available++;
            } else {
                unavailable++;
            }
        }

        totalBooks.textContent = books.length;
        availableBooks.textContent = available;
        unavailableBooks.textContent = unavailable;
    }

    updateDashboard();
});

document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const bookTable = document.getElementById("bookTable");
    const searchInput = document.getElementById("search");
    const bookModal = document.getElementById("bookModal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modalTitle = document.getElementById("modalTitle");
    const editIndex = document.getElementById("editIndex");
    const statusFilter = document.getElementById("statusFilter");

    const books = JSON.parse(localStorage.getItem("books")) || [];

    function renderBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterStatus = statusFilter.value;

        bookTable.innerHTML = "";

        for (let i = 0; i < books.length; i++) {
            const book = books[i];
            const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.isbn.includes(searchTerm);
            const matchesStatus = filterStatus === 'all' || book.status === filterStatus;

            if (matchesSearch && matchesStatus) {
                const row = document.createElement("tr");
                row.classList.add("hover:bg-gray-700");

                const statusClass = book.status === "Available"
                    ? "bg-green-900/50 text-green-400"
                    : "bg-red-900/50 text-red-400";

                row.innerHTML = `
            <td class="p-2 border border-gray-700 whitespace-nowrap">${book.title}</td>
            <td class="p-2 border border-gray-700 whitespace-nowrap">${book.author}</td>
            <td class="p-2 border border-gray-700 whitespace-nowrap">${book.isbn}</td>
            <td class="p-2 border border-gray-700 whitespace-nowrap">
              <span class="px-2 py-1 rounded-full ${statusClass} text-sm font-medium">
                ${book.status}
              </span>
            </td>
            <td class="p-2 border border-gray-700 whitespace-nowrap">
              <div class="flex justify-center gap-2">
                <button onclick="editBook(${i})" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteBook(${i})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          `;
                bookTable.appendChild(row);
            }
        }
    }

    bookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const isbn = document.getElementById("isbn").value;
        const status = document.getElementById("status").value;

        if (editIndex.value === "") {
            books.push({ title, author, isbn, status });
            showToast('Book added successfully!');
        } else {
            books[editIndex.value] = { title, author, isbn, status };
            showToast('Book updated successfully!');
        }
        localStorage.setItem("books", JSON.stringify(books));

        bookModal.classList.add("hidden");
        bookForm.reset();
        editIndex.value = "";

        setTimeout(() => {
            location.reload();
        }, 1500);
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
            showToast('Book deleted successfully!');
            renderBooks();

            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    };

    openModal.addEventListener("click", function () {
        modalTitle.textContent = "Add a New Book";
        bookForm.reset();
        editIndex.value = "";
        bookModal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", function () {
        bookModal.classList.add("hidden");
    });

    statusFilter.addEventListener("change", renderBooks);
    searchInput.addEventListener("input", renderBooks);
    renderBooks();
});
