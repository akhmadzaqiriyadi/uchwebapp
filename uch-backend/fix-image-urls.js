// Simple script to fix image URLs in existing articles
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImageUrls() {
  try {
    console.log('Fixing image URLs in existing articles...');
    
    // Get all articles with /public/images URLs
    const articles = await prisma.article.findMany({
      where: {
        imageUrl: {
          startsWith: '/public/images/'
        }
      }
    });
    
    console.log(`Found ${articles.length} articles to fix`);
    
    for (const article of articles) {
      const newImageUrl = article.imageUrl.replace('/public/images/', '/images/');
      
      await prisma.article.update({
        where: { id: article.id },
        data: { imageUrl: newImageUrl }
      });
      
      console.log(`Fixed article "${article.title}": ${article.imageUrl} -> ${newImageUrl}`);
    }
    
    console.log('All image URLs have been fixed!');
  } catch (error) {
    console.error('Error fixing image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
