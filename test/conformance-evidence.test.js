"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { buildConformanceEvidence } = require("../lib/conformance-evidence");

test("filters other DIDs and preserves signed transport fields", () => {
  const did = "did:key:z6Mks3GkYHmXSXjS639r9399owtxCMpzFexrq6EAziYZnjPk";
  const evidence = buildConformanceEvidence({
    did,
    mailbox: "mb-example",
    generation: 3,
    implementation: "UfukNode/technocore-did-tool",
    revision: "abc123",
    messages: [
      { seq: 7, ts: "2026-09-13T00:00:00Z", from: did, text: "hello", nonce: "123", sig: "signed" },
      { seq: 8, ts: "2026-09-13T00:00:01Z", from: "did:key:z6Mkother", text: "other", nonce: "124", sig: "other" },
    ],
  });
  assert.equal(evidence.requireComplete, false);
  assert.equal(evidence.records.length, 1);
  assert.deepEqual(evidence.records[0], {
    room: "mb-example", generation: 3, seq: 7, ts: "2026-09-13T00:00:00Z",
    from: did, text: "hello", nonce: "123", sig: "signed",
  });
});
