import express from 'express';
import { recipeController } from '../controllers/index.js';

const router = express.Router();

router.post('/add_recipe', recipeController.addRecipe);
router.post('/get_recipes',recipeController.getRecipes);
router.post('/get_recipe', recipeController.getRecipe);
router.get('/get_recipe_products', recipeController.getRecipeProducts);
router.get('/get_recipe_categories', recipeController.getRecipeCategories);
router.post('/like_recipe', recipeController.likeRecipe);
router.post('/dislike_recipe', recipeController.dislikeRecipe);
router.post('/add_comment', recipeController.addComment);
router.get('/get_comments', recipeController.getComments);
router.get('/accept_recipe', recipeController.acceptRecipe);
router.post('/filter_recipes', recipeController.filterRecipes);
router.post('/reject_recipe', recipeController.rejectRecipe);
router.get('/',recipeController.getter);
export default router;