// ============================================================
//  Сборка CSS из SCSS. JavaScript здесь не нужен —
//  просто запускайте:  npm run build   (или npm start для watch)
// ============================================================

const path = require("path");
const fs = require("fs");
const sass = require("sass");

// Какие варианты собираем: имя файла SCSS -> имя файла CSS в dist
const targets = {
  "grid":    "bootstrap-grid",    // только сетка
  "base":    "bootstrap-base",    // сетка + цвета + базовое оформление
  "minimal": "bootstrap-minimal", // сетка + цвета + минимум утилит
};

// Для каких вариантов вырезать лишние правила из готового CSS.
// Список селекторов, которые НЕ нужны в этом варианте:
const cuts = {
  base: [
    // типографика (Bootstrap не позволяет отключить её переменными)
    /^h[1-6](,[^{}]*)?\{/,        // h1..h6 из reboot и _type.scss
    /\.display-[1-6][,~.\[]?/,    // .display-1 ... .display-6
    /\.lead[,~.\[{]/,             // .lead
    /^legend\{/,                  // legend из reboot/_type
    /^caption\{/,                 // caption из reboot
    // отдельные компоненты
    /\.badge[,~.\[{]/,            // бейджи
    /\.alert[,~.\[{]/,            // алерты
  ],
};

const srcDir = path.join(__dirname, "src", "scss");
const outDir = path.join(__dirname, "dist", "css");

// Простая «вырезалка» правил из сжаттого CSS: идём по строкам,
// если селектор строки совпадает с одним из шаблонов — выбрасываем
// всё правило до закрывающей скобки "}".
function cutRules(css, patterns) {
  if (!patterns) return css;
  const lines = css.split("\n");
  const out = [];
  let skipping = false;
  for (const line of lines) {
    if (skipping) {
      if (line.trim() === "}") skipping = false;
      continue;
    }
    if (patterns.some((re) => re.test(line))) {
      if (!/\}\s*$/.test(line.trim())) skipping = true; // блок на неск. строках
      continue;                                          // строка-правило в одну строку
    }
    out.push(line);
  }
  return out.join("\n");
}

function buildOne(name, outName) {
  const result = sass.compile(path.join(srcDir, name + ".scss"), {
    loadPaths: [srcDir, path.join(__dirname, "node_modules")],
    style: "expanded", // по одному правилу на строку — так проще вырезать лишнее
    quietDeps: true, logger: { warn() {} },
  });
  const css = cutRules(result.css, cuts[name]).trim() + "\n";
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, outName + ".min.css"), css);
  const kb = Math.round(Buffer.byteLength(css) / 1024);
  console.log(`✔ ${name}.scss -> dist/css/${outName}.min.css (${kb} КБ)`);
}

function build() {
  for (const [name, outName] of Object.entries(targets)) buildOne(name, outName);
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
