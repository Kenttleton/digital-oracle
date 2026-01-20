#!/bin/bash

echo "🔮 Setting up Tarot Reading App..."

# Start all services
echo "Starting Docker containers..."
docker-compose up -d

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
sleep 10

# Pull the LLM model
echo "Pulling llama3.2 model (this may take a while)..."
docker exec tarot_ollama ollama pull llama3.2

echo ""
echo "✨ Setup complete!"
echo ""
echo "Your services are running:"
echo "  - API: http://localhost:8000"
echo "  - MySQL: localhost:3306"
echo "  - Ollama: http://localhost:11434"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
echo "To stop and remove all data:"
echo "  docker-compose down -v"