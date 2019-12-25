const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {userValidation} = require('../validation');




router.post('/register', async (req, res)=>{

	//let validate the data
	const {error} = userValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);


	//user email already exists
	const emailExist = await User.findOne({email: req.body.email})
	if (emailExist) return res.status(400).send("Email Already Exists");

	//hash the password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);


	const user = new User({
		email: req.body.email,
		password: hashPassword
	});

	try{
		const savedUser = await user.save();
		res.send({user: user._id});
	}
	catch(err){
		res.status(400).send(err);
	}
});


router.post('/login', async (req, res)=>{

	//let validate the data
	const {error} = userValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//if email exist
	const user = await User.findOne({email: req.body.email})
	if (!user) return res.status(400).send("Wrong Email Entered");

	//check password is correct
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid Password");

	//create and assign token
	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
	res.header('auth-token', token).send(token);


	res.send("Logged In");
})



module.exports = router;