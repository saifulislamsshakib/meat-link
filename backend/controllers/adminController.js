import { User } from "../models/userModel.js";
import { MeatOrder } from "../models/meatOrderModel.js";
import { Delivery } from "../models/deliveryModel.js";
import { Livestock } from "../models/livestockModel.js";
import { Complaint } from "../models/complaintModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -token -otp -otpExpiry")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// export const approveUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.isVarified) {
//       return res.status(400).json({
//         success: false,
//         message: "User is already verified",
//       });
//     }

//     user.isVarified = true;

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "User approved successfully",
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         isVarified: user.isVarified,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin account does not require approval",
      });
    }

    user.accountStatus = "approved";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVarified: user.isVarified,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin account cannot be rejected",
      });
    }

    user.accountStatus = "rejected";
    user.isLoggedIn = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User registration rejected successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVarified: user.isVarified,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await MeatOrder.find()
      .populate("superShop", "firstName lastName email")
      .populate({
        path: "meatProduct",
        select:
          "productName meatType pricePerKg processingStatus packagingStatus slaughterhouse",
        populate: {
          path: "slaughterhouse",
          select: "firstName lastName email",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("driver", "firstName lastName email phoneNo role")
      .populate({
        path: "order",
        select:
          "quantity pricePerKg totalPrice status deliveryAddress deliveryCity deliveryZipCode",
        populate: {
          path: "superShop",
          select: "firstName lastName email",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalSlaughterhouses,
      totalSuperShops,
      totalDrivers,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalDeliveries,
      deliveredDeliveries,
      totalLivestock,
      availableLivestock,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "farmer",
      }),

      User.countDocuments({
        role: "slaughterhouse",
      }),

      User.countDocuments({
        role: "super_shop",
      }),

      User.countDocuments({
        role: "driver",
      }),

      MeatOrder.countDocuments(),

      MeatOrder.countDocuments({
        status: "pending",
      }),

      MeatOrder.countDocuments({
        status: "confirmed",
      }),

      MeatOrder.countDocuments({
        status: "processing",
      }),

      MeatOrder.countDocuments({
        status: "shipped",
      }),

      MeatOrder.countDocuments({
        status: "delivered",
      }),

      Delivery.countDocuments(),

      Delivery.countDocuments({
        status: "delivered",
      }),

      Livestock.countDocuments(),

      Livestock.countDocuments({
        availabilityStatus: {
          $in: ["available", "partially_available"],
        },
      }),

      Complaint.countDocuments(),

      Complaint.countDocuments({
        status: "pending",
      }),

      Complaint.countDocuments({
        status: "resolved",
      }),
    ]);

    const revenueResult = await MeatOrder.aggregate([
      {
        $match: {
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          farmers: totalFarmers,
          slaughterhouses: totalSlaughterhouses,
          superShops: totalSuperShops,
          drivers: totalDrivers,
        },

        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
        },

        deliveries: {
          total: totalDeliveries,
          delivered: deliveredDeliveries,
        },

        livestock: {
          total: totalLivestock,
          available: availableLivestock,
        },

        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          resolved: resolvedComplaints,
        },

        revenue: {
          total: totalRevenue,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getReports = async (req, res) => {
  try {
    const [
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalDeliveries,
      deliveredDeliveries,
      totalUsers,
      totalComplaints,
      resolvedComplaints,
    ] = await Promise.all([
      MeatOrder.countDocuments(),

      MeatOrder.countDocuments({
        status: "delivered",
      }),

      MeatOrder.countDocuments({
        status: "pending",
      }),

      Delivery.countDocuments(),

      Delivery.countDocuments({
        status: "delivered",
      }),

      User.countDocuments(),

      Complaint.countDocuments(),

      Complaint.countDocuments({
        status: "resolved",
      }),
    ]);

    const salesResult = await MeatOrder.aggregate([
      {
        $match: {
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    return res.status(200).json({
      success: true,
      report: {
        orders: {
          total: totalOrders,
          delivered: deliveredOrders,
          pending: pendingOrders,
        },

        sales: {
          total: totalSales,
        },

        deliveries: {
          total: totalDeliveries,
          delivered: deliveredDeliveries,
        },

        users: {
          total: totalUsers,
        },

        complaints: {
          total: totalComplaints,
          resolved: resolvedComplaints,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
