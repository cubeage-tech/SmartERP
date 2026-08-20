// Roles in this app are camelCase (e.g. "financeManager", "superAdmin"), with
// SCREAMING_SNAKE_CASE ("FINANCE_MANAGER") only appearing in a couple of
// unused legacy constants — this handles both so it stays correct either way.
export const formatRole = (role) => {
  if (!role) {
    return "Employee";
  }

  const words = role
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // camelCase -> camel Case
    .replace(/_/g, " ")                     // SNAKE_CASE -> SNAKE CASE
    .toLowerCase()
    .split(" ")
    .filter(Boolean);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
