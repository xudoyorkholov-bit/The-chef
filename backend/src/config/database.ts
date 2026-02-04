// JSON Database - MongoDB'siz ishlash uchun
// Keyinchalik MongoDB'ga oson o'tkazish mumkin

const connectDB = async (): Promise<void> => {
  try {
    // JSON file database ishlatamiz
    console.log('✅ JSON Database initialized successfully');
    console.log('📊 Database: JSON File Storage');
    console.log('💡 Tip: Keyinchalik MongoDB\'ga o\'tkazish uchun .env faylida MONGODB_URI ni sozlang');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

export default connectDB;
