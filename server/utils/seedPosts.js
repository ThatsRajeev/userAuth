const mongoose = require('mongoose');
const Post = require('../models/post');
const { faker } = require('@faker-js/faker');

async function connectToDatabase() {
    try {
      await mongoose.connect("process.env.MONGODB_URL", { useNewUrlParser: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

const generateDummyPosts = async (numPosts = 10) => {
    try {
        const posts = [];

        for (let i = 0; i < numPosts; i++) {
            posts.push({
                id: i + 1,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(3),
                image: faker.image.urlLoremFlickr()
            });
        }

        await Post.insertMany(posts);
        console.log('Dummy posts generated!');
    } catch (err) {
        console.error('Error generating dummy posts:', err);
    } finally {
        mongoose.disconnect();
    }
};

generateDummyPosts();
