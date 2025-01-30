import json
import os
import shutil
from pathlib import Path

ignore_list = [".git", "node_modules", "bun.lockb", "bun.lockb", ".next", "package.json"]
template_override = {
    "app/layout.tsx",
    "components/WithUserEmail.tsx",
}

def tangle(template_dir: Path, task_project_dir: Path, output_dir: Path) -> None:
    os.makedirs(output_dir, exist_ok=True)
    shutil.copytree(
        template_dir,
        output_dir,
        ignore=lambda dir, contents: ignore_list,
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
        ignore=lambda dir, contents: ignore_list,
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

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage: tangle.py <template_dir> <task_project_dir> <output_dir>")
        sys.exit(1)
    tangle(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))
