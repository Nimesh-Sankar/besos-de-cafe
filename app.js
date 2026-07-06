import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import connectDB from './config/db.js';

// ===== Socket.IO Imports =====
import http from 'http';
import { Server } from 'socket.io';
// =============================

// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import waiterRoutes from './routes/waiterRoutes.js';
import kitchenRoutes from './routes/kitchenRoutes.js';
import cashierRoutes from './routes/cashierRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ===== Create HTTP Server =====
const server = http.createServer(app);

const io = new Server(server);

app.set("io", io);
// ==============================

// View engine setup
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'besos_de_cafe_secret_pos_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8 // 8 hours session life
  }
}));

// Expose session variables to all views (res.locals)
app.use((req, res, next) => {
  res.locals.userRole = req.session ? req.session.role : null;
  next();
});

// Load Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/waiter", waiterRoutes);
app.use("/kitchen", kitchenRoutes);
app.use("/cashier", cashierRoutes);

// Root landing / login route
app.get("/", (req, res) => {
  if (req.session && req.session.role) {
    const role = req.session.role;
    if (role === 'admin') return res.redirect('/admin/menu');
    if (role === 'waiter') return res.redirect('/waiter/dashboard');
    if (role === 'kitchen') return res.redirect('/kitchen/orders');
    if (role === 'cashier') return res.redirect('/cashier/orders');
  }
  res.render("index", { hideNavbar: true, error: null });
});

// Wildcard 404 handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

const PORT = process.env.PORT || 3000;

// ===== Start HTTP Server =====
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// =============================