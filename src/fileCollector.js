import errors from "./constants/error.js";
import fs from "fs/promises";

async function collectFiles(directory, extensions, ignoreList) {
  let filesContent = "";

  const files = await fs.readdir(directory);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const canReadFile = extensions.length !== 0 ? extensions.some(extension => file.endsWith(extension)) : true;

    if (ignoreList) {
      if (ignoreList.includes(file)) continue;
    }

    const fullPath = directory + "/" + file;
    const stat = await fs.stat(fullPath)

    if (stat.isDirectory()) {
      filesContent += await collectFiles(fullPath, extensions);
    } else if (canReadFile) {
      const content = await fs.readFile(fullPath, 'utf-8');
      filesContent += `\n==== ${file} ====\n${content}\n`;
    }
  }

  return filesContent
}

function showHelpMessage() {
  console.log(`
Exemplo de uso: node script.js --dir=<path> --extensions=.js,.md --ignore=node_modules

Onde:

--dir=<path>      O caminho para o diretório que contém os arquivos. (obrigatório)

--extensions=<extensões>      Lista das extensões dos arquivos que serão lidos.
  Se nenhuma extensão for especificada, todos os arquivos serão coletados.      

--ignore=<extensões> - Uma lista de nomes para serem ignorados.
  Default: node_modules

  O resultado será salvo no mesmo diretório de execução do script.
`);
  process.exit(0);
}

function parseArguments() {
  const args = process.argv.slice(2);
  let srcPath = null;
  let extensions = [];
  let ignore = []

  if (args[0] == "--" || args[0] == "-h" || args[0] == "--help") {
    showHelpMessage(args);
  }

  args.forEach(arg => {
    if (arg.startsWith("--dir=")) {
      srcPath = arg.replace("--dir=", "");
    } else if (arg.startsWith("--extensions=")) {
      extensions = arg.replace("--extensions=", "").split(',').map(ext => ext.trim());
    } else if (arg.startsWith("--ignore=")) {
      ignore = arg.replace("--ignore=", "").split(',').map(ext => ext.trim());
    }
  });

  if (!srcPath) {
    console.error("Erro: O argumento --dir=<path> é obrigatório.");
    console.log("Uso: node script.js --dir=<path> --extensions=.js,.md");
    throw errors.DIR_ARGUMENT_ERROR;
  }

  if (extensions.length === 0) {
    console.log("---! Aviso: Nenhuma extensão especificada. Coletando todos os arquivos !---");
  }

  if (ignore.length === 0) {
    ignore = ["node_modules"];
  }

  return { srcPath, extensions, ignore };
}

export {
  collectFiles,
  parseArguments,
  showHelpMessage
}