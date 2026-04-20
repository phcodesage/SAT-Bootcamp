import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistration extends Document {
  studentName: string;
  email: string;
  phone: string;
  subject: 'English' | 'Math' | 'Both';
  courseName: string;
  paymentMethod: 'zelle' | 'card' | 'pending';
  zelleReference?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  selectedDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    studentName: { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    phone:       { type: String, required: true, trim: true },
    subject:     { type: String, required: true, enum: ['English', 'Math', 'Both'] },
    courseName:  { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, enum: ['zelle', 'card', 'pending'], default: 'pending' },
    zelleReference: { type: String, trim: true },
    status:      { type: String, required: true, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    notes:       { type: String, trim: true },
    selectedDate: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent model re-compilation in Next.js hot reload
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;
