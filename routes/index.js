var express = require('express');
var userModel = require('../module/user');
var Category = require('../module/category');
var Password = require('../module/password');
var router = express.Router();


router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }else{
    req.user = null;
  }
  next();
});


function isAuthenticated(req, res, next) {
  if(req.user) {
    return next();
  } else {
    res.redirect('/');
  }
}

function checkemail(req, res, next) {
  const email = req.body.email;
  userModel.findOne({ email: email }).exec()
    .then(user => {
      if (user) {
        return res.render('signup', { title: 'Signup', msg: 'Email is already registered' });
      }
      next();
    })
    .catch(err => {
      next(err);
    });
}
    function checkusername(req, res, next) {
      const username = req.body.username;
      userModel.findOne({ username: username }).exec()
        .then(user => {
          if (user) {
            return res.render('signup', { title: 'Signup', msg: 'Username is already registered' });
          }
          next();
        })
        .catch(err => {
          next(err);
        });
  }
   

  router.get('/logout', (req, res) => {
   if(req.session){
    req.session.destroy(err=> {
      if(err) {
        return res.status(500).send('could not log out');
      }
      res.redirect('/');
      console.log('log out succesfully');
    });
  }else{
    res.redirect('/');
  }
   });
  
router.get('/', function(req, res, next) {
  res.render('index', { title: 'password mangement system',msg:'' });
});

