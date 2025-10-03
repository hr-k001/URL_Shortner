Simple URL Shortener (Node.js, Express, MongoDB)
This is a full-stack, single-page application designed to shorten long URLs and track their usage history. The backend is built with Express.js and uses MongoDB for persistence.

Features
URL Shortening: Generate a unique, short ID for any long URL.

Persistent Storage: Mongoose and MongoDB ensure that all URL mappings are saved between server restarts.

Redirection: When a user visits the short URL (http://localhost:3000/shortId), they are redirected to the original long URL.

Visit Tracking: Each time a short link is visited, a timestamp is recorded in the MongoDB document's visitHistory array.

CORS Enabled: Uses the cors middleware to allow the client (running on a different port/origin) to communicate with the API.
