const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  contactby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Contact", contactSchema);
