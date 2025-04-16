import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

import db from "@/drizzle";
import * as t from "@/drizzle/schema";
import { Session, User, ValidateSessionReturn } from "@/types";

export function GenerateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function CreateSession(
  token: Session["id"],
  userId: User["id"],
  txn = db
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  await txn.insert(t.Session).values(session);

  return session;
}

export async function ValidateSessionToken(
  token: Session["id"]
): Promise<ValidateSessionReturn> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({
      session: t.Session,
      user: t.User,
    })
    .from(t.Session)
    .innerJoin(t.User, eq(t.Session.userId, t.User.id))
    .where(eq(t.Session.id, sessionId));

  if (result.length === 0) return { session: null, user: null };

  const { session, user } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(t.Session).where(eq(t.Session.id, sessionId));

    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await db
      .update(t.Session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(t.Session.id, sessionId));
  }

  return { session, user };
}

export async function InvalidateSession(
  sessionId: Session["id"]
): Promise<void> {
  await db.delete(t.Session).where(eq(t.Session.id, sessionId));
}

export async function InvalidateAllSessions(userId: User["id"]): Promise<void> {
  await db.delete(t.Session).where(eq(t.Session.userId, userId));
}
