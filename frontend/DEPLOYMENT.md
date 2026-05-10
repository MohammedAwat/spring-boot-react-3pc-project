# CineVerse — Tomcat Deployment Guide

## Step 1 — Configure the API Base URL

Open `src/config/api.js` and change `BASE_URL` to your Tomcat server's LAN IP:

```js
export const BASE_URL = "http://192.168.X.X:8080/backend/api";
```

---

## Step 2 — Set the Vite `base` Path

Open `vite.config.js` and **uncomment** the `base` line, replacing `cinema` with
whatever context path your WAR is deployed under (e.g., `cinema`):

```js
base: "/cinema/",
```

> [!IMPORTANT]
> If you skip this step, asset paths inside `dist/index.html` will be relative to `/`
> and will **404** when Tomcat serves the app from a sub-path like `/cinema`.

---

## Step 3 — Build the Production Bundle

```powershell
cd "C:\Users\shvan\OneDrive\Desktop\Front-End"
npm run build
```

This creates a `dist/` folder containing:
```
dist/
├── index.html
├── assets/
│   ├── index-XXXX.css
│   └── index-XXXX.js
└── vendor/
    └── bootstrap/
        ├── bootstrap.min.css
        ├── bootstrap.bundle.min.js
        ├── bootstrap-icons.min.css
        └── fonts/
            └── bootstrap-icons.woff2
```

---

## Step 4 — Deploy to Tomcat

### Option A — Deploy as a folder (easiest for dev)

1. Copy the entire `dist/` directory into Tomcat's `webapps/` folder and rename it to your context name:
   ```
   $TOMCAT_HOME/webapps/cinema/
   ```
2. The folder must contain `index.html` at its root.

### Option B — Package as a WAR file

```powershell
# Inside dist/ folder
Compress-Archive -Path ".\dist\*" -DestinationPath "cinema.zip"
Rename-Item "cinema.zip" "cinema.war"
Copy-Item "cinema.war" "$env:TOMCAT_HOME\webapps\"
```

Tomcat will auto-deploy on the next startup.

---

## Step 5 — Handle React Router (SPA Routing)

Because React Router uses client-side routing, **direct URL access** (e.g., refreshing `/movie/5`) will return a 404 from Tomcat.  
Fix this by adding a `WEB-INF/web.xml` inside the deployed folder:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
         https://jakarta.ee/xml/ns/jakartaee/web-app_5_0.xsd"
         version="5.0">
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>
```

Place this file at:  
`$TOMCAT_HOME/webapps/cinema/WEB-INF/web.xml`

---

## Step 6 — Restart Tomcat & Access the App

```bash
# Linux/Mac
$TOMCAT_HOME/bin/shutdown.sh
$TOMCAT_HOME/bin/startup.sh

# Windows
%TOMCAT_HOME%\bin\shutdown.bat
%TOMCAT_HOME%\bin\startup.bat
```

Then open in your browser:
```
http://192.168.X.X:8080/cinema/
```

---

## CORS Note

If your Java backend (Spring Boot / Jakarta EE) is running on the same Tomcat instance (port 8080),
you may need to allow CORS from the frontend's origin. In Spring Boot:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://192.168.X.X:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

---

## Quick Reference — Dev vs Production

| Setting | Development | Production (Tomcat) |
|---|---|---|
| API Base URL | `http://192.168.X.X:8080/backend/api` | Same |
| Vite base | `/` (default) | `/cinema/` (uncommented) |
| Bootstrap | Served from `public/vendor/` | Bundled in `dist/vendor/` |
| Run command | `npm run dev` | `npm run build` → copy `dist/` |
