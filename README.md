# 🔮 Mystic Tarot Reading App

A full-stack tarot reading application with MySQL database, LLM-powered interpretations, and 1-hour caching. Built with React/TypeScript frontend and FastAPI backend, all served from a single Python server.

## Roadmap

- Figure out CPU load issue causing image render to wait for interpretation. So far this is Docker only. (smaller model, GPU, python instead of API)
- Adjust LLM until it "feels" better.
- Figure out how to handle complex spreads like Irish Cross, Tree of Life, and Major Arcana spreads.
- Public deployment. Will need login and token tracking to limit resource consumption.

## Features

- **MySQL Database**: Stores tarot card data with descriptions and keywords
- **Intelligent Caching**: Caches readings for 1 hour to provide consistent extended readings
- **LLM Integration**: Uses Ollama (llama3.2) for personalized interpretations
- **Docker Containerized**: Easy deployment with docker-compose
- **React + TypeScript Frontend**: Beautiful, mystical UI served by FastAPI
- **Single Server**: Frontend and API served from the same Python server

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: MySQL 8.0
- **LLM**: Ollama (llama3.2)
- **Deployment**: Multi-stage Docker build

## Project Structure

```
tarot-app/
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main React component
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Tailwind styles
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── postcss.config.js         # PostCSS configuration
├── db/
│   ├── 01_init_schema.sql        # Database schema
│   └── 02_seed_tarot_cards.sql   # Tarot card seed data
├── server.py                     # FastAPI backend + static file serving
├── Pipfile                       # Python dependencies
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml            # Multi-container orchestration
├── .dockerignore                 # Docker ignore file
├── setup.sh                      # Production setup script
├── dev.sh                        # Development script
└── README.md                     # This file
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM for Ollama
- (Optional) NVIDIA GPU for faster LLM inference

### Production Setup (Docker)

1. **Create project directory and files:**

```bash
mkdir -p tarot-app/db tarot-app/frontend/src
cd tarot-app
```

2. **Create all the files** as shown in the project structure above

3. **Make setup script executable:**

```bash
chmod +x setup.sh
```

4. **Run setup:**

```bash
./setup.sh
```

This will:
- Start MySQL database and automatically run migrations
- Seed the database with 22 Major Arcana cards
- Build the React frontend
- Start Ollama LLM service
- Build and start the FastAPI backend
- Pull the llama3.2 model (may take 10-15 minutes)

5. **Access the app:**
   - Open browser to http://localhost:8000
   - The React UI and API are served from the same server

### Development Setup (Local)

For frontend development with hot reload:

1. **Install dependencies:**

```bash
# Python dependencies
pipenv install

# Frontend dependencies
cd frontend
npm install
cd ..
```

2. **Start database and Ollama:**

```bash
docker-compose up db ollama -d
```

3. **Wait for Ollama and pull model:**

```bash
docker exec tarot_ollama ollama pull llama3.2
```

4. **Run development servers:**

```bash
chmod +x dev.sh
./dev.sh
```

This starts:
- Frontend dev server with hot reload on http://localhost:5173
- Backend API on http://localhost:8000
- Vite proxy forwards `/api/*` requests to backend

## Database Migrations

Database migrations are automatically run when the MySQL container starts for the first time. The SQL files in the `db/` directory are executed in alphabetical order:

1. `01_init_schema.sql` - Creates tables and indexes
2. `02_seed_tarot_cards.sql` - Populates tarot card data

**To reset the database:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate and re-run migrations
```

**To add new migrations:**
- Create a new SQL file with the next number (e.g., `03_add_new_feature.sql`)
- Place it in the `db/` directory
- Restart the database container

## Database Schema

### tarot_cards Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(100) | Card name |
| description | TEXT | Card description |
| keywords | TEXT | Associated keywords |
| created_at | TIMESTAMP | Creation time |

### readings_cache Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| question_hash | VARCHAR(64) | SHA256 hash of question |
| question | TEXT | Original question |
| cards | JSON | Selected cards array |
| interpretation | TEXT | LLM interpretation |
| created_at | TIMESTAMP | Cache creation time |
| expires_at | TIMESTAMP | Cache expiration time |

## Caching Behavior

- Questions are hashed using SHA256
- Cache duration: **1 hour** from creation
- Same question within 1 hour returns cached reading
- Expired cache entries are cleaned up on server startup
- Case-insensitive matching (questions normalized to lowercase)
- Cached readings show an "Extended Reading" badge

## API Endpoints

### `POST /api/reading`
Generate a tarot reading

**Request:**
```json
{
  "question": "What does my future hold?"
}
```

**Response:**
```json
{
  "cards": ["The Fool", "The Magician", "The Star"],
  "interpretation": "Your reading reveals...",
  "cached": false
}
```

### `GET /api/health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### `GET /`
Serves the React application

## Docker Commands

**View logs:**
```bash
docker-compose logs -f
docker-compose logs -f api  # Just API logs
```

**Restart services:**
```bash
docker-compose restart
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

**Stop services:**
```bash
docker-compose down
```

**Stop and remove all data:**
```bash
docker-compose down -v
```

**Access MySQL directly:**
```bash
docker exec -it tarot_mysql mysql -u tarot_user -p
# Password: tarot_pass
```

## Environment Variables

You can customize these in `docker-compose.yml`:

- `DB_HOST`: MySQL host (default: db)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_USER`: Database user (default: tarot_user)
- `DB_PASSWORD`: Database password (default: tarot_pass)
- `DB_NAME`: Database name (default: tarot_db)

## Using Different LLM Models

To use a different Ollama model:

1. Pull the model:
```bash
docker exec tarot_ollama ollama pull mistral
```

2. Update `server.py` line with the model name:
```python
"model": "mistral",  # Change from llama3.2
```

## Frontend Development

The frontend is built with:
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with hot reload
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Key Features:
- Responsive design
- Loading states and error handling
- Keyboard shortcuts (Ctrl+Enter to submit)
- Cached reading indicator
- Smooth animations

### Customizing the UI:

Edit `frontend/src/App.tsx` to modify the interface. Changes are automatically reflected in development mode.

## Build Process

The Docker build uses a multi-stage approach:

1. **Stage 1 (Node)**: Builds the React frontend with Vite
   - Installs npm dependencies
   - Runs `npm run build`
   - Outputs to `/static` directory

2. **Stage 2 (Python)**: Creates the final image
   - Installs Python dependencies
   - Copies backend code
   - Copies built frontend from stage 1
   - Serves everything with FastAPI

This results in a single, optimized container.

## Troubleshooting

**Frontend not loading:**
- Check if static files exist: `docker exec tarot_api ls /app/static`
- Rebuild: `docker-compose up -d --build`

**Ollama not responding:**
- Check if container is running: `docker ps`
- View logs: `docker-compose logs ollama`
- Ensure model is pulled: `docker exec tarot_ollama ollama list`

**Database connection issues:**
- Wait for MySQL to be fully ready (check health status)
- Verify credentials in docker-compose.yml

**Out of memory:**
- Ollama requires ~4-8GB RAM depending on model
- Consider using a smaller model like `llama3.2:1b`

**Build fails:**
- Ensure Node.js 20+ is available in builder stage
- Check frontend build errors: `cd frontend && npm run build`

## License

MIT