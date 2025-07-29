# Lithuania Economic Portal

A comprehensive web application for exploring and analyzing Lithuanian economic data, featuring interactive dashboards, reports, and datasets.

## 🏗️ Architecture

- **Backend**: FastAPI with SQLModel (SQLite database)
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Authentication**: JWT-based authentication system
- **Database**: SQLite with automatic migrations

## 🚀 Features

- **Economic Dashboards**: Interactive visualizations of key economic indicators
- **Reports Gallery**: Browse and view detailed economic reports
- **User Authentication**: Secure login/register system with JWT tokens
- **Admin Panel**: Administrative functionality for managing content
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Lithuanian Design Elements**: National flag and cultural styling

## 📁 Project Structure

```
lt-econ-portal/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models.py       # Database models
│   │   ├── main.py         # FastAPI app configuration
│   │   ├── db.py           # Database connection
│   │   └── routes/         # API endpoints
│   ├── data/               # Economic data files
│   └── requirements.txt    # Python dependencies
├── next-frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   └── context/       # React context providers
│   └── package.json       # Node.js dependencies
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd next-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login

### Economic Data
- `GET /dashboards` - Get all dashboards
- `GET /datasets` - Get all datasets
- `GET /reports` - Get all reports
- `GET /reports/{id}` - Get specific report

## 🎨 Key Features

### Authentication System
- JWT-based authentication
- Protected routes
- User profile management
- Admin role support

### Economic Data Visualization
- Interactive charts and graphs
- Key Performance Indicators (KPIs)
- Lithuanian economic metrics
- Responsive dashboard layouts

### User Interface
- Modern, clean design
- Lithuanian national elements
- Mobile-responsive layout
- Intuitive navigation

## 🚀 Deployment

### Backend Deployment
The backend includes a Dockerfile for containerized deployment:

```bash
cd backend
docker build -t lt-econ-portal-backend .
docker run -p 8000:8000 lt-econ-portal-backend
```

### Frontend Deployment
The Next.js frontend can be deployed to Vercel, Netlify, or any static hosting service:

```bash
cd next-frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Lithuanian economic data sources
- FastAPI and Next.js communities
- Open source contributors

---

**Built with ❤️ for Lithuania's economic data exploration** 