#!/bin/bash

# Start Ollama in the background
/bin/ollama serve &

# Record the background process ID
pid=$!

# Wait for Ollama to start (adjust sleep time if necessary)
sleep 5
echo "🔴 Pulling models..."

# Pull the desired model
# ollama pull gemma:2b
# ollama pull gemma:7b
ollama pull gemma2:2b
# ollama pull gemma2:9b
# ollama pull gemma3n:e2b 
# ollama pull gemma3n:e4b

echo "🟢 Done!"

ollama list

# Wait for the background Ollama process to finish (it won't as it runs indefinitely)
wait $pid