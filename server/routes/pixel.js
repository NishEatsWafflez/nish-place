const express = require('express');
const router = express.Router();
// Require the post model
const Pixel = require('../models/pixel');

/* GET posts */
router.get('/', async (req, res, next) => {
  // sort from the latest to the earliest
  const pixels = await Pixel.find();
  return res.status(200).json({
    statusCode: 200,
    message: 'Found ' + pixels.length,
    data: { pixels },
  });
});

router.post('/', async (req, res, next)=>{
    const pixelList = [];
    for (let i = 0; i < 1600; i++){
        let color = "#FFFFFF";
        const post = new Pixel({
            id: i,
            color: color
        });
        pixelList.push(post);
    }
    Pixel.insertMany(pixelList)
    .then(function(){
        console.log("inserted");
    }).catch(function(error){
        console.log(error);
    })

    return res.status(201).json({
        statusCode: 201,
        message: 'Created post',
        data: { pixelList },
      });
    
})

router.delete('/delete', async(req, res, next)=>{
    const result = await Pixel.deleteMany();
    return res.status(200).json({
        statusCode: 200,
        message: `Deleted ${result.deletedCount} post(s)`,
        data: {},
      });
})

router.put('/:id', async(req, res, next)=>{
    const {color} = req.body;
    console.log(req.params.id);
    console.log(color);
    const pixelToChange = await Pixel.findOneAndUpdate({id: req.params.id}, {color: color});   
    return res.status(200).json({
        statusCode: 200,
        message: 'Updated pixel',
        data: { pixelToChange },
      });
})
module.exports = router;