"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdate = exports.useProfile = exports.userLogin = exports.deleteProfile = exports.usersProfiles = exports.registerNewUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// NEW USER *************
const registerNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role } = req.body;
    // validations
    if (!username)
        return res.status(422).json({ message: 'Username is required!' });
    if (!email)
        return res.status(422).json({ message: 'Email is required!' });
    if (!password)
        return res.status(422).json({ message: 'Password is required!' });
    // check user exists
    const userExists = yield User_1.default.findOne({ email: email, username: username });
    if (userExists)
        return res.status(422).json({ message: 'Existing User!' });
    // create password
    let newPassword = password.toString();
    const salt = yield bcrypt_1.default.genSalt(12);
    const passwordHash = yield bcrypt_1.default.hash(newPassword, salt);
    // create user
    const user = new User_1.default({
        username,
        email,
        role,
        password: passwordHash
    });
    try {
        yield user.save();
        res.status(201).json({ message: 'User created successfully!', user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error on the server, please try again later' });
    }
});
exports.registerNewUser = registerNewUser;
// All USERS *************
const usersProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        console.log(users);
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error on the server, please try again later' });
    }
});
exports.usersProfiles = usersProfiles;
// DELETE USER *************
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registers = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!registers)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: 'User successfully deleted!' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error on the server, please try again later' });
    }
});
exports.deleteProfile = deleteProfile;
// LOGIN USER *************
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // validations
    if (!email)
        return res.status(422).json({ message: 'Email is required!' });
    if (!password)
        return res.status(422).json({ message: 'Password is required!' });
    // check user exists
    const user = yield User_1.default.findOne({ email: email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    // check password match
    const checkPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!checkPassword)
        return res.status(422).json({ message: 'Invalid password!' });
    try {
        const secret = process.env.SECRET;
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            role: user.role,
        }, secret, { expiresIn: 86400 });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 dia
        });
        res.status(200).json({ message: 'Authentication successful!', token, user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error on the server, please try again later' });
    }
});
exports.userLogin = userLogin;
// GET USER *************
const useProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.default.findById(id, '-password');
        if (!user)
            return res.status(404).json({ message: 'User not found!' });
        res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error on the server, please try again later' });
    }
});
exports.useProfile = useProfile;
// UPDATE USER *************
const useUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.default.findById(id, '-password');
        if (!user)
            return res.status(404).json({ message: 'User not found!' });
        const updateUser = yield User_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(updateUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error on the server, please try again later' });
    }
});
exports.useUpdate = useUpdate;
