import { ProductController } from "./controllers/productController";
import { UserController } from "./controllers/userController";

const express = require("express");
const app = express();
app.use(express.json({ limit: "10mb" })); // Aumenta o tamanho do payload máximo para aguentar as imagens
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());

app.post("/login", UserController.login);
app.post("/register", UserController.register);

app.get("/products", ProductController.getAll);
app.post("/products/create", ProductController.create);
app.put("/products/update/:id", ProductController.update);
app.get("/products/:id/image", ProductController.getImage);
app.put("/products/:id/image", ProductController.updateImage);

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  console.log(`Servidor servido em http://localhost:${PORT}`);
});
