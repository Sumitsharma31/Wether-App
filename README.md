![Page InterFace](https://github.com/Sumitsharma31/Wether-App/blob/main/public/wetherUI.png?raw=true)
React Animated Weather App
A sleek, modern, and responsive weather application built with React and Tailwind CSS. It provides real-time weather data, a 5-day forecast, and features smooth animations powered by Framer Motion.

Features
Real-Time Weather: Get up-to-the-minute weather data for any city.

Automatic Geolocation: Automatically fetches weather for your current location on startup.

5-Day Forecast: Plan ahead with a detailed 5-day weather forecast.

Responsive Design: A clean and fully responsive UI that looks great on any device, from mobile to desktop.

Smooth Animations: Engaging animations and transitions provide a fluid user experience.

Dynamic Icons: Weather conditions are represented by clear, dynamic icons.

Tech Stack
The application is built on a modern front-end stack, leveraging several key libraries and APIs.

React.js: The core of the application is built with React, using functional components and hooks (useState, useEffect) for state management and side effects.

Tailwind CSS: All styling is handled by this utility-first CSS framework, allowing for rapid and consistent UI development.

Framer Motion: Powers all animations, from page load transitions to the subtle interactive elements.

Lucide React: Provides the clean, lightweight, and customizable SVG icons used throughout the UI.

APIs & Services
Open-Meteo API: The primary source for all weather and forecast information. It's a free, open-source weather API that does not require an API key.

Browser Geolocation API: Used to request the user's current location to provide local weather data automatically upon loading the page.

Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js and npm (or yarn) installed on your machine.

Installation
Clone the repository:

git clone https://github.com/your-username/your-repo-name.git

Navigate to the project directory:

cd your-repo-name

Install NPM packages:

npm install

Start the development server:

npm run dev

The application will now be running on http://localhost:5173 (or another port if specified).

To get the 5-day forecast.

Browser Geolocation API
To provide an immediate, relevant experience, the app uses the standard navigator.geolocation API built into modern web browsers. It requests the user's current latitude and longitude on the initial page load to display local weather automatically. If the user denies permission or the API is unavailable, the application gracefully falls back to showing the weather for a default city ("Patna").
