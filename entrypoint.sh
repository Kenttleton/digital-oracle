#!/bin/bash

# Start Ollama in the background
/bin/ollama serve &

# Record the background process ID
pid=$!

# Wait for Ollama to start (adjust sleep time if necessary)
sleep 5
echo "🔴 Pulling models..."

# Pull the desired model
ollama pull gemma3n:e2b 
ollama pull gemma3n:e4b

echo "🟢 Done!"

ollama list

# Wait for the background Ollama process to finish (it won't as it runs indefinitely)
wait $pid