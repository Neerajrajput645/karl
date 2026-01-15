const { productImageUpload } = require("../../common/fileUpload");
const { tokenVerify, adminTokenVerify } = require("../../common/tokenVerify");
const {
  productList,
  productsListMerchant,
  deleteProduct,
  addProduct,
  updateProduct,
  publishProduct,
  productListByAdmin,
} = require("../../controllers/shopping/product");

const router = require("express").Router();

router.get("/list", productList);
router.post(
  "/create",
  tokenVerify,
  productImageUpload.array("productImage"),
  addProduct
);
router.patch(
  "/update/:productId",
  tokenVerify,
  productImageUpload.array("productImage"),
  updateProduct
);
router.delete("/:productId", tokenVerify, deleteProduct);
router.patch("/publish", adminTokenVerify, publishProduct);
router.get("/list-by-admin", adminTokenVerify, productListByAdmin);

router.get("/list-by-merchant", tokenVerify, productsListMerchant);

module.exports = router;
