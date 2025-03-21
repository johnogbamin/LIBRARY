// Book Class
class Book {
    constructor(id, title, author, isbn, status, genre) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.status = status;
        this.genre = genre;
    }
}

// UI Class
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const filterGenre = document.getElementById('filterGenre')?.value || 'All';
        const sortBy = document.getElementById('sortBy')?.value || 'title';
        
        // Filter books
        let filteredBooks = books.filter(book => {
            const matchesSearch = 
                book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery) ||
                book.isbn.toLowerCase().includes(searchQuery);
            
            const matchesGenre = filterGenre === 'All' || book.genre === filterGenre;
            
            return matchesSearch && matchesGenre;
        });

        // Sort books
        filteredBooks.sort((a, b) => {
            const valueA = a[sortBy].toLowerCase();
            const valueB = b[sortBy].toLowerCase();
            return valueA.localeCompare(valueB);
        });

        // Clear existing books
        const bookList = document.querySelector('#bookList');
        const emptyState = document.getElementById('emptyState');
        bookList.innerHTML = '';
        
        // Show empty state if no books found
        if (filteredBooks.length === 0) {
            emptyState?.classList.remove('hidden');
        } else {
            emptyState?.classList.add('hidden');
            filteredBooks.forEach(book => UI.addBookToList(book));
        }

        // Update stats
        UI.updateStats();
        UI.updateTableCount(filteredBooks.length);
    }

    static addBookToList(book) {
        const list = document.querySelector('#bookList');
        const row = document.createElement('tr');
        row.className = 'opacity-0 transform translate-y-2 transition-all duration-300';
        row.innerHTML = `
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        📖
                    </div>
                    <div class="ml-3">
                        <div class="text-sm font-medium text-slate-900">${book.title}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="text-sm text-slate-900">${book.author}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                    ${book.genre}
                </span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="text-sm text-slate-600">${book.isbn}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                    book.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-red-800'
                }">
                    ${book.status}
           </span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="openEditModal('${book.id}')" class="text-blue-600 hover:text-blue-900 transition-colors">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                    </span>
                </button>
                <button onclick="UI.deleteBook(this)" data-id="${book.id}" class="text-red-600 hover:text-red-900 transition-colors">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                    </span>
                </button>
            </td>
        `;
        list.appendChild(row);
        setTimeout(() => {
            row.classList.remove('opacity-0', 'translate-y-2');
        }, 50);
    }

    static deleteBook(el) {
        if (confirm('Are you sure you want to delete this book?')) {
            const row = el.parentElement.parentElement;
            const id = el.getAttribute('data-id');
            
            row.classList.add('opacity-0', 'translate-y-2');
            
            setTimeout(() => {
                row.remove();
                Store.removeBook(id);
                UI.showToast('Book removed successfully', 'success');
                UI.updateStats();
            }, 300);
        }
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#status').value = 'Available';
        document.querySelector('#genre').value = 'Fiction';
    }

    static showToast(message, type = 'success') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: 'right',
            className: "rounded-lg",
            style: {
                background: type === 'success' 
                    ? 'linear-gradient(to right, #059669, #10B981)' 
                    : 'linear-gradient(to right, #DC2626, #EF4444)',
            },
            stopOnFocus: true,
        }).showToast();
    }

    static updateBook(book) {
        const books = Store.getBooks();
        const updatedBooks = books.map(b => b.id === book.id ? book : b);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        UI.showToast('Book updated successfully', 'success');
        UI.displayBooks();
    }

    static updateStats() {
        const books = Store.getBooks();
        const totalBooks = books.length;
        const availableBooks = books.filter(book => book.status === 'Available').length;
        const unavailableBooks = books.filter(book => book.status === 'Unavailable').length;
        const uniqueGenres = new Set(books.map(book => book.genre)).size;

        // Add null checks before updating stats
        const elements = {
            totalBooks: document.getElementById('totalBooks'),
            availableBooks: document.getElementById('availableBooks'),
            unavailableBooks: document.getElementById('unavailableBooks'),
            genreCount: document.getElementById('genreCount'),
            tableCount: document.getElementById('tableCount')
        };

        // Only update stats if elements exist
        if (elements.totalBooks) UI.animateNumber('totalBooks', totalBooks);
        if (elements.availableBooks) UI.animateNumber('availableBooks', availableBooks);
        if (elements.unavailableBooks) UI.animateNumber('unavailableBooks', unavailableBooks);
        if (elements.genreCount) UI.animateNumber('genreCount', uniqueGenres);
        if (elements.tableCount) {
            const visibleBooks = document.querySelectorAll('#bookList tr').length;
            UI.animateNumber('tableCount', visibleBooks);
        }
    }

    static animateNumber(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return; // Add early return if element doesn't exist

        const start = parseInt(element.innerText) || 0;
        const duration = 1000;
        const steps = 60;
        const increment = (target - start) / steps;
        let current = start;
        let step = 0;

        const animation = setInterval(() => {
            step++;
            current += increment;
            if (element) { // Check if element still exists
                element.innerText = Math.round(current);
            }

            if (step >= steps || !element) {
                if (element) element.innerText = target;
                clearInterval(animation);
            }
        }, duration / steps);
    }

    static showActionResult(element, success = true) {
        element.classList.add('relative', 'overflow-hidden');
        
        const animation = document.createElement('div');
        animation.className = `absolute inset-0 ${success ? 'bg-green-50' : 'bg-red-50'} opacity-0 transition-opacity duration-500`;
        
        element.appendChild(animation);
        requestAnimationFrame(() => {
            animation.classList.add('opacity-100');
            setTimeout(() => {
                animation.classList.remove('opacity-100');
                setTimeout(() => animation.remove(), 500);
            }, 1000);
        });
    }

    static updateTableCount(count) {
        const tableCount = document.getElementById('tableCount');
        if (tableCount) {
            tableCount.textContent = count;
        }
    }

    // Add event listeners
    static setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(() => UI.displayBooks(), 300));
        }

        // Filters
        const filterGenre = document.getElementById('filterGenre');
        const sortBy = document.getElementById('sortBy');
        
        if (filterGenre) {
            filterGenre.addEventListener('change', () => UI.displayBooks());
        }
        
        if (sortBy) {
            sortBy.addEventListener('change', () => UI.displayBooks());
        }
    }
}

