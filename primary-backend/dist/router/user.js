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
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const body = req.body;
    const parseData = types_1.SignupSchema.safeParse(body);
    if (!parseData) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        });
    }
    const userExits = yield db_1.prismaClient.user.findFirst({
        where: {
            email: db_1.prismaClient.data.username
        }
    });
    if (userExits) {
        return res.status(403).json({
            message: "User already exists"
        });
    }
    yield db_1.prismaClient.user.create({
        data: {
            email: (_a = parseData.data) === null || _a === void 0 ? void 0 : _a.username,
            password: (_b = parseData.data) === null || _b === void 0 ? void 0 : _b.password,
            name: (_c = parseData.data) === null || _c === void 0 ? void 0 : _c.name
        }
    });
    return res.json({
        message: "Please verify your account!"
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    const parseData = types_1.SigninSchema.safeParse(body);
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            email: (_a = parseData.data) === null || _a === void 0 ? void 0 : _a.username,
            password: (_b = parseData.data) === null || _b === void 0 ? void 0 : _b.password
        }
    });
    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are inncorrect"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id
    }, config_1.JWT_SECRECT);
    res.json({
        token: token
    });
}));
router.get("/user", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO:Fix the type
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            id
        },
        select: {
            email: true,
            name: true
        }
    });
    return res.json({
        user
    });
}));
exports.userRouter = router;
