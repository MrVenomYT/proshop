import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import initialProducts from '../data/products.js';
import initialUsers from '../data/users.js';

let usersStore = [];
let productsStore = [];
let ordersStore = [];

let idCounter = 1;
const generateId = () => {
  const hex = (idCounter++).toString(16).padStart(6, '0');
  return `60d21b4667d0d8992e${hex}`;
};

export const initInMemoryDb = () => {
  // Initialize users
  usersStore = initialUsers.map((u, idx) => ({
    _id: `60d21b4667d0d8992e00000${idx + 1}`,
    name: u.name,
    email: u.email.toLowerCase(),
    password: u.password, // already hashed in initialUsers
    isAdmin: !!u.isAdmin,
    favorites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const adminId = usersStore[0]._id;

  // Initialize products
  productsStore = initialProducts.map((p, idx) => ({
    _id: `60d21b4667d0d8992e00010${idx + 1}`,
    user: adminId,
    name: p.name,
    image: p.image,
    brand: p.brand,
    category: p.category,
    description: p.description,
    price: p.price,
    countInStock: p.countInStock,
    rating: p.rating,
    numReviews: p.numReviews,
    reviews: [
      {
        _id: `60d21b4667d0d8992e00020${idx + 1}`,
        name: 'John Doe',
        rating: 5,
        comment: 'Great product! Exceeded expectations.',
        user: usersStore[1]._id,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  ordersStore = [];
};

initInMemoryDb();

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

const createUserWrapper = (userData) => {
  if (!userData) return null;
  const clone = { ...userData };
  return {
    ...clone,
    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, clone.password);
    },
    async save() {
      const idx = usersStore.findIndex((u) => u._id.toString() === clone._id.toString());
      if (idx !== -1) {
        if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }
        usersStore[idx] = {
          ...usersStore[idx],
          name: this.name,
          email: this.email ? this.email.toLowerCase() : usersStore[idx].email,
          password: this.password || usersStore[idx].password,
          isAdmin: this.isAdmin !== undefined ? this.isAdmin : usersStore[idx].isAdmin,
          favorites: this.favorites || usersStore[idx].favorites || [],
          updatedAt: new Date().toISOString(),
        };
        return createUserWrapper(usersStore[idx]);
      }
      return this;
    },
    async remove() {
      usersStore = usersStore.filter((u) => u._id.toString() !== clone._id.toString());
    },
  };
};

const createProductWrapper = (productData) => {
  if (!productData) return null;
  const clone = { ...productData };
  return {
    ...clone,
    reviews: [...(clone.reviews || [])],
    async save() {
      const idx = productsStore.findIndex((p) => p._id.toString() === clone._id.toString());
      const updatedItem = {
        ...clone,
        name: this.name,
        price: Number(this.price),
        image: this.image,
        brand: this.brand,
        category: this.category,
        countInStock: Number(this.countInStock),
        description: this.description,
        reviews: this.reviews || [],
        rating: this.rating !== undefined ? this.rating : clone.rating,
        numReviews: this.numReviews !== undefined ? this.numReviews : clone.numReviews,
        updatedAt: new Date().toISOString(),
      };
      if (idx !== -1) {
        productsStore[idx] = updatedItem;
      } else {
        productsStore.push(updatedItem);
      }
      return createProductWrapper(updatedItem);
    },
    async remove() {
      productsStore = productsStore.filter((p) => p._id.toString() !== clone._id.toString());
    },
  };
};

const createOrderWrapper = (orderData) => {
  if (!orderData) return null;
  const clone = { ...orderData };
  return {
    ...clone,
    async save() {
      const idx = ordersStore.findIndex((o) => o._id.toString() === clone._id.toString());
      const updatedItem = {
        ...clone,
        isPaid: this.isPaid !== undefined ? this.isPaid : clone.isPaid,
        paidAt: this.paidAt || clone.paidAt,
        isDelivered: this.isDelivered !== undefined ? this.isDelivered : clone.isDelivered,
        deliveredAt: this.deliveredAt || clone.deliveredAt,
        paymentResult: this.paymentResult || clone.paymentResult,
        updatedAt: new Date().toISOString(),
      };
      if (idx !== -1) {
        ordersStore[idx] = updatedItem;
      } else {
        ordersStore.push(updatedItem);
      }
      return createOrderWrapper(updatedItem);
    },
  };
};

export const memDb = {
  User: {
    async findOne({ email }) {
      if (!email) return null;
      const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
      return user ? createUserWrapper(user) : null;
    },
    findById(id) {
      const exec = async () => {
        const user = usersStore.find((u) => u._id.toString() === id.toString());
        return user ? createUserWrapper(user) : null;
      };
      return {
        select(exclude) {
          return {
            then(resolve, reject) {
              return exec().then(resolve, reject);
            },
          };
        },
        then(resolve, reject) {
          return exec().then(resolve, reject);
        },
      };
    },
    async find({}) {
      return usersStore.map((u) => createUserWrapper(u));
    },
    async create({ name, email, password }) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: generateId(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        isAdmin: false,
        favorites: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      usersStore.push(newUser);
      return createUserWrapper(newUser);
    },
  },

  Product: {
    find(query = {}) {
      let filtered = [...productsStore];
      if (query.name && query.name.$regex) {
        const regex = new RegExp(query.name.$regex, query.name.$options || 'i');
        filtered = filtered.filter((p) => regex.test(p.name));
      }

      const chain = {
        _sort: null,
        _limit: null,
        _skip: 0,
        sort(sortObj) {
          this._sort = sortObj;
          return this;
        },
        limit(num) {
          this._limit = num;
          return this;
        },
        skip(num) {
          this._skip = num;
          return this;
        },
        then(resolve, reject) {
          try {
            let res = [...filtered];
            if (this._sort && this._sort.rating) {
              res.sort((a, b) => (this._sort.rating === -1 ? b.rating - a.rating : a.rating - b.rating));
            }
            if (this._skip) {
              res = res.slice(this._skip);
            }
            if (this._limit !== null) {
              res = res.slice(0, this._limit);
            }
            resolve(res.map((p) => createProductWrapper(p)));
          } catch (err) {
            reject(err);
          }
        },
      };
      return chain;
    },
    async countDocuments(query = {}) {
      let filtered = [...productsStore];
      if (query.name && query.name.$regex) {
        const regex = new RegExp(query.name.$regex, query.name.$options || 'i');
        filtered = filtered.filter((p) => regex.test(p.name));
      }
      return filtered.length;
    },
    async findById(id) {
      const product = productsStore.find((p) => p._id.toString() === id.toString());
      return product ? createProductWrapper(product) : null;
    },
    createInstance(data) {
      const newProduct = {
        _id: generateId(),
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      return createProductWrapper(newProduct);
    },
  },

  Order: {
    createInstance(data) {
      const newOrder = {
        _id: generateId(),
        isPaid: false,
        isDelivered: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      return createOrderWrapper(newOrder);
    },
    findById(id) {
      const exec = async () => {
        const order = ordersStore.find((o) => o._id.toString() === id.toString());
        if (!order) return null;
        const user = usersStore.find((u) => u._id.toString() === (order.user?._id || order.user)?.toString());
        const populatedOrder = {
          ...order,
          user: user ? { _id: user._id, name: user.name, email: user.email } : order.user,
        };
        return createOrderWrapper(populatedOrder);
      };

      return {
        populate() {
          return {
            then(resolve, reject) {
              return exec().then(resolve, reject);
            },
          };
        },
        then(resolve, reject) {
          return exec().then(resolve, reject);
        },
      };
    },
    find(query = {}) {
      const exec = async () => {
        let results = [...ordersStore];
        if (query.user) {
          results = results.filter((o) => (o.user?._id || o.user)?.toString() === query.user.toString());
        }
        return results.map((o) => {
          const user = usersStore.find((u) => u._id.toString() === (o.user?._id || o.user)?.toString());
          return createOrderWrapper({
            ...o,
            user: user ? { _id: user._id, id: user._id, name: user.name, email: user.email } : o.user,
          });
        });
      };

      return {
        populate() {
          return {
            then(resolve, reject) {
              return exec().then(resolve, reject);
            },
          };
        },
        then(resolve, reject) {
          return exec().then(resolve, reject);
        },
      };
    },
  },
};
