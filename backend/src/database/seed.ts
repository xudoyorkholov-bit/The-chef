import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';
import MenuItem from '../models/MenuItem';
import Gallery from '../models/Gallery';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/the_chef_restaurant';
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Gallery.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@thechef.com',
      password_hash: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Create menu items
    console.log('🍽️  Creating menu items...');
    const menuItems = [
      {
        name: 'Caesar Salad',
        name_ru: 'Салат Цезарь',
        description: 'Yangi romaine salat, parmesan pishloq va krutonlar bilan',
        description_ru: 'Свежий салат ромэн с сыром пармезан и крутонами',
        price: 45000,
        category: 'appetizer',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
        available: true
      },
      {
        name: 'Bruschetta',
        name_ru: 'Брускетта',
        description: 'Qovurilgan non pomidor, sarimsoq va rayhon bilan',
        description_ru: 'Поджаренный хлеб с помидорами, чесноком и базиликом',
        price: 35000,
        category: 'appetizer',
        image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80',
        available: true
      },
      {
        name: 'Qovurilgan Losos',
        name_ru: 'Жареный лосось',
        description: 'Yangi Atlantik losos limon yog\' sousi bilan',
        description_ru: 'Свежий атлантический лосось с лимонным маслом',
        price: 95000,
        category: 'main',
        image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
        available: true
      },
      {
        name: 'Ribeye Steak',
        name_ru: 'Стейк Рибай',
        description: 'Premium 350g ribeye sarimsoq yog\' bilan',
        description_ru: 'Премиум стейк рибай 350г с чесночным маслом',
        price: 125000,
        category: 'main',
        image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
        available: true
      },
      {
        name: 'Tiramisu',
        name_ru: 'Тирамису',
        description: 'Klassik italyan deserti qahva va mascarpone bilan',
        description_ru: 'Классический итальянский десерт с кофе и маскарпоне',
        price: 32000,
        category: 'dessert',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
        available: true
      },
      {
        name: 'Shokoladli Lava Kek',
        name_ru: 'Шоколадный лава-кейк',
        description: 'Issiq shokolad keki eritilgan o\'rtasi bilan',
        description_ru: 'Горячий шоколадный кекс с расплавленной серединой',
        price: 35000,
        category: 'dessert',
        image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80',
        available: true
      },
      {
        name: 'Yangi Limonad',
        name_ru: 'Свежий лимонад',
        description: 'Uyda tayyorlangan limonad yalpiz bilan',
        description_ru: 'Домашний лимонад с мятой',
        price: 18000,
        category: 'beverage',
        image_url: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400&q=80',
        available: true
      },
      {
        name: 'Espresso',
        name_ru: 'Эспрессо',
        description: 'Boy italyan espresso',
        description_ru: 'Крепкий итальянский эспрессо',
        price: 15000,
        category: 'beverage',
        image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80',
        available: true
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log(`✅ ${menuItems.length} menu items created`);

    // Create gallery images
    console.log('🖼️  Creating gallery images...');
    const galleryImages = [
      {
        title: 'Restaurant Interior',
        image_url: '/images/gallery/interior-1.jpg',
        thumbnail_url: '/images/gallery/thumb-interior-1.jpg',
        display_order: 1
      },
      {
        title: 'Chef at Work',
        image_url: '/images/gallery/chef-1.jpg',
        thumbnail_url: '/images/gallery/thumb-chef-1.jpg',
        display_order: 2
      },
      {
        title: 'Signature Dish',
        image_url: '/images/gallery/dish-1.jpg',
        thumbnail_url: '/images/gallery/thumb-dish-1.jpg',
        display_order: 3
      },
      {
        title: 'Dining Area',
        image_url: '/images/gallery/dining-1.jpg',
        thumbnail_url: '/images/gallery/thumb-dining-1.jpg',
        display_order: 4
      }
    ];

    await Gallery.insertMany(galleryImages);
    console.log(`✅ ${galleryImages.length} gallery images created`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
