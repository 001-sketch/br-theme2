# Lazuli Salon & Spa

A responsive static website for Lazuli Salon & Spa in Thika, Kenya. It presents the salon's services, team, reviews, contact details, and appointment booking options.

## Project structure

- `index.html` - Page content and semantic markup
- `styles.css` - Layout, responsive styling, and image presentation
- `script.js` - Hero slideshow, mobile navigation, smooth scrolling, reviews marquee, and appointment form behavior
- `public/` - Images and video assets

## Run locally

Because this is a static site, no build step is required. Serve the project folder with any local web server, then open the provided local URL.

For example, with Python installed:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser.

## Notes

- Appointment form submissions use EmailJS.
- External booking links point to the salon's Ilovalue booking page.
