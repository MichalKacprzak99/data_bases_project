import express from 'express';
import { forumController } from '../controllers/index.js';

const router = express.Router();

router.get('/get_topics', forumController.getTopics);
router.get('/get_comments', forumController.getComments);
router.post('/add_comment', forumController.addComment);

export default router;