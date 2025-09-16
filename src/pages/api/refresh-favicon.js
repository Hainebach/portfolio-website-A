export default function handler(req, res) {
  // Set headers to prevent caching
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  // Force a page refresh by redirecting back to the referer
  const referer = req.headers.referer || "/";
  res.redirect(307, referer);
}
