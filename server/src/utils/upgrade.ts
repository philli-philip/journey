import { execSync } from "child_process";

const MAIN_BRANCH = "main"; // Set your main branch name (commonly 'main' or 'master')

function logInfo(message: string) {
  console.log(`INFO: ${message}`);
}

function logError(message: string) {
  console.error(`ERROR: ${message}`);
}

function runCommand(command: string, options = {}) {
  try {
    execSync(command, { stdio: "inherit", ...options });
    return true;
  } catch (error) {
    logError(`Command failed: ${command}`);
    logError(error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

async function updateProject() {
  logInfo("Starting project update...");

  // 1. Ensure we are in the correct directory (optional, but good for robustness)
  // This assumes the script is run from the project root or a known subdirectory.
  // If the script is always placed in the project root, this `cd` might not be strictly necessary.
  // If you want to enforce running from the project root, you could add a check:
  // if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
  //     logError("This script must be run from the project root directory.");
  //     process.exit(1);
  // }

  // 2. Pull the latest changes from GitHub
  logInfo("Fetching latest changes from Git...");
  if (!runCommand(`git pull origin ${MAIN_BRANCH}`)) {
    logError(
      "Git pull failed. This might be due to local changes or network issues."
    );
    logError(
      "Please resolve any conflicts or ensure you have network access, then try again."
    );
    process.exit(1);
  }
  logInfo("Git pull successful.");

  // 3. Install/update npm dependencies
  logInfo("Installing/updating npm dependencies...");
  if (!runCommand("npm install")) {
    logError(
      "npm install failed. Check your network connection or package.json for errors."
    );
    process.exit(1);
  }
  logInfo("npm dependencies updated.");

  // 4. Inform the user about how to start the development server
  logInfo("Project update complete!");
  logInfo("You can now start your development server with: npm run dev");

  process.exit(0);
}

updateProject();
