# PWA Ikonlarini Yaratish

## Kerakli ikonlar:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- apple-touch-icon.png (180x180)

## Ikonlarni yaratish:

### Variant 1: Online tool (Oson)
1. https://realfavicongenerator.net/ saytiga kiring
2. `public/icon.svg` faylini yuklang
3. Barcha kerakli o'lchamdagi ikonlarni yuklab oling
4. `frontend/public/` papkasiga joylashtiring

### Variant 2: ImageMagick (Terminal orqali)
```bash
# ImageMagick o'rnatilgan bo'lishi kerak
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

cd frontend/public

# SVG dan PNG yaratish
convert icon.svg -resize 72x72 icon-72x72.png
convert icon.svg -resize 96x96 icon-96x96.png
convert icon.svg -resize 128x128 icon-128x128.png
convert icon.svg -resize 144x144 icon-144x144.png
convert icon.svg -resize 152x152 icon-152x152.png
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 384x384 icon-384x384.png
convert icon.svg -resize 512x512 icon-512x512.png
convert icon.svg -resize 180x180 apple-touch-icon.png
```

### Variant 3: Photoshop/Figma
1. `icon.svg` ni oching
2. Har bir o'lchamda export qiling
3. PNG formatda saqlang

## Muhim:
- Ikonlar kvadrat bo'lishi kerak (512x512, 192x192, va h.k.)
- PNG format
- Transparent background (shaffof fon)
- Yaxshi sifatli (sharp, clear)

## Hozirgi holat:
`icon.svg` fayli tayyor. Uni yuqoridagi usullardan biri bilan PNG formatga o'tkazing.
