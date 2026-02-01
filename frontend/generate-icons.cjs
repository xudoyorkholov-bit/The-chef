const fs = require('fs');
const path = require('path');

// Restoran ranglar
const COLORS = {
  cream: '#FFF8E7',
  green: '#4CAF50',
  darkGreen: '#388E3C',
  liver: '#8B4513'
};

// PWA uchun kerakli o'lchamlar
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG icon yaratish (oshpaz shlyapa va vilka-pichoq)
function generateSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fon -->
  <rect width="512" height="512" fill="${COLORS.cream}" rx="80"/>
  
  <!-- Oshpaz shlyapasi -->
  <g transform="translate(256, 256)">
    <!-- Shlyapa yuqori qismi -->
    <ellipse cx="0" cy="-80" rx="100" ry="60" fill="${COLORS.green}"/>
    <rect x="-100" y="-80" width="200" height="40" fill="${COLORS.green}"/>
    
    <!-- Shlyapa pastki qismi (oq) -->
    <rect x="-120" y="-40" width="240" height="50" fill="white" rx="5"/>
    
    <!-- Vilka (chap tomonda) -->
    <g transform="translate(-60, 60)">
      <rect x="-3" y="0" width="6" height="100" fill="${COLORS.darkGreen}" rx="3"/>
      <rect x="-15" y="0" width="6" height="40" fill="${COLORS.darkGreen}" rx="3"/>
      <rect x="-9" y="0" width="6" height="40" fill="${COLORS.darkGreen}" rx="3"/>
      <rect x="9" y="0" width="6" height="40" fill="${COLORS.darkGreen}" rx="3"/>
    </g>
    
    <!-- Pichoq (o'ng tomonda) -->
    <g transform="translate(60, 60)">
      <rect x="-3" y="0" width="6" height="100" fill="${COLORS.darkGreen}" rx="3"/>
      <path d="M -15 0 L 15 0 L 0 -40 Z" fill="${COLORS.darkGreen}"/>
    </g>
    
    <!-- "C" harfi (Chef) -->
    <text x="0" y="20" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
          fill="${COLORS.liver}" text-anchor="middle">C</text>
  </g>
  
  <!-- Dekorativ chegara -->
  <rect width="512" height="512" fill="none" stroke="${COLORS.green}" 
        stroke-width="8" rx="80"/>
</svg>`;
}

// Canvas yordamida SVG ni PNG ga o'girish
async function convertSVGtoPNG(svgContent, size, outputPath) {
  // Node.js muhitida ishlaydigan sharp kutubxonasidan foydalanamiz
  try {
    const sharp = require('sharp');
    const buffer = Buffer.from(svgContent);
    
    await sharp(buffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✓ ${size}x${size} icon yaratildi: ${outputPath}`);
  } catch (error) {
    console.error(`✗ ${size}x${size} icon yaratishda xato:`, error.message);
    console.log('  Sharp kutubxonasi o\'rnatilmaganmi? npm install sharp');
  }
}

// Barcha ikonlarni yaratish
async function generateAllIcons() {
  const publicDir = path.join(__dirname, 'public');
  
  // public papkasi mavjudligini tekshirish
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('🎨 PWA ikonlari yaratilmoqda...\n');

  // Har bir o'lcham uchun icon yaratish
  for (const size of SIZES) {
    const svgContent = generateSVG(size);
    const filename = `icon-${size}x${size}.png`;
    const outputPath = path.join(publicDir, filename);
    
    await convertSVGtoPNG(svgContent, size, outputPath);
  }

  // Apple touch icon (180x180)
  const appleSVG = generateSVG(180);
  await convertSVGtoPNG(appleSVG, 180, path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon (32x32)
  const faviconSVG = generateSVG(32);
  await convertSVGtoPNG(faviconSVG, 32, path.join(publicDir, 'favicon.png'));

  console.log('\n✅ Barcha ikonlar muvaffaqiyatli yaratildi!');
  console.log('📁 Joylashuv: frontend/public/');
}

// Skriptni ishga tushirish
generateAllIcons().catch(console.error);
