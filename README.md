# pair-program
Discuss, Solve and Code together with your friends.

Tech Stack
- Real time updates using Web Sockets (ws library) and CRDT (using Y.js). 
- Livekit for Audio and Video integration.
- Express + Typescript for the backend
- Nextjs with tailwind css

## Join rooms
![Home](./frontend/public/image.png)

## Code Together
![Room](./frontend/public/code-together.png)

## AI Question generation (using Gemini)
![Question](./frontend/public/question.png)

## Review your solution
![Solution](./frontend/public/solution.png)

## Conflict management
Handled via Y.js (CRDT)

## Running the app
docker compose up (--build if image not there)