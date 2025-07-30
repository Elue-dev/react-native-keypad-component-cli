#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const readline = require("readline");

const log = console.log;
const spinner = ora();

function copySourceCodeRecursively(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copySourceCodeRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function runCLI() {
  log(chalk.bold.blueBright("\n🧮 React Native Keypad Component CLI\n"));
  log(chalk.gray("This will add the Keypad component into your project...\n"));

  const input = await askQuestion(
    chalk.cyanBright(
      "Where do you want to add the source code? (default: components/Keypad): "
    )
  );
  const relativePath = input || "components/Keypad";

  const projectRoot = process.cwd();
  const targetDir = path.join(projectRoot, relativePath);
  const templateDir = path.join(__dirname, "..", "template", "Keypad");

  spinner.start(`Creating folder: ${relativePath}`);
  fs.mkdirSync(targetDir, { recursive: true });
  spinner.succeed(chalk.green(`Created folder: ${relativePath}`));

  spinner.start("Copying Keypad component files...");
  copySourceCodeRecursively(templateDir, targetDir);
  spinner.succeed(chalk.green("Keypad files copied successfully"));

  log(chalk.bold.green("\n✅ Keypad component added!"));
  log(chalk.gray("You can now import it using:\n"));
  log(chalk.cyan(`import Keypad from './${relativePath}';\n`));
}

runCLI();
