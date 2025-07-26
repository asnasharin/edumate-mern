import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface IPayment {
  paymentId: string;
  amount: number;
  currency: string;
  enrollmentId: ObjectId;
  status: string;
  created_at: Date;
}

const paymentSchema = new Schema<IPayment>({
  paymentId: {
    type: String,
    required: true,
  },
  amount: { type: Number, required: true },
  currency: {
    type: String,
    required: true,
  },
  enrollmentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

const Payment = model("Payment", paymentSchema);
export default Payment;
