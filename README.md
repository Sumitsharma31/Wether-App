![Page InterFace](https://github.com/Sumitsharma31/Wether-App/blob/main/public/wetherUI.png?raw=true);

Weather App Technical Documentation
This document provides a brief overview of the technologies and architecture used to create the dynamic and animated weather web application.

Core Technologies
The application is built on a modern front-end stack, leveraging several key libraries and APIs to deliver a responsive, interactive, and visually appealing user experience.

React.js
The foundation of the application is React, a popular JavaScript library for building user interfaces. The project is structured entirely with functional components and utilizes React Hooks for state management and lifecycle events.

useState: Manages all dynamic data, including the weather data, loading status, error messages, and user input.

useEffect: Handles side effects, specifically the initial API call to fetch the user's location-based weather when the component first loads.

Tailwind CSS
All styling is handled by Tailwind CSS, a utility-first CSS framework. This allows for rapid UI development directly within the JSX markup. It is used for everything from the gradient background and glass-like container effect (backdrop-blur-lg) to the responsive grid layout for the forecast.

Framer Motion
The smooth animations and transitions are powered by Framer Motion, a production-ready animation library for React.

<motion> components: Used to animate elements entering the screen.

AnimatePresence: Manages the animation of components when they are added to or removed from the React tree, which is perfect for handling the loading spinner and error messages.

Lucide React
All icons (such as the sun, clouds, wind, and search icon) are provided by Lucide React. It's a lightweight and highly customizable SVG icon library that ensures the UI remains sharp and clear on all devices.

External APIs
The application relies on external services to fetch its data.

Open-Meteo API
This is the primary source for all weather and forecast information. It's a free, open-source weather API that does not require an API key, making it ideal for development and personal projects. The app makes two main calls to this service:

To get the current weather and hourly data.

To get the 5-day forecast.

Browser Geolocation API
To provide an immediate, relevant experience, the app uses the standard navigator.geolocation API built into modern web browsers. It requests the user's current latitude and longitude on the initial page load to display local weather automatically. If the user denies permission or the API is unavailable, the application gracefully falls back to showing the weather for a default city ("Patna").
