import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const seller = req.query.seller || '';
  const sellerFilter = seller ? { seller } : {};
  const products = await Product.find({ ...sellerFilter }).populate(
    'seller',
    'seller.name seller.logo'
  ); //populate first param. = the object that we want to to populate and the second param. = fileds of that object
  res.send(products);
});

const PAGE_SIZE = 3;
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    // console.log(req);
    console.log('query##############################', query);
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';
    // console.log('first', Number(price.splite('-')[0]));
    // console.log('secondclear', Number(price.splite('-')[1]));
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]), // 51-200 => 51
              $lte: Number(price.split('-')[1]), // 51-200 => 200
            },
          }
        : {};
    //  -1 for ddescending , 1 for asc
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1)) // fetch docs after # documents
      .limit(pageSize); // fetch pageSize docs
    //  .find().skip(3).limit(2) => fetch 2 docs after the first 3 docs
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize), // math.ceil rounds up a number ceil(4/3)=2
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    // console.log(categories);
    const lowerCategories = categories.map((x) => x.toLowerCase());
    const filterdCategories = [...new Set(lowerCategories)];
    // console.log(filterdCategories);
    res.send(filterdCategories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    'seller',
    'seller.name seller.logo seller.rating seller.numReviews'
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not found' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'seller',
    'seller.name seller.logo seller.rating seller.numReviews'
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not found' });
  }
});

productRouter.put('/:id', isAuth, isSellerOrAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    res.send({ message: 'Product Not found', product: updatedProduct });
  } else {
    res.status(404).send({ message: 'Product Not found' });
  }
});

productRouter.post('/:id/reviews', isAuth, async (req, res) => {
  const productId = req.params.id;
  // console.log(productId);
  const product = await Product.findById(productId);
  // console.log(product);
  if (product) {
    if (product.reviews.find((x) => x.name === req.user.name)) {
      return res
        .status(400)
        .send({ message: 'You already submitted a review!' });
    }
    // console.log('product for review found');
    const review = {
      name: req.user.name,
      comment: req.body.comment,
      rating: Number(req.body.rating),
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      message: 'Review created',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Product Not found' });
  }
});

productRouter.post('/', isAuth, isSellerOrAdmin, async (req, res) => {
  const product = new Product({
    name: 'sample name' + Date.now(),
    slug: 'sample slug' + Date.now(),
    seller: req.user._id,
    image: '/images/p1.jpg',
    brand: 'sample brand',
    category: 'sample category',
    description: 'sample des',
    price: 0,
    countInStock: 0,
    rating: 0,
    numReviews: 0,
  });
  const createdProduct = await product.save();
  res.send({ message: 'Product Created', product: createdProduct });
});

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deletedProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
