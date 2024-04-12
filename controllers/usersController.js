import * as usersService from "../services/usersServices.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const currentUser = async (req, res) => {};

export default { currentUser: ctrlWrapper(currentUser) };
