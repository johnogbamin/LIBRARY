# Library Management System

A modern web-based Library Management System built with JavaScript, Tailwind CSS, and Local Storage. This application provides full CRUD functionality for managing books in a library.

## Features

- Add new books with title, author, ISBN, and availability status
- View all books in a responsive table layout
- Edit existing book information
- Delete books from the system
- Data persistence using Local Storage
- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Form validation

## Tech Stack

- HTML5
- JavaScript (ES6+)
- Tailwind CSS
- Toastify JS for notifications
- Local Storage for data persistence

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd library-management-system
```

2. Open `index.html` in your web browser or use a local development server.

## Development

### Git Workflow

1. Create a new branch for each feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "Description of changes"
```

3. Push your changes to the remote repository:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request for code review

### Best Practices

- Keep commits atomic and focused on single changes
- Write descriptive commit messages
- Review code before creating pull requests
- Test all CRUD operations before committing
- Validate form inputs
- Handle errors gracefully

## Deployment

The application can be deployed to Vercel using the following steps:

1. Create a Vercel account if you haven't already
2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Deploy the application:
```bash
vercel
```

4. Follow the prompts to complete the deployment

## Project Structure

```
library-management-system/
├── index.html          # Main HTML file
├── js/
│   └── app.js         # JavaScript application logic
├── README.md          # Project documentation
└── .gitignore        # Git ignore file
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 