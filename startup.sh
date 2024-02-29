# !/bin/sh

echo "Starting the HR-Project in dev"
tmux new-session -d -s dev -n frontend 'cd frontend && npm run dev':
