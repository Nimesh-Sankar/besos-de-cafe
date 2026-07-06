import MenuItem from "../models/menuItemModel.js";
import Order from "../models/orderModel.js";

export async function loadWaiterDashboard(req, res) {
  try {
    // Show active orders (excluding paid / archived ones)
    const activeOrders = await Order.find({ status: { $ne: "paid" } }).sort({ createdAt: -1 });
    
    res.render("waiter/dashboard", {
      title: "Waiter Dashboard",
      orders: activeOrders
    });
  } catch (error) {
    console.error("Error loading waiter dashboard:", error);
    res.status(500).send("Something went wrong loading dashboard");
  }
}

export async function loadOrderPage(req, res) {
  try {
    const menuItems = await MenuItem.find({ isAvailable: true }).sort({ category: 1, name: 1 });
    res.render("waiter/order", {
      title: "Take New Order",
      menuItems
    });
  } catch (error) {
    console.error("Error loading order page:", error);
    res.status(500).send("Something went wrong");
  }
}

export async function createOrder(req, res) {
  try {
    const { orderType, tableNumber, customerName, customerPhone, deliveryAddress, menuItemId, quantity } = req.body;

    const type = ["dine-in", "takeaway", "delivery"].includes(orderType) ? orderType : "dine-in";

    let tableNum = undefined;
    if (type === "dine-in") {
      if (!tableNumber || isNaN(tableNumber) || Number(tableNumber) <= 0) {
        return res.status(400).send("Invalid table number for Dine-In order");
      }
      tableNum = Number(tableNumber);
    }

    if (type === "delivery") {
      if (!customerName || !customerPhone || !deliveryAddress) {
        return res.status(400).send("Customer Name, Phone, and Delivery Address are required for Delivery orders");
      }
    }

    if (type === "takeaway") {
      if (!customerName) {
        return res.status(400).send("Customer Name is required for Takeaway orders");
      }
    }

    // Coerce raw body inputs to arrays to resolve the single/zero item parsing bug
    const itemIds = Array.isArray(menuItemId) ? menuItemId : (menuItemId ? [menuItemId] : []);
    const qtys = Array.isArray(quantity) ? quantity : (quantity ? [quantity] : []);

    const items = [];
    let totalAmount = 0;

    for (let i = 0; i < itemIds.length; i++) {
      const qty = Number(qtys[i]);
      
      if (!isNaN(qty) && qty > 0) {
        const menuItem = await MenuItem.findById(itemIds[i]);
        
        if (menuItem && menuItem.isAvailable) {
          const itemTotal = menuItem.price * qty;
          totalAmount += itemTotal;
          
          items.push({
            menuItemId: menuItem._id,
            itemName: menuItem.name,
            price: menuItem.price,
            quantity: qty
          });
        }
      }
    }

    if (items.length === 0) {
      return res.status(400).send("Cannot place an empty order. Please specify quantities for at least one item.");
    }

    await Order.create({
      orderType: type,
      tableNumber: tableNum,
      customerName: type !== "dine-in" ? customerName : undefined,
      customerPhone: type !== "dine-in" ? customerPhone : undefined,
      deliveryAddress: type === "delivery" ? deliveryAddress : undefined,
      items,
      totalAmount,
      status: "pending"
    });

    res.redirect("/waiter/dashboard");
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Error placing the order");
  }
}

export async function serveOrder(req, res) {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).send("Order not found");
    }
    
    // Only ready orders can be served
    if (order.status === "ready") {
      order.status = "served";
      await order.save();
    }
    
    res.redirect("/waiter/dashboard");
  } catch (error) {
    console.error("Error serving order:", error);
    res.status(500).send("Error updating order status");
  }
}