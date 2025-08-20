import bcrypt from "bcrypt";
export const newPassword = "syahrulmind"; // Ganti dengan kata sandi baru Anda

bcrypt.hash(newPassword, 10, function (err, hash) {
  if (err) throw err;
  console.log(hash);
});
