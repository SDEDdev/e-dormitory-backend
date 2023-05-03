const r = require("express").Router();
const { body } = require("express-validator");
const auth = require($ + "/middleware/auth.js");

r.get(
  "/",
  auth(["admin", "dean", "commandant", "user"]),
  require($ + "/controllers/dormitory/list")
);

r.post(
  "/create",
  auth(["admin"]),
  body("number").not().isEmpty().withMessage("Наіменування не вказано"),
  require($ + "/controllers/dormitory/create")
);

r.patch(
  "/edit",
  auth(["admin"]),
  body("id").not().isEmpty().withMessage("ID не вказано"),
  body("number").not().isEmpty().withMessage("Наіменування не вказано"),
  body("moderator_id").not().isEmpty().withMessage("ID модератора не вказано"),

  require($ + "/controllers/dormitory/edit")
);

module.exports = r;
