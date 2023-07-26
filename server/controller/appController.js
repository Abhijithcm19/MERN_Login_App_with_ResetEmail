import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenarator from 'otp-generator'


/**middleware for verify user */
export async function verifyUser(req,res,next){
  try {
     const {username} =req.method =="GET" ? req.query : req.body;

     //check the user existence
     let exist = await UserModel.findOne({username})
     if(!exist) return res.status(404).send({error : "can't find User!"})
     next()
  } catch (error) {
   return res.status(404).send({ error:"Authentication Error"}) 
  }
}



/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
      const { username, password, profile, email } = req.body;

      // Check for existing user with the same username
      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
          return res.status(400).send({ error: "Please use a unique username" });
      }

      // Check for existing user with the same email
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
          return res.status(400).send({ error: "Please use a unique email" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user and save it to the database
      const user = new UserModel({
          username,
          password: hashedPassword,
          profile: profile || '',
          email
      });

      const savedUser = await user.save();

      return res.status(201).send({ msg: "User Register Successfully", user: savedUser });
  } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
  }
}



export async function login(req, res) {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send({ error: "Password does not match" });
    }

    // Create a JWT token
    const token = jwt.sign({
      userId: user._id,
      username: user.username
    }, ENV.JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).send({
      msg: "Login Successful",
      username: user.username,
      token
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}


export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(400).send({ error: "Invalid Username" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Couldn't find the User" });
    }
/**remove passwd from user */
//mongoose return unnessary data with object so convert it into json
    const { password, ...rest } = Object.assign({},user.toJSON());
    return res.status(200).send(rest);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}


export async function updateUser(req, res) {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).send({ error: "User not Found...!" });
    }

    const body = req.body;

    // Update the data using await
    await UserModel.updateOne({ _id: userId }, body);

    return res.status(200).send({ msg: "Record Update...!" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}





export async function generateOTP(req,res){
req.app.locals.OTP = await otpGenarator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false, specialChars:false})
res.status(201).send({code:req.app.locals.OTP})
}


export async function verifyOTP(req,res){
   const {code} = req.query;
   if(parseInt(req.app.locals.OTP)===parseInt(code)){
    req.app.locals.OTP = null; // reset the otp value
    req.app.locals.resetSession = true // start session for reset password
    return res.status(201).send({msg:'verify Successfully'})
   }
   return res.status(400).send({error:"invalid OTP"})
}



export async function createRestSession(req,res){
if(req.app.locals.resetSession){
  req.app.locals.resetSession = false
  return res.status(201).send({msg:"access granted!"})
}
return res.status(440).send({error: "Session expired!"})
}


export async function restPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

    req.app.locals.resetSession = false;

    return res.status(201).send({ msg: "Record Update...!" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
}
