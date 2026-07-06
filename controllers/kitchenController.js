import Order from "../models/orderModel.js";

export async function loadKitchenOrders(req, res) {
  try {
    // Kitchen should see orders that need preparation (pending or preparing)
    // Sort by createdAt ascending (FIFO - oldest first)
    const activeOrders = await Order.find({
      status: { $in: ["pending", "preparing"] }
    }).sort({ createdAt: 1 });

    res.render("kitchen/orders", {
      title: "Kitchen Monitor",
      orders: activeOrders
    });
  } catch (error) {
    console.error("Error loading kitchen orders:", error);
    res.status(500).send("Error fetching kitchen orders");
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const orderId = req.params.id;
    const { nextStatus } = req.body; // e.g. "preparing" or "ready"

    if (!["preparing", "ready"].includes(nextStatus)) {
      return res.status(400).send("Invalid status transition for the kitchen");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    order.status = nextStatus;
    await order.save();

    res.redirect("/kitchen/orders");
  } catch (error) {
    console.error("Error updating order status in kitchen:", error);
    res.status(500).send("Error updating order status");
  }
}