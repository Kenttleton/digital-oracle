#!/bin/bash

# Development script for running frontend and backend separately

echo "🔮 Starting Digital Oracle in Development Mode..."
echo ""

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "Error: main.py not found. Please run this script from the project root."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start frontend dev server
echo "Starting frontend dev server..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a bit for frontend to start
sleep 2

# Start backend
echo "Starting backend server..."
echo ""
pipenv run python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo ""
echo "✨ Development servers running:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait