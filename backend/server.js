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
import invoiceRoute from "./routes/invoiceRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import adminRoute from "./routes/adminRoute.js";
import complaintRoute from "./routes/complaintRoute.js";
import ratingRoute from "./routes/ratingRoute.js";
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/v1/user", userRoute);

app.use("/api/v1/test", testRoute);
app.use("/api/v1/livestock", livestockRoute);
app.use("/api/v1/procurement-requests", procurementRequestRoute);
app.use("/api/v1/meat-products", meatProductRoute);
app.use("/api/v1/meat-orders", meatOrderRoute);
app.use("/api/v1/deliveries", deliveryRoute);
app.use("/api/v1/invoices", invoiceRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/complaints", complaintRoute);
app.use("/api/v1/ratings", ratingRoute);
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listining at port:${PORT}`);
});
