# Stachie's World - Tamagotchi Game

A mobile-first Progressive Web App (PWA) featuring Stachie, a 10-year-old fluffy gray cat with a distinctive mustache mark.

## Features

### Core Mechanics (V0)
- **Hunger System**: Feed Stachie to keep her happy
- **Hygiene System**: Keep Stachie clean and groomed
- **Sleep System**: Manage Stachie's energy levels
- **Health System**: Monitor and treat illness
- **Waste Management**: Clean the litter box
- **Mood System**: Reflects Stachie's overall well-being

### Stachie's Personality
- Loves sleeping (slightly anxious personality)
- Shows different moods: Happy, Content, Anxious, Sad, Sick
- Animated reactions to interactions
- Distinctive gray mustache marking

## Quick Start

### 1. Generate Icons
Open `generate-icons.html` in a browser and click "Download Icons" to create the app icons.

### 2. Set Up Icons
```bash
mkdir icons
# Move downloaded icons to the icons folder
```

### 3. Local Testing
```bash
# Install a simple HTTP server if you don't have one
npm install -g http-server

# Run the server
http-server -p 8080

# Open http://localhost:8080 in your browser
```

## Deployment Options

### Option 1: PWA Installation (Recommended)
1. Host the files on any HTTPS server (GitHub Pages, Netlify, Vercel)
2. Visit the URL on your girlfriend's phone
3. iOS: Tap Share → Add to Home Screen
4. Android: Chrome menu → Install App

### Option 2: GitHub Pages (Free Hosting)
```bash
# Create a new GitHub repository
git init
git add .
git commit -m "Initial Stachie game"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main

# Enable GitHub Pages in repository settings
# Share the URL: https://yourusername.github.io/stachie-game
```

### Option 3: Netlify Drop (Instant Deploy)
1. Visit https://app.netlify.com/drop
2. Drag and drop the project folder
3. Get instant URL to share

### Option 4: Local Network
```bash
# Find your local IP
ifconfig # or ipconfig on Windows

# Run server
http-server -p 8080

# Access from phone: http://YOUR_LOCAL_IP:8080
```

## Game Instructions

### Actions
- **Feed**: Give Stachie food (increases hunger stat)
- **Clean**: Groom Stachie (increases hygiene)
- **Sleep**: Toggle sleep mode (restores energy)
- **Play**: Play with yarn (decreases energy, improves mood)
- **Medicine**: Treat illness when sick
- **Litter**: Clean the litter box

### Stats
- **Hunger** (🍽️): Decreases over time, feed to replenish
- **Hygiene** (🧼): Decreases slowly, clean to improve
- **Energy** (😴): Decreases when awake, restored by sleeping
- **Health** (❤️): Affected by other stats, use medicine when low

### Tips
- Keep all stats above 60% for a happy Stachie
- Stachie gets anxious when stats are low
- After feeding, watch for waste indicators
- Game auto-saves every 5 seconds
- Stats continue decreasing when app is closed (realistic pet care!)

## Technical Details

### Tech Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Canvas API for sprite rendering
- LocalStorage for game persistence
- Service Worker for offline capability
- PWA manifest for installability

### Browser Support
- iOS Safari 12+
- Chrome/Edge 80+
- Firefox 75+
- Samsung Internet 12+

### Performance
- Optimized for mobile devices
- 60 FPS animations
- Minimal battery usage
- Works offline after first load

## Future Enhancements (V1)

### Planned Features
- Mini-games (chase the laser, catch the mouse)
- Multiple cats to choose from
- Customization options (accessories, backgrounds)
- Achievement system
- Visit to vet mechanics
- Seasonal events

### Sprite Improvements
- More detailed animations
- Different poses and expressions
- Interaction animations
- Environmental decorations

## Development

### File Structure
```
/
├── index.html          # Main game HTML
├── styles.css          # Game styling
├── script.js           # Game logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── generate-icons.html # Icon generator
├── icons/             # App icons
│   ├── icon-192x192.png
│   └── icon-512x512.png
└── README.md          # This file
```

### Customization
- Modify `script.js` to adjust game mechanics
- Update `styles.css` for visual changes
- Edit stat decay rates in `updateStats()` method
- Customize Stachie's appearance in `drawStachie()` method

## Credits
Created with love for your girlfriend, featuring her special cat Stachie! 🐱💕