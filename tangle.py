import json
import os
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

ignore_list = [".git", "node_modules", "bun.lockb", "bun.lockb", ".next", "package.json", "BACKEND.md", "TASK.md"]
template_override = {
    "lib/BackendContext.tsx",
}

def tangle(template_dir: Path, task_dir: Path, output_dir: Path) -> None:
    task_project_dir = task_dir / "project"

    tangle_ignore = ignore_list
    if template_dir == Path("templates/convex"):
        tangle_ignore.append(".env.local")

    os.makedirs(output_dir, exist_ok=True)
    shutil.copytree(
        template_dir,
        output_dir,
        ignore=lambda dir, contents: tangle_ignore,
        dirs_exist_ok=True,
    )

    # Overlay the task directory on top of the project directory,
    # skipping files that already exist.
    def copy_function(src, dst):
        relative_path = str(Path(src).relative_to(task_project_dir))
        if relative_path in template_override:
            return
        if os.path.exists(dst):
            if os.stat(src).st_size == os.stat(dst).st_size and open(src).read() == open(dst).read():
                return
            print(f"Overwriting: {src} -> {dst}")
        shutil.copy2(src, dst)

    shutil.copytree(
        task_project_dir,
        output_dir,
        ignore=lambda dir, contents: tangle_ignore,
        copy_function=copy_function,
        dirs_exist_ok=True,
    )

    task_package_json = json.load(open(task_project_dir / "package.json"))
    template_package_json = json.load(open(template_dir / "package.json"))

    # Prefer the task project's package.json over the template's.
    merged_package_json = {**template_package_json, **task_package_json}

    # Merge the dependencies and devDependencies fields.
    merged_package_json["dependencies"] = {**template_package_json["dependencies"], **task_package_json["dependencies"]}
    merged_package_json["devDependencies"] = {**template_package_json["devDependencies"], **task_package_json["devDependencies"]}

    with open(output_dir / "package.json", "w") as f:
        json.dump(merged_package_json, f)

    # Merge the task description.
    task_description = open(task_dir / "TASK.md").read()
    backend_description = open(template_dir / "BACKEND.md").read()
    output_description = f"{task_description}\n\n{backend_description}"
    with open(output_dir / "TASK.md", "w") as f:
        f.write(output_description)

    # Install dependencies.
    subprocess.run(["bun", "install"], cwd=output_dir)

    # Run setup script.
    subprocess.run(["python", "setup.py"], cwd=output_dir)

    # Open up cursor.
    subprocess.run(["cursor", output_dir])

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: tangle.py <template_dir> <task_dir>")
        sys.exit(1)

    template_name = sys.argv[1].split("/")[-1]
    assert template_name in ["supabase", "convex"]
    task_name = sys.argv[2].split("/")[-1].split('-')[-1]
    assert task_name in ["chat_app", "todo_app", "files_app"]

    date = datetime.now().strftime("%Y-%m-%d")
    output_dir = Path(f"results/{date}/{task_name}/{template_name}")
    output_dir.mkdir(parents=True, exist_ok=False)
    print(f"Tangling {template_name} and {task_name} into {output_dir}")

    tangle(Path(sys.argv[1]), Path(sys.argv[2]), output_dir)
