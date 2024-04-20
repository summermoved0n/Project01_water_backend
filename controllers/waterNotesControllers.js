import waterNotesServices from "../services/waterNotesServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import { WaterNote } from "../models/waterNoteModel.js";

const createWaterNote = async (req, res) => {
  const { _id: owner, waterRate } = req.user;
  const { waterVolume, date } = req.body;

  const waterNote = await waterNotesServices.getOneWaterNote({ owner, date });

  if (waterNote) {
    const currentWaterNote = await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        $push: { dosesWater: { waterVolume, date } },
        $inc: { totalWater: +waterVolume },
        waterRate,
      },
      { returnDocument: "after" }
    );

    let percentageWaterDrunk = Math.round(
      currentWaterNote.totalWater / (waterRate / 100)
    );

    if (percentageWaterDrunk > 100) {
      percentageWaterDrunk = 100;
    }

    const updateWaterNote = await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        percentageWaterDrunk,
      },
      { returnDocument: "after" }
    );

    res.json(updateWaterNote);
  } else {
    const percentageWaterDrunk = Math.round(waterVolume / (waterRate / 100));

    const dosesWater = [{ waterVolume, date }];
    const newWaterNote = await waterNotesServices.createNewWaterNote({
      date,
      dosesWater,
      totalWater: waterVolume,
      waterRate,
      owner,
      percentageWaterDrunk,
    });

    res.status(201).json(newWaterNote);
  }
};

const updateDoseWater = async (req, res) => {
  const { _id: owner, waterRate } = req.user;
  const { id } = req.params;
  const { waterVolume, date } = req.body;

  const foundDocument = await WaterNote.find(
    { owner },
    { dosesWater: { $elemMatch: { _id: id } } }
  );
  const [foundData] = foundDocument;
  const [foundDoseWater] = foundData.dosesWater;

  if (!foundDoseWater) {
    throw HttpError(404);
  }

  if (foundDoseWater) {
    const currentWaterNote = await waterNotesServices.getOneWaterNote({
      owner,
      date,
    });

    const newDosesWater = [...currentWaterNote.dosesWater].map((dose) => {
      if (dose.id === id) {
        const newDose = { ...dose._doc, waterVolume };
        return newDose;
      }
      return dose;
    });

    await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        $inc: { totalWater: -foundDoseWater.waterVolume },
        dosesWater: newDosesWater,
      }
    );
    const updateDocumentWithNewDoseWater =
      await waterNotesServices.getOneAndUpdate(
        { owner, date },
        {
          $inc: { totalWater: +waterVolume },
        },
        { returnDocument: "after" }
      );

    let percentageWaterDrunk = Math.round(
      updateDocumentWithNewDoseWater.totalWater / (waterRate / 100)
    );

    if (percentageWaterDrunk > 100) {
      percentageWaterDrunk = 100;
    }

    const updateAllDocument = await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        percentageWaterDrunk,
      },
      { returnDocument: "after" }
    );

    res.json(updateAllDocument);
  }
};

const deleteDoseWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { date } = req.body;

  const foundDocument = await WaterNote.find(
    { owner },
    { dosesWater: { $elemMatch: { _id: id } } }
  );
  const [foundData] = foundDocument;
  const [foundDoseWater] = foundData.dosesWater;

  if (!foundDoseWater) {
    throw HttpError(404);
  }

  if (foundDoseWater) {
    const curentDocument = await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        $pull: { dosesWater: { _id: id } },
        $inc: { totalWater: -foundDoseWater.waterVolume },
      },
      { returnDocument: "after" }
    );

    const percentageWaterDrunk = Math.round(
      curentDocument.totalWater / (curentDocument.waterRate / 100)
    );

    const updateDocument = await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        percentageWaterDrunk,
      },
      { returnDocument: "after" }
    );

    res.json(updateDocument);
  }
};

const today = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.body;

  const currentDocument = await waterNotesServices.getOneWaterNote({
    owner,
    date,
  });

  if (!currentDocument) {
    throw HttpError(404);
  }

  res.json({
    percentageWaterDrunk: currentDocument.percentageWaterDrunk,
    dosesWater: currentDocument.dosesWater,
  });
};

const month = async (req, res) => {};

export default {
  createWaterNote: ctrlWrapper(createWaterNote),
  updateDoseWater: ctrlWrapper(updateDoseWater),
  deleteDoseWater: ctrlWrapper(deleteDoseWater),
  today: ctrlWrapper(today),
  month: ctrlWrapper(month),
};
