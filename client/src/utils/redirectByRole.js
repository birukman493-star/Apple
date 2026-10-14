export function redirectByRole(role, navigate) {
  const normalizedRole = String(role || "")
    .trim()
    .toLowerCase();

  console.log("Logged-in user role:", normalizedRole);

  if (normalizedRole === "admin") {
    navigate("/admindashboard", { replace: true });
    return;
  }

  if (normalizedRole === "user") {
    navigate("/userdashboard", { replace: true });
    return;
  }

  console.error("Unrecognized role:", role);
  navigate("/signin", { replace: true });
}