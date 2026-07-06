export function requireRole(role) {
  return (req, res, next) => {
    if (req.session && req.session.role === role) {
      return next();
    }
    // Allow admin to bypass role checks for waiter, kitchen, and cashier pages to supervise
    if (req.session && req.session.role === 'admin') {
      return next();
    }
    res.redirect('/');
  };
}

export function isAuthenticated(req, res, next) {
  if (req.session && req.session.role) {
    return next();
  }
  res.redirect('/');
}
