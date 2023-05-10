const db = require($ + "/db.js");

module.exports = async (req, res) => {
  try {
    const data = await db(
      "SELECT dormitories.id, number, commandant_id, email  FROM dormitories LEFT JOIN users ON dormitories.commandant_id = users.id"
    );
    for (let i = 0; i < data.length; i++) {
      var temp = await db(
        `SELECT faculties_id FROM faculties_dormitory WHERE dormitory_id = ?`,
        [data[i].id]
      );
      data[i].faculties = [];
      for (let j = 0; j < temp.length; j++) {
        data[i].faculties.push(temp[j].faculties_id);
      }
    }
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: [{ msg: "Помилка даних" }] });
  }
};
