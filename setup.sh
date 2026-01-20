#!/bin/bash

echo "🔮 Setting up Digital Oracle..."

# Start all services
echo "Starting Docker containers..."
docker-compose up -d

echo ""
echo "✨ Setup complete!"
echo ""
echo "Ollama model is being downloaded in the background. This may take some time depending on your internet speed."
echo "You can monitor the download progress by checking the logs:"
echo "  docker-compose logs -f ollama"
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