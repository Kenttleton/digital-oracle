# 🔮 Digital Oracle

An AI-powered tarot reading application that combines mystical tradition with modern technology. Get personalized tarot readings interpreted by a local LLM, with a beautiful web interface.

## ✨ Features

- **🎴 Multiple Spread Types**: Daily insight, past/present/future, mind/body/spirit, and more
- **🤖 AI-Powered Interpretations**: Local LLM (Ollama) provides personalized, contextual readings
- **🗄️ MySQL Database**: Complete tarot card database with descriptions and keywords
- **🎨 Beautiful UI**: Modern React/TypeScript interface with mystical aesthetics
- **🐳 Docker Ready**: One-command deployment with docker-compose
- **🔒 Privacy-First**: All data stays on your server - no external API calls

## 🎯 Supported Spreads

- **Daily Insight** - Single card for daily guidance
- **Past / Present / Future** - Classic 3-card temporal spread
- **Mind / Body / Spirit** - Holistic wellness reading
- **Love / Money / Home** - Life area focus
- **Option A / Option B / Advice** - Decision-making spread
- **Yes or No** - 3-card yes/no divination
- **More TBD** - More complicated layouts are planned

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- At least 8GB RAM (for Ollama)
- Optional: NVIDIA GPU for faster inference

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Kenttleton/digital-oracle.git
cd digital-oracle
```

1. **Run the setup script:**

```bash
chmod +x setup.sh
./setup.sh
```

This will:

- Start MySQL database and run migrations
- Seed the database with tarot card data
- Build the React frontend
- Start Ollama LLM service
- Pull the default model (gemma:2b)
- Build and start the FastAPI backend

1. **Access the app:**

   Open your browser to [http://localhost:8000](http://localhost:8000)

## 🛠️ Development Setup

For local development with hot reload:

```bash
# Install dependencies
pipenv install
cd frontend && npm install && cd ..

# Start database and Ollama
docker-compose up db ollama -d

# Pull the model
docker exec ollama ollama pull gemma:2b

# Run dev servers (backend + frontend with hot reload)
chmod +x dev.sh
./dev.sh
```

Frontend dev server: [http://localhost:5173](http://localhost:5173)  
Backend API: [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
digital-oracle/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx           # Main application component
│   │   └── types/            # TypeScript type definitions
│   │       ├── DrawnCard.ts  # Card metadata type
│   │       └── Spreads.ts    # Spread metadata type
│   └── package.json          # Frontend dependencies
├── db/                       # Database migrations
│   ├── 01_init_schema.sql
│   └── 02_seed_major_arcana.sql
│   └── 03_seed_minor_arcana.sql
├── main.py                   # FastAPI application
├── deck.py                   # Tarot deck logic
├── spreads.py                # Spread definitions
├── llm.py                    # LLM integration
├── models.py                 # Data models
├── db.py                     # Database integration methods
├── docker-compose.yml        # Service orchestration
└── Dockerfile                # Multi-stage build
```

## 🔧 Configuration

### Environment Variables

Configure these in `docker-compose.yml`:

```yaml
DB_HOST: db
DB_PORT: 3306
DB_USER: tarot_user
DB_PASSWORD: tarot_pass
DB_NAME: tarot_db
OLLAMA_HOST: http://ollama:11434
```

### Using Different Models

The default model is `gemma:2b` (lightweight, Docker-friendly). To use a different model:

1. **Pull the model:**

```bash
docker exec ollama ollama pull phi3
```

1. **Update `llm.py`:**

```python
model: str = "phi3"  # Change from gemma:2b
```

**Recommended lightweight models:**

- `gemma:2b` - Best overall for Docker (1.5GB)
- `phi3` - Better reasoning, slightly larger (2.3GB)
- `tinyllama` - Fastest/smallest (637MB)

## 📊 Database Schema

### tarot cards minimal data model

- `name` - Card name
- `number` - Card number
- `arcana` - Major or Minor
- `element` - Associated element
- `suit` - Card suit (Minor Arcana)
- `orientation` - Card orientation on draw
- `image_url` - Card image URL

## 🎨 API Endpoints

### `POST /api/interpret`

Generate a new tarot interpretation with the LLM given a set of cards, the spread used, and the question posed.

**Request:**

```typescript
type Orientation = "upright" | "reversed";

type DrawnCard = {
    name: string;
    number: number | null;
    arcana: string;
    element: string | null;
    suit: string | null;
    position: number;
    orientation: Orientation;
    image_url: string | null;
};

type InterpretationRequest = {
  question: string;
  spread: string;
  cards: DrawnCard[];
  depth: string;
}
```

Example Request:

```json
{
  "question": "What do I need to focus on today?",
  "spread": "daily",
  "cards": [{
    "name": "The Fool",
    "number": 0,
    "arcana": "Major",
    "element": "Air",
    "suit": null,
    "position": 1,
    "orientation": "upright",
    "image_url": null,
  }],
  "depth": "standard"
}
```

**Response:**

```json
{
  "cards": [...],
  "interpretation": "Your reading reveals...",
  "spread_name": "Daily Insight"
}
```

### `GET /api/draw`

Shuffle and draw cards based on the spread given.

### `GET /api/health`

Health check endpoint

## 🐳 Docker Commands

**View logs:**

```bash
docker-compose logs -f
docker-compose logs -f api  # Just API logs
```

**Restart services:**

```bash
docker-compose restart
```

**Rebuild after changes:**

```bash
docker-compose up -d --build
```

**Reset database:**

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recreate with fresh data
```

**Access MySQL:**

```bash
docker exec -it mysql mysql -u tarot_user -p
# Password: tarot_pass
```

## 🎯 Roadmap

- [ ] Optimize CPU usage during image rendering (might be hardware dependent)
- [ ] Fine-tune LLM prompts for better "feel"
- [ ] Support complex spreads (Celtic Cross, Tree of Life, Chakra, etc)
- [ ] User authentication for public deployment
- [ ] Token tracking for resource management
- [ ] Reading history and favorites
- [ ] Mobile app version

## 🐛 Troubleshooting

**Ollama not responding:**

- Ensure model is pulled: `docker exec ollama ollama list`
- Check logs: `docker-compose logs ollama`

**Out of memory:**

- Use a smaller model like `gemma:2b` or `tinyllama`
- Increase Docker memory limit in Docker Desktop

**Database connection issues:**

- Wait for MySQL health check to pass
- Verify credentials in docker-compose.yml

**Frontend not loading:**

- Check static files: `docker exec digital_oracle ls /app/static`
- Rebuild: `docker-compose up -d --build`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Tarot card data and imagery from traditional Rider-Waite deck
- Built with FastAPI, React, and Ollama
- Inspired by the ancient art of tarot reading

---

**Note:** This is a spiritual/entertainment tool. Tarot readings should not replace professional advice for serious life decisions.
