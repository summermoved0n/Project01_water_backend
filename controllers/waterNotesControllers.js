import waterNotesServices from "../services/waterNotesServices.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import { WaterNote } from "../models/waterNoteModel.js";

const createWaterNote = async (req, res) => {
  const { _id: owner, waterRate } = req.user;
  const { waterVolume, date } = req.body;

  const waterNote = await waterNotesServices.getOneWaterNote({ owner, date });

  const currentTime = new Date().toLocaleTimeString();
  const hoursPlusMinets = currentTime.slice(0, 4);
  const halfOfDay = currentTime.slice(8);
  const time = hoursPlusMinets + " " + halfOfDay;

  if (waterNote) {
    const currentWaterNote = await waterNotesServices.getOneAndUpdate(
      { owner, date },
      {
        $push: { dosesWater: { waterVolume, time } },
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

    const dosesWater = [{ waterVolume, time }];
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
  const { waterVolume } = req.body;

  const date = new Date().toISOString().substring(0, 10);

  const foundDocument = await WaterNote.find(
    { owner },
    { dosesWater: { $elemMatch: { _id: id } } }
  );

  const foundDoseWaterUpdate = foundDocument.filter((item) => {
    const dose = item.dosesWater[0];
    if (dose) {
      return dose;
    }
  });

  const [allObjfoundDoseWater] = foundDoseWaterUpdate;

  const [foundDoseWater] = allObjfoundDoseWater.dosesWater;

  if (!foundDoseWater) {
    throw HttpError(404, "not found");
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

  const currentDate = new Date().toISOString().substring(0, 10);

  const foundDocument = await WaterNote.find(
    { owner },
    { dosesWater: { $elemMatch: { _id: id } } }
  );

  const foundDoseWaterDelete = foundDocument.filter((item) => {
    const dose = item.dosesWater[0];
    if (dose) {
      return dose;
    }
  });

  const [allObjfoundDoseWater] = foundDoseWaterDelete;

  const [foundDoseWater] = allObjfoundDoseWater.dosesWater;

  if (!foundDoseWater) {
    throw HttpError(404);
  }

  if (foundDoseWater) {
    const curentDocument = await waterNotesServices.getOneAndUpdate(
      { owner, date: currentDate },
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
      { owner, date: currentDate },
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

  const currentDate = new Date().toISOString().substring(0, 10);

  const currentDocument = await waterNotesServices.getOneWaterNote({
    owner,
    date: currentDate,
  });

  if (!currentDocument) {
    res.json({
      percentageWaterDrunk: 0,
      dosesWater: [],
    });
  } else {
    res.json({
      percentageWaterDrunk: currentDocument.percentageWaterDrunk,
      dosesWater: currentDocument.dosesWater,
    });
  }
};

const month = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.query;

  const dataMonth = await WaterNote.find({ owner, date: { $regex: date } });

  const getYears = date.slice(0, 4);
  const getMonth = date.slice(5, 7).slice(1);

  const currentDate = new Date(getYears, getMonth, 0);
  const totalDayInCurrentMonth = currentDate.getDate();

  const arrDatesMonth = [];

  for (let i = 1; i <= totalDayInCurrentMonth; i += 1) {
    const date = { date: String(i) };
    arrDatesMonth.push(date);
  }

  const dataInfo = arrDatesMonth.map((item) => {
    const dayOfMonth = dataMonth.find((day) => {
      const formatedDay = day.date.slice(8);

      let date = item.date;
      if (item.date.length === 1) {
        date = "0" + date;
      }

      if (formatedDay === date) {
        return day;
      }
    });

    if (dayOfMonth) {
      const formateDay = dayOfMonth.date.slice(8);

      const formatter = new Intl.DateTimeFormat("default", { month: "long" });

      const currentMonth = formatter.format(new Date(getYears, getMonth - 1));

      const date = `${formateDay}, ${currentMonth}`;

      const liters = (dayOfMonth.waterRate / 1000).toFixed(1);
      const waterRate = `${liters} L`;

      const records = dayOfMonth.dosesWater.length;

      const percentageWaterDrunk = dayOfMonth.percentageWaterDrunk;

      const dataDay = {
        date,
        waterRate,
        percentageWaterDrunk,
        records,
      };

      return dataDay;
    } else {
      const dateOfMonth = new Date(getYears, getMonth - 1, item.date)
        .toISOString()
        .substring(0, 10);

      const formateDay = dateOfMonth.slice(8);

      const formatter = new Intl.DateTimeFormat("default", { month: "long" });

      const currentMonth = formatter.format(new Date(getYears, getMonth - 1));

      const date = `${formateDay}, ${currentMonth}`;

      const dataDay = {
        date,
        waterRate: "2.0 L",
        percentageWaterDrunk: 0,
        records: 0,
      };

      return dataDay;
    }
  });

  res.json(dataInfo);
};

export default {
  createWaterNote: ctrlWrapper(createWaterNote),
  updateDoseWater: ctrlWrapper(updateDoseWater),
  deleteDoseWater: ctrlWrapper(deleteDoseWater),
  today: ctrlWrapper(today),
  month: ctrlWrapper(month),
};
