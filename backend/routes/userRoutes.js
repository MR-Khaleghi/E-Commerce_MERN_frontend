import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';
const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find();
    res.send(users);
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log('correct email');
      if (bcrypt.compareSync(req.body.password, user.password)) {
        console.log('correct pass');
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      const user = await newUser.save();
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(user),
      });
      return;
    }
    res.status(401).send({ message: 'Email exist. Use another one.' });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User Not Found.' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.params.id);
    const user = await User.findById(req.params.id);
    // console.log(user.isAdmin);
    if (user) {
      if (user.isAdmin) {
        res.status(400).send({ message: 'Can Not Delete Admin.' });
        return;
      }
      // console.log('found del user');
      const deletedUser = await user.remove();
      res.send({ message: 'User Deleted', user: deletedUser });
    } else {
      res.status(404).send({ message: 'User Not Found.' });
    }
  })
);

userRouter.get(
  '/:id',
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log('USER start');
    const user = await User.findById(req.params.id);
    if (user) {
      // console.log('USER FOUND');
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found.' });
    }
  })
);
export default userRouter;
