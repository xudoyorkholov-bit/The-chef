import connectDB from '../config/database.js';
async function runMigration() {
    try {
        console.log('🔄 Running database migration...');
        // Connect to MongoDB
        await connectDB();
        console.log('✅ Database migration completed successfully!');
        console.log('📊 Collections will be created automatically by Mongoose:');
        console.log('   - users');
        console.log('   - menuitems');
        console.log('   - reservations');
        console.log('   - messages');
        console.log('   - galleries');
        console.log('   - orders');
        console.log('   - testimonials');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}
runMigration();
