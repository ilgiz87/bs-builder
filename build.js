// ============================================================
//  Сборка CSS из SCSS. JavaScript здесь не нужен —
//  просто запускайте:  npm run build   (или npm start для watch)
// ============================================================

const path = require("path");
const fs = require("fs");
const sass = require("sass");

// Какие варианты собираем: имя файла SCSS -> имя файла CSS в dist
const targets = {
  "grid": "bootstrap-grid", // только сетка
  "base": "bootstrap-base", // сетка + цвета + базовое оформление
};

const srcDir = path.join(__dirname, "src", "scss");
const outDir = path.join(__dirname, "dist", "css");

function build() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, outName] of Object.entries(targets)) {
    const result = sass.compile(path.join(srcDir, name + ".scss"), {
      loadPaths: [srcDir, path.join(__dirname, "node_modules")],
      style: "compressed",
      quietDeps: true, logger: { warn() {} },
    });
    fs.writeFileSync(path.join(outDir, outName + ".min.css"), result.css);
    console.log(`✔ ${name}.scss -> dist/css/${outName}.min.css`);
  }
}

if (process.argv.includes("--watch")) {
  console.log("Слежение за файлами... (Ctrl+C — остановить)\n");
  sass.compileString("", {}); // прогрев
  const watcher = sass.watch(
    Object.keys(targets).map((n) => path.join(srcDir, n + ".scss")),
    {
      loadPaths: [srcDir, path.join(__dirname, "node_modules")],
      style: "compressed",
      quietDeps: true, logger: { warn() {} },
    },
    (result) => {
      const name = path.basename(result.loadedUrls[0].pathname, ".scss");
      const outName = targets[name];
      if (!outName || !result.css) return;
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, outName + ".min.css"), result.css);
      console.log(`✔ переобновлён dist/css/${outName}.min.css`);
    }
  );
} else {
  build();
}
