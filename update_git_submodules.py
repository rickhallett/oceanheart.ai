#!/usr/bin/env python3
import os
import subprocess

env = os.environ.copy()

# Force SSH to use key-based auth without prompting
env["GIT_SSH_COMMAND"] = (
    "ssh -o BatchMode=yes -o PreferredAuthentications=publickey "
    "-o IdentitiesOnly=yes -o StrictHostKeyChecking=no"
)
# Prevent interactive password prompts
env["SSH_ASKPASS"] = "/bin/true"
env["GIT_TERMINAL_PROMPT"] = "0"
# Remove DISPLAY to avoid any GUI prompt fallback
env.pop("DISPLAY", None)


def is_git_repo(path):
    git_indicator = os.path.join(path, ".git")
    return os.path.isdir(git_indicator) or os.path.isfile(git_indicator)


def update_repo(repo_path):
    branch = (
        subprocess.check_output(
            ["git", "-C", repo_path, "rev-parse", "--abbrev-ref", "HEAD"],
            stderr=subprocess.DEVNULL,
            env=env,
        )
        .strip()
        .decode()
    )
    print(f"Updating {repo_path} on branch {branch}...")
    subprocess.run(["git", "-C", repo_path, "fetch"], check=True, env=env)
    subprocess.run(
        ["git", "-C", repo_path, "pull", "origin", branch], check=True, env=env
    )


def main():
    root = os.getcwd()
    updated = False
    for current, dirs, _ in os.walk(root):
        if current == root:
            continue  # skip the main repo
        if is_git_repo(current):
            try:
                update_repo(current)
                updated = True
            except subprocess.CalledProcessError:
                print(f"Error updating repository at {current}")
            dirs.clear()  # do not descend further into this git repo

    if updated:
        subprocess.run(["git", "add", "."], check=True, env=env)
        subprocess.run(
            ["git", "commit", "-m", "Update submodule changes"], check=True, env=env
        )
        print("Submodule changes committed in the main repository.")
    else:
        print("No git submodules found to update.")


if __name__ == "__main__":
    main()