router.get('/signup',checkemail,checkusername,function(req, res, next){
  res.render('signup', {title:'signup'});
})
router.post('/signup',function(req, res, next){
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  var userdetails = new userModel({
    username:username,
    email:email,
    password:password
  });
  userdetails.save()
  .then(doc => {
    res.render('signup', { title: 'Signup', msg: 'User registered successfully' });
  })
  .catch(err => {
    res.render('signup', { title: 'Signup', msg: 'Email is already registered' });
  });
})
router.post('/login', async function(req, res) {
  try {
    const { username, password } = req.body;
    console.log(`Attempting login with username: ${username}`);
    const user = await userModel.findOne({ username, password }).exec();
    if (user) {
      console.log('User found, setting session and req.user');
       req.session.user = user;
       req.user = user;
      return res.render('password_category', { title: 'Password Category Lists', msg: 'Login successfully' });
    } else {
      return res.render('index', { title: 'Login', msg: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).render('index', { title: 'Login', msg: 'An error occurred during login' });
  }
});

async function checkcategory(req, res, next) {
  try {
    console.log('Request Body:', req.body); // Log the request body

    const category = req.body.category;
    if (!category) {
      return res.status(400).render('addNewCategory', { title: 'Add New Category', msg: 'Category is required' });
    }

    const data = await Category.findOne({ name: category }).exec(); // Assuming 'name' is the field in Category schema

    if (data) {
      return res.render('addNewCategory', { title: 'Add New Category', msg: 'Category is already registered' });
    }

    next();
  } catch (err) {
    next(err);
  }
}

// Define route to add new category
router.post('/addNewCategory',isAuthenticated, checkcategory, async function(req, res, next) {
  try {
    const category = req.body.category;

    const newCategory = new Category({
      name: category
    });

    await newCategory.save();
    res.render('addNewCategory', { title: 'Add New Category', msg: 'New category added successfully' });
  } catch (err) {
    console.error('Error adding category:', err);
    res.render('addNewCategory', { title: 'Add New Category', msg: 'Error adding category' });
  }
});
router.post('/addNewPassword',async function(req,res,next){
  try {
    const password = req.body.password;
    const category_id = req.body.category;
    if (!password || !category_id) {
      const categories = await Category.find().exec();
      return res.render('addNewPassword', { title: 'Add New Password', msg: 'Password and category are required', categoryopt: categories });
    }
    const category = await Category.findById(category_id).exec();
    if (!category) {
      const categories = await Category.find().exec();
      return res.render('addNewPassword', { title: 'Add New Password', msg: 'Invalid category', categoryopt: categories });
    }

    const newPassword = new Password({
      password: password,
      category: category.name
    });

    await newPassword.save();
    const categories = await Category.find().exec();
    res.render('addNewPassword', { title: 'Add New Password', msg: 'New password added successfully', categoryopt: categories });
  } catch (err) {
    console.error('Error adding category:', err);
    const categories = await Category.find().exec();
    res.render('addNewPassword', { title: 'Add New Password', msg: 'Error adding password', categoryopt: categories });
  }
})

  
  // Route to render the password category page
  router.get('/passwordCategory',isAuthenticated, function(req, res, next) {
    res.render('password_category', { title: 'Password Category Lists' });
  });
  
  // Route to render the add new password page
  router.get('/addNewPassword',isAuthenticated, async function(req, res, next) {
    try {
      const categories = await Category.find().exec();
    res.render('addNewPassword', { title: 'Add New Password',categoryopt:categories });
  } catch (err) {
    next(err);
  }
  });
  
  // Route to render the add new category page
  router.get('/addNewCategory',isAuthenticated, function(req, res, next) {
    res.render('addNewCategory', { title: 'Add New Category' });
  });
  
  // Route to render the view all password page

  
  router.get('/EDITING/:id',isAuthenticated, async function(req,res,next){
    var category_id = req.params.id;
    try{
     var edititem = await Category.findById(category_id).exec();
     var editsitem = await edititem
     console.log('edit category is ',editsitem);
    res.render('edit_category',{title:'password management system',record:editsitem})
     }catch(err){
      next(err)
     }
  })
  router.post('/EDITING/',isAuthenticated,  async function(req, res, next) {
    try {
      const category = req.body.category;
      var category_id = req.body.id;
      console.log('category id is :', category_id);
      console.log('category is :',category)
      var updatecategory =  await Category.findByIdAndUpdate(category_id,{
        name:category },
       {new :true}
    ).exec()
      var updatescategory = await updatecategory;
      res.redirect('/viewAllCategory ');
      console.log('update item is :',updatescategory);
    } catch (err) {
      console.error('Error adding category:', err);
    }
      
  });

  router.get('/viewAllPassword',isAuthenticated, async function(req, res, next) {
    try {
      const password = await Password.find().exec();
    res.render('viewAllPassword', { title: 'All Password',recordpass:password  });
  } catch (err) {
    next(err);
  }
  });
  router.get('/viewAllCategory',isAuthenticated, async function(req, res, next) {
    try {
      const categories = await Category.find().exec();
    res.render('viewAllCategory', { title: 'All Password',records:categories  });
  } catch (err) {
    next(err);
  }
  });
  router.get('/delete/:id', isAuthenticated, async function(req, res, next) {
    const password_id = req.params.id;
    console.log("Password ID for deletion is:", password_id);
    try {
        // Attempt to delete the item
        const deletedItem = await Password.findByIdAndDelete(password_id).exec();
        
        // Log result
        if (deletedItem) {
            console.log("Successfully deleted item:", deletedItem);
        } else {
            console.log("No item found with ID:", password_id);
        }
        res.redirect('/viewAllPassword');
    } catch (err) {
        // Log and handle any errors
        console.error("Error deleting password:", err);
        next(err);
    }
});

  router.get('/DELETES/:id', isAuthenticated, async function(req, res, next) {
    const category_id = req.params.id;
    console.log("Category ID for deletion is:", category_id);
    try {
        // Attempt to delete the item
        const deletedItem = await Category.findByIdAndDelete(category_id).exec();
        
        // Log result
        if (deletedItem) {
            console.log("Successfully deleted item:", deletedItem);
        } else {
            console.log("No item found with ID:", category_id);
        }
        
        // Redirect after deletion
        res.redirect('/viewAllCategory');
    } catch (err) {
        // Log and handle any errors
        console.error("Error deleting category:", err);
        next(err);
    }
});
router.get('/edits/:id',isAuthenticated, async function(req,res,next){
  var password_id = req.params.id;
  try{
   var edititem = await Password.findById(password_id).exec();
   var editsitem = await edititem
   console.log('edit password is ',editsitem);
  res.render('edit_password',{title:'password management system',recordpassid:editsitem})
   }catch(err){
    next(err)
   }
})
router.post('/edits/',isAuthenticated,  async function(req, res, next) {
  try {
    const password = req.body.password;
    var password_id = req.body.id;
    console.log('password id is :', password_id);
    console.log('password is :',password)
    var updatepassword =  await Password.findByIdAndUpdate(password_id,{
      password:password },
     {new :true}
  ).exec()
    var updatespassword = await updatepassword;
    res.redirect('/viewAllPassword');
    console.log('update item is :',updatespassword);
  } catch (err) {
    console.error('Error adding password:', err);
  }
    
});

  module.exports = router;