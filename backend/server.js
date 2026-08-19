import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import testRoute from "./routes/testRoute.js";
import livestockRoute from "./routes/livestockRoute.js";
import procurementRequestRoute from "./routes/procurementRequestRoute.js";
import meatProductRoute from "./routes/meatProductRoute.js";
import meatOrderRoute from "./routes/meatOrderRoute.js";
import deliveryRoute from "./routes/deliveryRoute.js";
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/v1/user", userRoute);

//http://localhost:8080/api/v1/user/register
app.use("/api/v1/test", testRoute);
app.use("/api/v1/livestock", livestockRoute);
app.use("/api/v1/procurement-requests", procurementRequestRoute);
app.use("/api/v1/meat-products", meatProductRoute);
app.use("/api/v1/meat-orders", meatOrderRoute);
app.use("/api/v1/deliveries", deliveryRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listining at port:${PORT}`);
});
