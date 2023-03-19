import express from "express";
const router = express.Router();

import {
  createContact,
  updateContact,
  deleteContact,
  getAllContacts,
} from "../controllers/contactController.js";

router.route("/").post(createContact).get(getAllContacts);
router.route("/update-contact/:id").patch(updateContact);
router.route("/delete-contact/:id").delete(deleteContact);

export default router;
