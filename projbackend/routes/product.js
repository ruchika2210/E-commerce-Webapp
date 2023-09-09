var express = require("express");
var router = express.Router();

const {
  getProductById,
  createProductt,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("productId", getProductById);

//all of actual routes
//create Routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProductt
);

//update routes

router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//delete routes

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//listing routes

router.get("/products", getAllProducts);
//read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
