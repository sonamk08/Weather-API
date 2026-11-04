let apiKey = "ebc610edbd8b2de5d13bc35457640912";

function setWeatherImage(temp, description = "") {
    let lower = (description || "").toLowerCase();
    let isRainy = lower.includes("rain") || lower.includes("drizzle") || lower.includes("storm") || lower.includes("cloud") && lower.includes("rain");
    let isSnowy = lower.includes("snow") || lower.includes("mist");

    let startColor, endColor, cloudColor, sunColor, accentColor;

    if (temp <= 5) {
        startColor = "#dfe9ff";
        endColor = "#8bb2ff";
        cloudColor = "#edf5ff";
        sunColor = "#dfe8ff";
        accentColor = "#63a4ff";
    } else if (temp <= 20) {
        startColor = "#dff4ff";
        endColor = "#75c9ff";
        cloudColor = "#f5fbff";
        sunColor = "#ffd166";
        accentColor = "#5ab0ff";
    } else if (temp <= 30) {
        startColor = "#fff1bf";
        endColor = "#ffb866";
        cloudColor = "#fffdfd";
        sunColor = "#ffcf5a";
        accentColor = "#ff8c42";
    } else {
        startColor = "#ffd2b3";
        endColor = "#ff7a59";
        cloudColor = "#fff7f2";
        sunColor = "#ffdf7a";
        accentColor = "#ff5d5d";
    }

    if (isRainy) {
        cloudColor = "#dfe8f7";
        accentColor = "#5d7df6";
    }

    if (isSnowy) {
        cloudColor = "#f5f9ff";
        accentColor = "#8bb4ff";
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180">
            <defs>
                <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="${startColor}"/>
                    <stop offset="100%" stop-color="${endColor}"/>
                </linearGradient>
            </defs>
            <rect width="240" height="180" rx="22" fill="url(#sky)"/>
            <circle cx="180" cy="40" r="22" fill="${sunColor}" opacity="0.9"/>
            <g fill="${cloudColor}">
                <ellipse cx="78" cy="110" rx="48" ry="20"/>
                <ellipse cx="109" cy="95" rx="38" ry="22"/>
                <ellipse cx="140" cy="110" rx="52" ry="20"/>
                <ellipse cx="170" cy="98" rx="34" ry="18"/>
            </g>
            <g fill="${accentColor}" opacity="${isRainy ? 0.8 : 0.18}">
                <rect x="95" y="112" width="3" height="16" rx="2"/>
                <rect x="118" y="112" width="3" height="16" rx="2"/>
                <rect x="141" y="112" width="3" height="16" rx="2"/>
                <rect x="164" y="112" width="3" height="16" rx="2"/>
            </g>
            <g fill="${isSnowy ? "#ffffff" : accentColor}" opacity="${isSnowy ? 0.8 : 0.0}">
                <circle cx="96" cy="125" r="3"/>
                <circle cx="118" cy="127" r="3"/>
                <circle cx="142" cy="124" r="3"/>
                <circle cx="164" cy="128" r="3"/>
            </g>
        </svg>
    `;

    document.getElementById("weather-image").src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function getWeather() {
    let city = document.getElementById("city").value;
    if (city === "") {
        alert("Enter a city name!");
        return;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        if (response.ok) {
            let temp = data.main.temp;
            let description = data.weather[0].description;

            document.getElementById("name").innerText =
                data.name + ", " + data.sys.country;
            document.getElementById("temp").innerText =
                temp + " °C";
            document.getElementById("desc").innerText =
                description;
            document.getElementById("error").innerText = "";
            setWeatherImage(temp, description);
        } else {
            document.getElementById("error").innerText =
                data.message;
        }
    } catch (error) {
        document.getElementById("error").innerText =
            "Connection error! Try again.";
    }
}