const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)

    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProductt = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //destrcuture the fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all the fields",
      });
    }
    let product = new Product(fields);

    //handle the file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.toString();
    }

    console.log(product);
    //save to the db
    product.save((err, product) => {
      if (err) {
        console.log(err, "err");
        return res.status(400).json({
          error: "Saving tshirt in db failed",
        });
      }

      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware for loading the photo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//update controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //updation code

    let product = req.product;
    product = _.extend(product, fields);

    //handle the file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.toString();
    }

    console.log(product);
    //save to the db
    product.save((err, product) => {
      if (err) {
        console.log(err, "err");
        return res.status(400).json({
          error: "updation of product in db failed",
        });
      }

      res.json(product);
    });
  });
};

//delete controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }

    res.json({
      message: "product deleted successfully",
      deletedProduct,
    });
  });
};

//get all products -- product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;

  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot get all products",
        });
      }
      res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operations failed",
      });
    }

    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "no category found",
      });
    }

    res.json(categories);
  });
};
