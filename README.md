# Clipster - URL Shortener App

Clipster is a URL shortening service that allows users to convert long URLs into short, memorable, and trackable links. You can shorten links with or without an account, and track them if you choose to sign up.

---

## Features

- **Shorten URLs**: Paste long URLs and get short versions.
- **Custom Aliases**: Optionally create custom short links.
- **Track Links**: View analytics for your shortened links (login required).
- **Dark/Light Mode**: Toggle between dark and light themes.
- **User Authentication**: Sign up or log in to save your links and view statistics.

---

## Tech Stack

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Django (or your chosen API backend)
- **Authentication**: Token-based authentication (JWT or DRF Token Authentication)
- **Deployment**: (e.g., Vercel, Netlify, or your own server)

---

## Installation

### 1. Clone the repository

git clone https://github.com/your-username/clipster-app.git
cd clipster-app

### 2. Install dependencies
Make sure you have Node.js installed. Then, install frontend dependencies with:
npm install

For the backend, set up a virtual environment and install the required Python packages (e.g., using pip):
python -m venv env
source env/bin/activate  # On Windows use: env\Scripts\activate
pip install -r requirements.txt


### 3. Set up Environment Variables

Create a .env file at the root of the frontend project and add:
VITE_API_BASE_URL=http://localhost:8000  # Replace with your backend API URL when deployed

For the backend, create a .env file (or use python-decouple) with:
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

## Running Locally

### Frontend

Start the Vite development server:
npm run dev
The app should be available at http://localhost:5173 or 3000

### Backend
If you are using Django, run the development server:
python manage.py runserver
Ensure your backend API is running and accessible at the URL specified in your .env file.

## Usage
Shorten URLs: Paste a long URL into the input box and click the "Shorten Link" button.

Custom Alias: Optionally, create a custom alias for your shortened URL.

Track Links: After shortening a URL, view your shortened link and track its usage if you are logged in.

## Authentication
Login: Sign in if you have an account.

Sign Up: Create an account to save your links and view statistics.

Once logged in, you can access your dashboard to manage and analyze your links.

## Contributing
Contributions are welcome! Follow these steps to contribute:

Fork the repository.

Create a new branch (git checkout -b feature/my-feature).

Make your changes.

Commit your changes (git commit -am 'Add new feature').

Push to the branch (git push origin feature/my-feature).

Open a pull request.

## Acknowledgments
Thanks to TailwindCSS for the fantastic utility-first CSS framework.

Thanks to React for the powerful frontend library.

Thanks to Vite for the fast development environment.

Thanks to Django for the robust backend framework.
