// const user=require('../Src/models/user')
// const jwt =require('jsonwebtoken')

// const token = user.generateJwtToken();
//         const options = {
//             expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//         };

//         user.password = undefined;
//         res.status(201).cookie('token', token, options).json({
//             success: true,
//             token,
//             user
//         }); 