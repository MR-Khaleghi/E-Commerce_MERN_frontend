import bcrypt from 'bcrypt';

const data = {
  users: [
    {
      name: 'Mohammad',
      email: 'admin@example.com',
      password: bcrypt.hashSync('16520', 8),
      isAdmin: true,
      isSeller: true,
    },
    {
      name: 'Ali',
      email: 'ali@example.com',
      password: bcrypt.hashSync('123456', 8),
      isAdmin: false,
      isSeller: true,
    },
  ],
  products: [
    {
      name: 'Nike Slim shirt',
      slug: 'Nike-Slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 11,
      description: 'high quality shirt',
    },
    {
      name: 'Adidas Fit shirt',
      slug: 'Adidas-Fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 120,
      countInStock: 0,
      brand: 'Nike',
      rating: 3.5,
      numReviews: 11,
      description: 'high quality shirt',
    },
    {
      name: 'Nike Slim Pant',
      slug: 'Nike-Slim-Pant',
      category: 'Pant',
      image: '/images/p3.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.0,
      numReviews: 11,
      description: 'high quality shirt',
    },
    {
      name: 'Adida Slim Pant',
      slug: 'Nike Slim Pant',
      category: 'Pant',
      image: '/images/p4.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 2.5,
      numReviews: 11,
      description: 'high quality shirt',
    },
  ],
};

export default data;
