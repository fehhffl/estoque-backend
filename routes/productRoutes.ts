import { Router } from "express";
import { ProductController } from "../controllers/productController";

const router = Router();

router.get("/", (req, res));
router.put("/:id", ProductController.update);
router.get("/:id/image", ProductController.getImage);
router.put("/:id/image", ProductController.updateImage);

export default router;
