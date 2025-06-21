const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);
/*

   So, categories are technically "Hard set" by me, users can't create their own categories
   therefore theyd choose from a predefined list of categories (Building, Scripting, Modeling, Other, Resource, etc.)

*/
// CRUD Functions
// Creating category (mainly for ME(admin) purposes)
async function createCategory(name, description) {
  return await Category.create({ name, description });
}

// Reading categories
async function getAllCategories() {
  return await Category.find();
}


//categoryId = mongoose.Types.ObjectId
async function getCategoryById(categoryId) {
  return await Category.findById(categoryId);
}

async function getCategoryByName(name) {
  return await Category.findOne({ name });
}



//These functions are meant to be used by ME(admin) to manage categories

/*

  Self note: in the future, since categories are hard set, we might not need these functions

*/
// Updating category 
async function updateCategory(categoryId, data) {
  return await Category.findByIdAndUpdate(categoryId, data, { new: true });
}

// Deleting category 
async function deleteCategory(categoryId) {
  return await Category.findByIdAndDelete(categoryId);
}

//Our Categories for users to choose (Populating categories)
async function seedCategories() {
  const categories = [
    { name: 'Building', description: 'Posts related to construction and building projects' },
    { name: 'Scripting', description: 'Posts about scripting' },
    { name: 'Modeling', description: 'Posts about 3D modeling and design' },
    { name: 'Other', description: 'General posts that don\'t fit other categories' },
    { name: 'Resource', description: 'Useful resources and materials for developers to use' }
  ];

  for (const category of categories) {
    const existing = await getCategoryByName(category.name);
    if (!existing) {
      await createCategory(category.name, category.description);
    }
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
  deleteCategory,
  seedCategories
};