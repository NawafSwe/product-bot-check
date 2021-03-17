const express = require('express');
import {Request, Response, NextFunction} from "express";
import {initialStart} from "../controllers/botController";

export const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    initialStart();
    res.send('all good I am working fine').status(200);
});
