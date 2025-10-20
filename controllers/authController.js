import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const Register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password)
            return res.status(400).json({message:"All fields are required!"});

        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(400).json({message:"Email already registered!"});

        const hashedPassword = await bcrypt.hash(password, 13);

        const newUser = await User.create({
            name, email, password:hashedPassword
        });

        res.status(201).json({message:"User Registered Successfully", newUser});
    }catch(error){
        res.status(500).json({message:"Internal server error", error:error.message});
    }
};

export const Login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password)
            return res.status(400).json({message:"All fields are required"});

        const user = await User.findOne({email});
        if(!user)
            return res.status(400).json({message: 'Invalid email or password!!!'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({message: 'Invalid email or password!!!'});

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.SECRET_KEY,
            {expiresIn:'1d'}
        );

       res.status(200).json({
    message: "Login successful",
    token,
    user: {
        _id: user._id,    // now _id is visible
        name: user.name,
        email: user.email,
    },
});


    }catch(error){
         res.status(500).json({message:"Internal server error", error:error.message});
    }
};