// Frontend access to backend

/*
   Note: seedCategories would be the first thing to run in order for the other commands to work
   However, future wise, we might not need this since categories are hardcoded
*/

const express = require('express');
const Category = require('../models/category');
const router = express.Router();


router
  .get('/getAllCategories', async (req, res) => {
    try {
      const categories = await Category.getAllCategories();
      res.send(categories);
    } catch (error) {
      console.error('Get All Categories Error:', error);
      res.status(500).send({ error: error.message });
    }
  })
  
  .get('/getCategoryById', async (req, res) => {
    try {
      const { categoryId } = req.query;
      const category = await Category.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).send({ error: 'Category not found' });
      }
      res.send(category);
    } catch (error) {
      console.error('Get Category By ID Error:', error);
      res.status(500).send({ error: error.message });
    }
  })
  
  .get('/getCategoryByName', async (req, res) => {
    try {
      const { name } = req.query;
      const category = await Category.getCategoryByName(name);
      if (!category) {
        return res.status(404).send({ error: 'Category not found' });
      }
      res.send(category);
    } catch (error) {
      console.error('Get Category By Name Error:', error);
      res.status(500).send({ error: error.message });
    }
  })
  
  // Seed categories (for initial setup/admin use)
  // basically categories IDs are hardcoded, so this just gets all categories ready since we don't want random categoryId when users create a post
  .post('/seedCategories', async (req, res) => {
    try {
      await Category.seedCategories();
      res.send({ message: 'Categories seeded successfully' });
    } catch (error) {
      console.error('Seed Categories Error:', error);
      res.status(500).send({ error: error.message });
    }
  })
  
  // Admin-only routes (Could remove below in the future since categories are pretty much Hard set)
  .post('/createCategory', async (req, res) => {
    try {
      const { name, description } = req.body;
      const newCategory = await Category.createCategory(name, description);
      res.status(201).send(newCategory);
    } catch (error) {
      console.error('Create Category Error:', error);
      if (error.code === 11000) {
        res.status(400).send({ error: 'Category name already exists' });
      } else {
        res.status(500).send({ error: error.message });
      }
    }
  })
  
  .put('/updateCategory', async (req, res) => {
    try {
      const { categoryId, data } = req.body;
      const updatedCategory = await Category.updateCategory(categoryId, data);
      if (!updatedCategory) {
        return res.status(404).send({ error: 'Category not found' });
      }
      res.send(updatedCategory);
    } catch (error) {
      console.error('Update Category Error:', error);
      res.status(500).send({ error: error.message });
    }
  })
  
  .delete('/deleteCategory', async (req, res) => {
    try {
      const { categoryId } = req.body;
      const deleted = await Category.deleteCategory(categoryId);
      if (!deleted) {
        return res.status(404).send({ error: 'Category not found' });
      }
      res.send({ message: 'Category deleted', deleted });
    } catch (error) {
      console.error('Delete Category Error:', error);
      res.status(500).send({ error: error.message });
    }
  });

module.exports = router;


/* Postman Categories ID list (ignore)for testing

[{"_id":"685303208325a836acb2bf02","name":"Building","description":"Posts related to construction and building projects","__v":0},
{"_id":"685303208325a836acb2bf05","name":"Scripting","description":"Posts about scripting","__v":0},
"_id":"685303218325a836acb2bf08","name":"Modeling","description":"Posts about 3D modeling and design","__v":0},
{"_id":"685303218325a836acb2bf0b","name":"Other","description":"General posts that don't fit other categories","__v":0},
{"_id":"685303218325a836acb2bf0e","name":"Resource","description":"Useful resources and materials for developers to use","__v":0}]

*/