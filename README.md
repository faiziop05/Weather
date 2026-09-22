# Weather

A React Native weather app with city search and hourly forecasts.

## Overview

Weather is an Expo/React Native app that fetches current conditions and forecast data from a weather API and presents them per searched city, including an hourly breakdown for the next 24 hours and detailed metrics (temperature, humidity, and more) for the current day.

## Problem it solves

Gives users a quick, focused mobile view of a city's current and near-term weather without the clutter of a general-purpose weather app.

## Key features

- **City search** — look up current weather for any city.
- **Hourly forecast** — view weather data for the next 24 hours.
- **Today's weather detail** — temperature, humidity, and other current-day metrics.
- **Local persistence** — uses `AsyncStorage` (e.g. for last-searched city/state).
- **Cross-platform** — runs on Android and iOS via Expo.

## What's unique about it

- Forecast data is centralized in a dedicated `forcastdata.js` module, keeping the API/data-shaping logic separate from the search and screen components.
- Uses a lightweight, dependency-minimal stack (no state management library) built directly on Expo + React Navigation, keeping the app small and fast to start.

## Tech stack

- **React Native** (0.74) with **Expo** (~51)
- **React Navigation** (native + stack)
- **AsyncStorage** for local persistence
- **react-native-gesture-handler**, **react-native-screens**, **react-native-safe-area-context**

## Setup / running instructions

```bash
npm install
npm start
```

Run on a specific platform:
```bash
npm run android
npm run ios
npm run web
```
