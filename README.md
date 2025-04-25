# Task Manager Application

This is a full-stack Task Manager application built with Django REST Framework backend and Vue.js 3 frontend.

## Project Structure

```
taskmanager/
├── django_taskmanager_api/  # Backend Django application
└── task-manager/           # Frontend Vue.js application
```

## Getting Your Network IP Address

Before setting up the applications, you'll need your computer's WiFi IP address for proper connection between frontend and backend:

1. On Linux/macOS, use:
   ```bash
   ip addr show
   # or
   ifconfig
   ```

2. On Windows, use:
   ```bash
   ipconfig
   ```

Look for your WiFi interface's IPv4 address (usually starts with 192.168. or 10.0.).

## Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd django_taskmanager_api
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file and update the values as needed:
   - Set a secure `SECRET_KEY`
   - Set `HOST_IP` to your WiFi IP address (e.g., 192.168.1.100)
   - Update `ALLOWED_HOSTS` to include your WiFi IP address
   - Configure `CORS_ALLOWED_ORIGINS` to include `http://YOUR_IP_ADDRESS:5173`

   Example `.env` configuration:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   HOST_IP=192.168.1.100
   ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.100
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://192.168.1.100:5173
   DATABASE_URL=sqlite:///db.sqlite3
   ```

5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   # Run the server on your network interface
   python manage.py runserver 0.0.0.0:8000
   ```
   The API will be available at:
   - Local: `http://localhost:8000`
   - Network: `http://YOUR_IP_ADDRESS:8000`

## Frontend Setup (Vue.js)

1. Navigate to the frontend directory:
   ```bash
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your backend API URL using your WiFi IP address:
   ```
   VITE_API_URL=http://YOUR_IP_ADDRESS:8000
   ```
   Example:
   ```
   VITE_API_URL=http://192.168.1.100:8000
   ```

4. Run the development server:
   ```bash
   # Run the server and expose it to the network
   npm run dev -- --host
   ```
   The frontend will be available at:
   - Local: `http://localhost:5173`
   - Network: `http://YOUR_IP_ADDRESS:5173`

## API Documentation

The Django backend provides a RESTful API. Once the backend server is running, you can access:
- API documentation at `http://localhost:8000/api/docs/`
- Admin interface at `http://localhost:8000/admin/`

## Development

### Backend (Django)
- The Django application uses Django REST Framework for API development
- CORS is configured to allow requests from the Vue.js frontend
- SQLite is used as the default database

### Frontend (Vue.js)
- Built with Vue 3 and TypeScript
- Uses Vite as the build tool
- Includes Vue Router for routing
- Uses Pinia for state management
- Styled with Tailwind CSS
- Includes Vue Toastification for notifications

## Production Deployment

### Backend
1. Set `DEBUG=False` in your production `.env`
2. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` with your production domains
3. Use a production-grade database (e.g., PostgreSQL)
4. Set up proper static files serving
5. Use a production server like Gunicorn

### Frontend
1. Build the production assets:
   ```bash
   cd task-manager
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your web server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 