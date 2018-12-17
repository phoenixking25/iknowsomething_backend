import express from 'express';
import jwt from 'jsonwebtoken';
import ResponseTemplate from '../../global/templates/response';
import {
  logger,
} from '../../../log';
import Blog from '../../models/blog';
import config from '../../../config';

const router = express.Router();

router.get('/', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      logger.error(err);
      res.json({
        success: false,
        err,
      });
    } else {
      res.json({
        success: true,
        data: {
          blogs,
        },
      });
    }
  });
});

router.post('/', (req, res) => {
  const { data } = req.body;

  jwt.verify(data.token, config.app.WEB_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.json(ResponseTemplate.error(401, 'Invalid User'));
    } else {
      const blog = new Blog();
      blog.userId = decoded.user._id;
      blog.blogTitle = data.title;
      blog.blogContent = data.content;
      blog.save((error) => {
        if (error) {
          logger.error(err);
          res.json(ResponseTemplate.error(401, 'Some error occured while saving the blog'));
        } else {
          res.json(ResponseTemplate.success('Blog created Successfully'));
        }
      });
    }
  });
});

router.get('/:id', (req, res) => {
  Blog.find({}, (err, blog) => {
    if (err) {
      logger.error(err);
      res.json({
        success: false,
        err,
      });
    } else {
      res.json({
        success: true,
        data: {
          blog,
        },
      });
    }
  });
});

router.put('/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, (err) => {
    if (err) {
      logger.error(err);
      res.json({
        success: false,
        err,
      });
    } else {
      res.json({
        success: true,
        msg: 'blog updated successfully.',
      });
    }
  });
});

router.delete('/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      logger.error(err);
      res.json({
        success: false,
        err,
      });
    } else {
      res.json({
        success: true,
        msg: 'blog deleted successfully.',
      });
    }
  });
});

export default router;
