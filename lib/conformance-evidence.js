"use strict";

function buildConformanceEvidence({ did, mailbox, generation, messages, implementation, revision }) {
  if (typeof did !== "string" || !did.startsWith("did:key:")) throw new Error("A public did:key is required.");
  if (typeof mailbox !== "string" || !/^[a-z0-9][a-z0-9_-]{0,47}$/.test(mailbox)) throw new Error("Mailbox name is invalid.");
  if (!Number.isInteger(generation) || generation < 0) throw new Error("Room generation must be a non-negative integer.");
  if (!Array.isArray(messages)) throw new Error("Messages must be an array.");
  const records = messages
    .filter((message) => message && typeof message === "object" && message.from === did)
    .filter((message) => ["seq", "ts", "from", "text", "nonce", "sig"].every((field) => Object.hasOwn(message, field)))
    .map((message) => ({
      room: mailbox,
      generation,
      seq: message.seq,
      ts: message.ts,
      from: message.from,
      text: message.text,
      nonce: message.nonce,
      sig: message.sig,
    }));
  return {
    implementation: implementation || "UfukNode/technocore-did-tool",
    revision: revision || "unversioned-local-export",
    did,
    mailbox,
    requireComplete: false,
    records,
  };
}

module.exports = { buildConformanceEvidence };
