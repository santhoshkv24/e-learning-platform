const bcrypt = require("bcryptjs");

const test = async () => {
  const plainPassword = "test1234";
  const hashed = await bcrypt.hash(plainPassword, 10);

  console.log("Hashed password:", hashed);

  const result = await bcrypt.compare(plainPassword, hashed);
  console.log("✅ Match result:", result);
};

test();
