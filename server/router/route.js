import { Router } from "express";
const router = Router();

import * as controller from '../controller/appController.js'

import {registerMail} from '../controller/mailer.js'

import Auth, {localVariables} from '../middleware/auth.js' 
/** POST Methods*/
router.route('/register').post(controller.register) //register user
router.route('/registerMail').post(registerMail)// send the mail
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end())//authentication
router.route('/login').post(controller.verifyUser,controller.login)//login in app


/** GET Methods*/
router.route('/user/:username').get(controller.getUser)//user with username
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP)//genarate random otp
router.route('/verifyOTP').get(controller.verifyOTP)//verrify geanarate otp
router.route('/createRestSession').get(controller.createRestSession) //rest all the variable

/** PUT Methods*/
router.route('/updateuser').put(Auth,controller.updateUser) // update user profile
router.route('/resetPassword').put(controller.verifyUser,controller.restPassword) // use to reset password




export default router