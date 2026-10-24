# Sevayu Foundation

Donation and portfolio website for Sevayu Foundation, which serves the residents of Vraja with food, healthcare, education and daily support.

A static site: plain HTML, CSS and JavaScript, no build step.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server, for example:

```
npx serve .
```

## Structure

- `index.html`: the page
- `css/styles.css`: styles
- `js/main.js`: the seva plate (donation builder), filters, gallery viewer
- `img/`: photographs, the food-van film and icons
- `favicon.svg`, `favicon.ico`, `site.webmanifest`: icons

## Donations

There is no payment backend. The "plate of seva" builds a WhatsApp message to +91 93235 47108 with the chosen sevas and total; the foundation replies with UPI or bank details.

## Before launch

- Confirm seva prices and descriptions with the foundation.
- Confirm the FAQ answers about receipts and tax exemption.
- Images marked "Representative image" are illustrative and can be replaced with the foundation's own photographs.
