import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const srcDir = resolve(root, "src");
const distDir = resolve(root, "dist");

mkdirSync(distDir, { recursive: true });
cpSync(resolve(srcDir, "index.html"), resolve(distDir, "index.html"));
cpSync(resolve(srcDir, "css"), resolve(distDir, "css"), { recursive: true });
cpSync(resolve(srcDir, "favicon.svg"), resolve(distDir, "favicon.svg"));

if (existsSync(resolve(root, ".env"))) {
  cpSync(resolve(root, ".env"), resolve(distDir, ".env"));
}

if (existsSync(resolve(root, ".env.example"))) {
  cpSync(resolve(root, ".env.example"), resolve(distDir, ".env.example"));
}
