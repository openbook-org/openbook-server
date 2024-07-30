// public routes for user

import { Router } from "express";

import { getUserById, getUsers } from "../../controllers/user/index";
import { registerUser } from "../../controllers/user/registerController";
import { loginUser } from "../../controllers/user/loginController";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
