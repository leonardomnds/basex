import { AuthenticationError } from "apollo-server-errors";

export default (user) => {
  if (!user) throw new AuthenticationError("Acesso não autorizado");
}