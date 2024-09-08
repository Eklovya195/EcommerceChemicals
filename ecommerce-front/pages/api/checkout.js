import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import stripe from 'stripe';

const stripeClient = stripe(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const {
    name, email, city,
    postalCode, streetAddress, country,
    cartProducts,
  } = req.body;

  try {
    await mongooseConnect();

    // Find unique product ids
    const uniqueIds = [...new Set(cartProducts)];

    // Find product information for the given ids
    const productsInfos = await Product.find({ _id: { $in: uniqueIds } });

    // Prepare line items for the Stripe session
    const lineItems = productsInfos.map(productInfo => {
      const quantity = cartProducts.filter(id => id === productInfo._id.toString()).length;
      return {
        price_data: {
          currency: 'USD',
          product_data: {
            name: productInfo.title,
          },
          unit_amount: productInfo.price * 100,
        },
        quantity,
      };
    });

    // Create a new order document
    const orderDoc = await Order.create({
      line_items: lineItems,
      name, email, city, postalCode,
      streetAddress, country, paid: false,
    });

    // Create a new Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.PUBLIC_URL}/cart?success=1`,
      cancel_url: `${process.env.PUBLIC_URL}/cart?canceled=1`,
      metadata: { orderId: orderDoc._id.toString() },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
