import mongoose, { Document, Schema } from "mongoose";

export interface IHealthProfile extends Document {
  /** User ID */
  userId: mongoose.Types.ObjectId,
  /** Student ID */
  studentId: mongoose.Types.ObjectId,
  /** height*/
  height: number,
  /** weight */
  weight: number,
  /** blood type */
  bloodType: string,
  /** vision */
  vision: string[],
  /** allergies */
  allergies: string[],
  /** chronic diseases */
  choronicDeases: string[],
  /** device support */
  deviceSupport: string[];
}

interface IHealthProfileModel extends mongoose.Model<IHealthProfile> { }

const HealthProfileSchema = new Schema<IHealthProfile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  height: { type: Number, required: true }, 
  weight: { type: Number, required: true }, 
  bloodType: { type: String, required: true }, 
  vision: { type: [String], required: true }, 
  allergies: { type: [String], required: true }, 
  choronicDeases: { type: [String]}, 
  deviceSupport: { type: [String]}
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  versionKey: false
});

export const HealthProfile = mongoose.model<IHealthProfile, IHealthProfileModel>("HealthProfile", HealthProfileSchema);


