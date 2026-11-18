#!/usr/bin/env node
// Prints a bcrypt hash to use as ADMIN_PASSWORD.
//   node scripts/hash-password.mjs "your-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}
const hash = await bcrypt.hash(password, 12);
console.log(hash);
console.error(
  "\nPaste this as ADMIN_PASSWORD." +
    "\n  Vercel: paste it as-is." +
    "\n  .env.local: put a backslash before every $ so Next.js does not expand it:" +
    `\n    ADMIN_PASSWORD=${hash.replace(/\$/g, "\\$")}`,
);
