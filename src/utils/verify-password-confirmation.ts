export function verifyPasswordConfirmation(
  password: string,
  confirmation_password: string,
) {
  if (password != confirmation_password) {
    return false;
  }
  return true;
}
