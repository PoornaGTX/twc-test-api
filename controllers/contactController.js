import Contact from "../models/Contact.js";
import httpStatusResponser from "http-status-responser";
import { BadRequestError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermission.js";

const createContact = async (req, res) => {
  const { fullName, email, phoneNumber, gender } = req.body;

  if (!fullName || !email || !phoneNumber || !gender) {
    throw new BadRequestError("Please provide all values");
  }

  if (phoneNumber.toString().length !== 10 || !/^\d+$/.test(phoneNumber)) {
    throw new BadRequestError("Invalid phone number");
  }

  req.body.createdBy = req.user.userId;

  const contact = await Contact.create(req.body);
  res.status(httpStatusResponser.CREATED).json({ contact });
};

const updateContact = async (req, res) => {
  const { id: contactId } = req.params;
  const { fullName, phoneNumber } = req.body;

  if (phoneNumber.toString().length !== 10 || !/^\d+$/.test(phoneNumber)) {
    throw new BadRequestError("Invalid phone number");
  }

  if (!fullName || !phoneNumber) {
    throw new BadRequestError("Please provide all values");
  }

  const contact = await Contact.findOne({ _id: contactId });

  if (!contact) {
    throw new NotFoundError(`No contact with id :${contactId}`);
  }

  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(httpStatusResponser.OK).json({ updatedContact });
};

const deleteContact = async (req, res) => {
  const { id: contactId } = req.params;

  const contact = await Contact.findOne({ _id: contactId });

  if (!contact) {
    throw new NotFoundError(`No contact with id :${contactId}`);
  }

  checkPermissions(req.user, contact.createdBy);

  await contact.remove();

  res.status(httpStatusResponser.OK).json({ msg: "Success! contact removed" });
};

const getAllContacts = async (req, res) => {
  const allContacts = await Contact.find({
    createdBy: req.user.userId,
  });
  res.status(httpStatusResponser.OK).json({ allContacts });
};

export { createContact, updateContact, deleteContact, getAllContacts };
