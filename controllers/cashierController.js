import Order from "../models/orderModel.js";

export async function loadCashierOrders(req, res) {
  try {
    // Cashier wants to see all orders that have not been paid yet
    // Sort by createdAt descending
    const unpaidOrders = await Order.find({
      status: { $ne: "paid" }
    }).sort({ createdAt: -1 });

    res.render("cashier/orders", {
      title: "Cashier Checkout Dashboard",
      orders: unpaidOrders
    });
  } catch (error) {
    console.error("Error loading cashier orders:", error);
    res.status(500).send("Error fetching unpaid orders");
  }
}

export async function payOrder(req, res) {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).send("Order not found");
    }

    order.status = "paid";
    order.paidAt = new Date();
    await order.save();

    res.redirect("/cashier/orders");
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing checkout");
  }
}