// Store Class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(id) {
        const books = Store.getBooks();
        const updatedBooks = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
    }

    static getBookById(id) {
        const books = Store.getBooks();
        return books.find(book => book.id === id);
    }
}

// Utility function for debouncing search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    UI.displayBooks();
    UI.setupEventListeners();
});

// Event: Add a Book
document.querySelector('#bookForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value.trim();
    const author = document.querySelector('#author').value.trim();
    const isbn = document.querySelector('#isbn').value.trim();
    const status = document.querySelector('#status').value;
    const genre = document.querySelector('#genre').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showToast('Please fill in all fields', 'error');
        return;
    }

    const books = Store.getBooks();
    if (books.some(book => book.isbn === isbn)) {
        UI.showToast('A book with this ISBN already exists', 'error');
        return;
    }

    const id = Date.now().toString();
    const book = new Book(id, title, author, isbn, status, genre);
    UI.addBookToList(book);
    Store.addBook(book);
    UI.clearFields();
    UI.showToast('Book added successfully', 'success');
    UI.updateStats();
});

// Modal Functions
function openEditModal(id) {
    const modal = document.getElementById('editBookModal');
    if (!modal) return;

    const book = Store.getBookById(id);
    if (!book) return;
    
    // Set values for all form fields
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editIsbn').value = book.isbn;
    document.getElementById('editStatus').value = book.status;
    document.getElementById('editGenre').value = book.genre || 'Fiction';
    
    modal.classList.remove('hidden');
}

function closeEditModal() {
    const modal = document.getElementById('editBookModal');
    if (modal) {
        modal.classList.add('hidden');
        // Clear the form fields
        document.getElementById('editBookForm').reset();
    }
}

// Event: Save Edit
document.getElementById('saveEditButton')?.addEventListener('click', () => {
    // Get the form values directly
    const id = document.getElementById('editBookId').value;
    const title = document.getElementById('editTitle').value.trim();
    const author = document.getElementById('editAuthor').value.trim();
    const isbn = document.getElementById('editIsbn').value.trim();
    const status = document.getElementById('editStatus').value;
    const genre = document.getElementById('editGenre').value;

    if (!title || !author || !isbn) {
        UI.showToast('Please fill in all fields', 'error');
        return;
    }

    const books = Store.getBooks();
    if (books.some(book => book.isbn === isbn && book.id !== id)) {
        UI.showToast('A book with this ISBN already exists', 'error');
        return;
    }

    const book = new Book(id, title, author, isbn, status, genre);
    UI.updateBook(book);
    closeEditModal();
}); 