# URL Shortener

A modern URL shortener application built with Django and React, featuring user authentication, custom aliases, and a beautiful dark/light mode interface.

## Features

- 🔐 User authentication (login/register)
- 🔗 URL shortening with custom aliases
- 📊 Click tracking and analytics
- 🌓 Dark/Light mode
- 📱 Responsive design
- 📋 Copy to clipboard functionality
- 🎨 Modern and clean UI

## Tech Stack

### Backend
- Django
- Django REST Framework
- SQLite (for development)
- JWT Authentication

### Frontend
- React
- Tailwind CSS
- React Router
- Axios

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the backend server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the frontend directory with:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the frontend development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or log in
3. Enter a URL to shorten
4. Optionally, add a custom alias
5. Click "Shorten" to generate your shortened URL
6. Copy and share your shortened URL

## Project Structure

```
url-shortener/
├── backend/
│   ├── shortener/
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API endpoints
│   │   ├── serializers.py # Data serialization
│   │   └── urls.py        # URL routing
│   └── manage.py          # Django management script
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── context/       # React context
    │   └── App.jsx        # Main application
    └── package.json       # Frontend dependencies
```

## API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/links/` - Create a new shortened link
- `GET /api/links/` - Get user's links
- `DELETE /api/links/<id>/` - Delete a link
- `GET /<alias>` - Redirect to original URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Django REST Framework for the powerful API tools
- React for the frontend framework
- Tailwind CSS for the styling
