import MenuItem from "../models/menuItemModel.js";

export function loadAddMenu(req, res) {
  res.render("admin/add-menu", { title: "Add Menu Item" });
}

export async function addMenu(req, res) {
  try {
    const { name, category, price, isAvailable } = req.body;
    
    // Server-side validation
    if (!name || !category || isNaN(price) || price <= 0) {
      return res.status(400).send("Invalid input data. Name, category, and positive price are required.");
    }

    await MenuItem.create({
      name,
      category,
      price: Number(price),
      isAvailable: isAvailable === "on"
    });
    
    res.redirect("/admin/menu");
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).send("Error adding menu item");
  }
}

export async function loadMenuList(req, res) {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    res.render("admin/menu-list", {
      title: "Menu Items Management",
      menuItems: menuItems
    });
  } catch (error) {
    console.error("Error fetching menu list:", error);
    res.status(500).send("Something went wrong");
  }
}

export async function deleteMenuItem(req, res) {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.redirect("/admin/menu");
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).send("Something went wrong");
  }
}

export async function loadEditMenu(req, res) {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).send("Menu item not found");
    }
    res.render("admin/edit-menu", {
      title: `Edit ${menuItem.name}`,
      menuItem
    });
  } catch (error) {
    console.error("Error loading edit page:", error);
    res.status(500).send("Error loading edit menu item page");
  }
}

export async function updateMenu(req, res) {
  try {
    const { name, category, price, isAvailable } = req.body;

    // Server-side validation
    if (!name || !category || isNaN(price) || price <= 0) {
      return res.status(400).send("Invalid input data. Name, category, and positive price are required.");
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: Number(price),
        isAvailable: isAvailable === "on"
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).send("Menu item not found to update");
    }

    res.redirect("/admin/menu");
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).send("Error updating menu item");
  }
}