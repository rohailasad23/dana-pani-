// Builds a self-contained static copy of the site in /out with relative asset paths,
// so it can be opened from any folder or static host (used for shareable previews).
// Usage: npm run preview:static
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_PREVIEW: "1" } });

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const file of walk("out")) {
  if (!/\.(html|txt|css|js)$/.test(file)) continue;
  let s = readFileSync(file, "utf8");
  if (!s.includes("/__ap")) continue;
  if (file.endsWith(".css")) s = s.replaceAll("/__ap/_next/static/media/", "../media/");
  s = s.replaceAll('\\"p\\":\\"/__ap\\"', '\\"p\\":\\".\\"').replaceAll('"p":"/__ap"', '"p":"."').replaceAll("/__ap/", "./");
  writeFileSync(file, s);
}
for (const f of ["out/index.html"]) writeFileSync(f, readFileSync(f, "utf8").replaceAll('href="/icon.svg', 'href="./icon.svg'));
console.log("Static preview ready in /out");
