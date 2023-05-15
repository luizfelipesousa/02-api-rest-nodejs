import { FastifyRequest, FastifyReply } from "fastify";

export async function checkIfSessionIdExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized.",
    });
  }
}
