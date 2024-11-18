var express = require('express');
var router = express.Router();
var PassCatModel = require('../module/password');
 

router.get('/getCategory', async (req, res) => {
    try {
        getPassCat = PassCatModel.find({'_id':'66b2332377ca3438b66d2ff9'});
        const data = await getPassCat.exec();
        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get("/", function(req,res,next){
    res.send("node.js reatful api get methos is working now ")
})

router.get("/king", function(req,res,next){
    res.send("node.js reatful api get methos is working now ")
})
router.post("/king", function(req,res,next){
    var passCategory = req.body.pass_cat;
    var passcatDetails = new PassCatModel({password_category:passCategory})
passcatDetails.save(function(err,doc){
    if (err) {
            console.error("Error saving data:", err); // Log the error for debugging
            res.status(500).send("An error occurred while saving the data"); // Send a 500 status code
        } else {
            res.send("Success.. Node.js RESTful API POST method working"); // Respond with success
        }
})
    res.send("node.js reatful api post methos is working now ")
})
router.get("/kingkohli", function(req,res,next){
    res.send("node.js reatful api get methos is working now ")
})
router.patch("/kingkohli", function(req,res,next){
    res.send("node.js reatful api patch method is working now ")
})
module.exports=router;