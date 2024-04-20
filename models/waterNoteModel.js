import { Schema, model } from "mongoose";

const DosesWaterSchema = new Schema({
  waterVolume: {
    type: Number,
  },
  date: String,
});

const waterNoteSchema = Schema(
  {
    date: {
      type: String,
      required: true,
    },
    dosesWater: [DosesWaterSchema],
    totalWater: {
      type: Number,
      default: 0,
    },
    waterRate: {
      type: Number,
      default: 2000,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    percentageWaterDrunk: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true }
);

export const WaterNote = model("waterNote", waterNoteSchema);
