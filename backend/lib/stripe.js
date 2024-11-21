import Stripe from "stripe";
import dotnev from 'dotenv'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
