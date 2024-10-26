import express from 'express';
import user from '../models/User.js';
import userConrtoller from '../controllers/User.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
        try{
            if(userConrtoller.correctRegisterationData(req.body)){
                const foundUser = await user.findOne({email: req.body.email});
                if(!foundUser){
                userConrtoller.saveData(req.body);
                return res.status(200).send("User created successfully");
                }else{
                    return res.status(400).send("Bad request email already exists");
                }
            }else{
                return res.status(400).send("Bad request");
            }
        } catch (error) {
            return res.status(500).send("Internal server error");
        }
    }
);

router.post('/login', async (req, res, next) => {
    try {
        if (userConrtoller.correctLoginData(req.body)) {
            const foundUser = await user.findOne({ email: req.body.email });
            if (foundUser) {
                // Await the result of checkPassword
                const passwordMatch = await userConrtoller.checkPassword(req.body.password, foundUser.password);
                if (passwordMatch) {
                    return res.status(200).send("Login successfully");
                } else {
                    return res.status(400).send("Bad request: password is incorrect");
                }
            } else {
                return res.status(400).send("Bad request: email or password is incorrect");
            }
        } else {
            return res.status(400).send("Bad request, something went wrong in finding the user");
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("Internal server error");
    }
});

export default router;