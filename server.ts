import { ProductController } from "./controllers/productController";
import { UserController } from "./controllers/userController";

const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", UserController.login);
app.post("/register", UserController.register);

app.get("/products", ProductController.getAll);
app.post("/product/create", ProductController.create);
app.put("/product/update/:id", ProductController.update);
app.get("/product/image/:id", ProductController.getImage);
app.put("/product/image/:id", ProductController.updateImage);

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  console.log(`Servidor servido em http://localhost:${PORT}`);
});
