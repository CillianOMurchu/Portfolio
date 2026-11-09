# WeatherEffects (unused)

Parked 2026-11-09: no longer rendered anywhere. Self-contained: canvas scenes, `WeatherPicker`, and the
`services/` it needs (visitor location + Open-Meteo lookup; the server half is `api/location`).

To restore on the home page, render `<WeatherEffect weather={scene.id} sky={scene.sky} />`
(or `<RainEffect>` for rain) using `getVisitorLocation` → `getCurrentWeather` → `skyForWeatherCode`.
