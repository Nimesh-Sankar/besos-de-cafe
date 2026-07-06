import express from 'express';

const router = express.Router();

const ROLE_PINS = {
  admin: '1111',
  waiter: '2222',
  kitchen: '3333',
  cashier: '4444'
};

router.post('/login', (req, res) => {
  const { role, pin } = req.body;
  
  if (!role || !pin) {
    return res.render('index', { hideNavbar: true, error: 'Please select a role and enter a PIN.' });
  }

  if (ROLE_PINS[role] === pin) {
    req.session.role = role;
    
    // Redirect based on role
    if (role === 'admin') return res.redirect('/admin/dashboard');
    if (role === 'waiter') return res.redirect('/waiter/dashboard');
    if (role === 'kitchen') return res.redirect('/kitchen/orders');
    if (role === 'cashier') return res.redirect('/cashier/orders');
  } else {
    return res.render('index', { hideNavbar: true, error: 'Invalid PIN for the selected role.' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
});

export default router;
