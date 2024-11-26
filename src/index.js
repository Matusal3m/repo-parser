import fs from "fs/promises";
import {
  collectFiles, parseArguments,
} from "./fileCollector.js";

(async () => {
  const { srcPath, extensions, ignore } = parseArguments();

  console.log("\n--- Coletando arquivos ---");
  console.log("Ignorados:", ignore);
  console.log("Diretório:", srcPath);
  console.log("Extensões:", extensions);

  const fileContent = await collectFiles(srcPath, extensions, ignore);
  const fileName = "parsed-project.txt"
  await fs.writeFile(fileName, fileContent);

  console.log(`\n--- Arquivos coletados e salvos em: ${process.cwd()}/${fileName} ---`);
})();
