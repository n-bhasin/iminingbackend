const Joi = require("joi");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/users");
// const campaignRouter = require("./routes/campaigns");
const routerAuth = require("./routes/auth");

const express = require("express");
const app = express();

if (process.env.jwtPrivateKey) {
  console.log("FATAL ERROR!");
  process.exit(1);
}
//database connection
const DB = process.env.DB;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected with MongoDB..!"))
  .catch((err) => console.log(err));

//middlewares
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/imining/admin", adminRouter);
// app.use("/api/telemarket/campaign", campaignRouter);
app.use("/api/imining/user", userRouter);
app.use("/api/imining/auth", routerAuth);
//port and listening to app..
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
