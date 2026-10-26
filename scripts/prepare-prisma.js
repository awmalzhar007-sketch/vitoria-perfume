const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
let content = fs.readFileSync(schemaPath, "utf-8");

// Load .env if exists
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const targetProvider = (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://"))
  ? "postgresql"
  : "sqlite";

const currentProviderMatch = content.match(/provider\s*=\s*"(sqlite|postgresql)"/);
const currentProvider = currentProviderMatch ? currentProviderMatch[1] : null;

if (currentProvider !== targetProvider) {
  content = content.replace(
    /provider\s*=\s*"(sqlite|postgresql)"/,
    `provider = "${targetProvider}"`
  );
  fs.writeFileSync(schemaPath, content, "utf-8");
  console.log(`[prisma-adapter] Switched schema datasource provider to: ${targetProvider}`);
} else {
  console.log(`[prisma-adapter] Datasource provider is already: ${targetProvider}`);
}
