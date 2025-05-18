require("./config/environment");
const express = require("express");
const morgan = require("morgan");

const citizenRoutes = require("./api/routes/citizenRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Egov API is running" });
});

app.use("/api/citizens", citizenRoutes);

const PORT = process.env.PORT || 7002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
