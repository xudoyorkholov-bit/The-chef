const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Read new menu items
const newItemsPath = path.join(__dirname, 'menu_additions.json');
const newItems = JSON.parse(fs.readFileSync(newItemsPath, 'utf8'));

// Add new items to menuItems array
db.menuItems = [...db.menuItems, ...newItems];

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`✅ Successfully added ${newItems.length} new menu items!`);
console.log(`📊 Total menu items: ${db.menuItems.length}`);
