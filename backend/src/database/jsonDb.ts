import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_PATH, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize database structure
interface Database {
  users: any[];
  menuItems: any[];
  orders: any[];
  reservations: any[];
  messages: any[];
  testimonials: any[];
  gallery: any[];
}

const initialData: Database = {
  users: [],
  menuItems: [],
  orders: [],
  reservations: [],
  messages: [],
  testimonials: [],
  gallery: []
};

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

export class JsonDatabase {
  private static readDb(): Database {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  }

  private static writeDb(data: Database): void {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  // Generic CRUD operations
  static find(collection: keyof Database, query: any = {}): any[] {
    const db = this.readDb();
    const items = db[collection];
    
    if (Object.keys(query).length === 0) {
      return items;
    }
    
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  static findOne(collection: keyof Database, query: any): any | null {
    const results = this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  static findById(collection: keyof Database, id: string): any | null {
    return this.findOne(collection, { _id: id });
  }

  static create(collection: keyof Database, data: any): any {
    const db = this.readDb();
    const newItem = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db[collection].push(newItem);
    this.writeDb(db);
    return newItem;
  }

  static update(collection: keyof Database, id: string, data: any): any | null {
    const db = this.readDb();
    const index = db[collection].findIndex((item: any) => item._id === id);
    
    if (index === -1) return null;
    
    db[collection][index] = {
      ...db[collection][index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.writeDb(db);
    return db[collection][index];
  }

  static delete(collection: keyof Database, id: string): boolean {
    const db = this.readDb();
    const index = db[collection].findIndex((item: any) => item._id === id);
    
    if (index === -1) return false;
    
    db[collection].splice(index, 1);
    this.writeDb(db);
    return true;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
