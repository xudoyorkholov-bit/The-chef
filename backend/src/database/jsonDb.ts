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
  counters: { [key: string]: number };
}

const initialData: Database = {
  users: [],
  menuItems: [],
  orders: [],
  reservations: [],
  messages: [],
  testimonials: [],
  gallery: [],
  counters: {}
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
  static find(collection: keyof Omit<Database, 'counters'>, query: any = {}): any[] {
    const db = this.readDb();
    const items = db[collection] as any[];
    
    if (Object.keys(query).length === 0) {
      return items;
    }
    
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  static findOne(collection: keyof Omit<Database, 'counters'>, query: any): any | null {
    const results = this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  static findById(collection: keyof Omit<Database, 'counters'>, id: string): any | null {
    return this.findOne(collection, { _id: id });
  }

  static create(collection: keyof Omit<Database, 'counters'>, data: any): any {
    const db = this.readDb();
    const newItem = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    (db[collection] as any[]).push(newItem);
    this.writeDb(db);
    return newItem;
  }

  static update(collection: keyof Omit<Database, 'counters'>, id: string, data: any): any | null {
    const db = this.readDb();
    const items = db[collection] as any[];
    const index = items.findIndex((item: any) => item._id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.writeDb(db);
    return items[index];
  }

  static delete(collection: keyof Omit<Database, 'counters'>, id: string): boolean {
    const db = this.readDb();
    const items = db[collection] as any[];
    const index = items.findIndex((item: any) => item._id === id);
    
    if (index === -1) return false;
    
    items.splice(index, 1);
    this.writeDb(db);
    return true;
  }

  // Counter operations
  static getCounter(name: string): number {
    const db = this.readDb();
    return db.counters[name] || 0;
  }

  static incrementCounter(name: string): number {
    const db = this.readDb();
    const currentValue = db.counters[name] || 0;
    const newValue = currentValue + 1;
    db.counters[name] = newValue;
    this.writeDb(db);
    return newValue;
  }

  static initializeCounter(name: string, value: number): void {
    const db = this.readDb();
    if (db.counters[name] === undefined) {
      db.counters[name] = value;
      this.writeDb(db);
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
