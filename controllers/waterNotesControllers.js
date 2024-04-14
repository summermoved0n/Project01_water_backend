import waterNotesServices from "../services/waterNotesServices.js";
import { WaterNote } from "../models/waterNoteModel.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const createWaterNote = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterVolume, date } = req.body;

  const isWaterNote = await waterNotesServices.getOneWaterNote({ owner, date });

  if (isWaterNote) {
    await WaterNote.findOneAndUpdate(
      { owner, date },
      {
        $push: { dosesWater: { waterVolume, date } },
        $inc: { totalWater: +waterVolume },
      }
    );
    const updateWaterNote = await waterNotesServices.getOneWaterNote({
      owner,
      date,
    });

    res.json(updateWaterNote);
  } else {
    const dosesWater = [{ waterVolume, date }];
    const newWaterNote = await waterNotesServices.createNewWaterNote({
      date,
      dosesWater,
      totalWater: waterVolume,
      owner,
    });

    res.status(201).json(newWaterNote);
  }
};

export default {
  createWaterNote: ctrlWrapper(createWaterNote),
};
