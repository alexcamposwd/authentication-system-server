"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user_controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/profiles', auth_1.checkToken, user_controller_1.usersProfiles);
router.get('/user/:id', auth_1.checkToken, user_controller_1.useProfile);
router.put('/update/:id', auth_1.checkToken, user_controller_1.useUpdate);
router.delete('/deluser/:id', auth_1.checkToken, user_controller_1.deleteProfile);
exports.default = router;
