const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

//Get all The Submitted Post
router.get('/', async (req,res)=>{
    try{
        const posts = await Post.find();
        res.json(posts);
        console.log(Post);
    }catch(err){
        res.json({message: err})
    }
});

//login authentication
router.post('/login',(req,res) => {
    //sample user
    const user = {
        id: 1,
        username: 'srini',
        email: 'srini@gmail.com'
    }
    jwt.sign({user},'secretkey',(err,token) => {
        res.json({
            token
        });
    });
});

//Submitting The Post
router.post('/',verifyToken,async (req,res) =>{
    jwt.verify(req.token,'secretkey',(err,authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            const post = new Post({
                title: req.body.title,
                description: req.body.description,
                authData
            });
            const savePost = post.save();
            res.json(savePost);
        }
    });
});


//Get The Specific Post
router.get('/:postId',async(req,res) => {
    try{
    const post = await Post.findById(req.params.postId);
    res.json(post);
    }catch(err){
        res.json({message: err});
    }
});

//deleting the post
router.delete('/:postId',async (req,res) =>{
    try{
        const removedPost = await Post.remove({_id:req.params.postId});
        res.json(removedPost)   
    }catch(err){
        res.json({message:err});
    }

});

//updating the post
router.patch('/:postId',async (req,res) => {
    try{
        const updatedPost = await Post.updateOne(
            {_id:req.params.postId},
            {$set: {title: req.body.title}}
        );
        res.json(updatedPost);
    }catch(err){
        res.json({message:err});
    }
});
module.exports = router;


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }