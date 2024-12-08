import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user.toObject();
    const products = await Product.find({ _id: { $in:[...user.cartItems.map((item) => item.product)] } });

    
    //add quantity to each product
    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (item) => item.product.toString() === product._id.toString()
      );

      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({  error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Ensure cartItems array exists
    if (!user.cartItems) {
      user.cartItems = [];
    }

    // Check if the product already exists in the cart
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Increment the quantity if the product already exists
      existingItem.quantity += 1;
    } else {
      // Add the new product to the cart
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    // Save the user with the updated cart
    await user.save();

    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item?._id?.toString() !== productId
      );
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({  error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user?.cartItems?.length > 0 && user.cartItems.find(
      (item) => item?.product?.toString() === productId
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.product.toString() !== productId
        );
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cartItems);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({  error: error.message });
  }
};
