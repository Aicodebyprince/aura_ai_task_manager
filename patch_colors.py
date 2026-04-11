import os
import glob
import re

components_dir = r"c:\Aura AI\src\components"

replacements = [
    (r'className="text-white"', r'className="text-foreground dark:text-white"'),
    (r'className="h-6 w-6 text-white drop-shadow-md"', r'className="h-6 w-6 text-foreground dark:text-white drop-shadow-md"'),
    (r'className="h-5 w-5 text-white"', r'className="h-5 w-5 text-foreground dark:text-white"'),
    (r'className="h-6 w-6 text-white"', r'className="h-6 w-6 text-foreground dark:text-white"'),
    (r'className="w-5 h-5 text-white"', r'className="w-5 h-5 text-foreground dark:text-white"'),
    (r'text-white drop-shadow-md', r'text-foreground dark:text-white drop-shadow-md'),
    (r'className="w-4 h-4 text-white"', r'className="w-4 h-4 text-foreground dark:text-white"'),
    (r'className="w-6 h-6 text-white"', r'className="w-6 h-6 text-foreground dark:text-white"'),
    # Priority badges
    (r"text-red-300", r"text-red-600 dark:text-red-300"),
    (r"text-yellow-300", r"text-yellow-700 dark:text-yellow-300"),
    (r"text-green-300", r"text-green-700 dark:text-green-300"),
    (r"bg-red-500/20", r"bg-red-500/10 dark:bg-red-500/20"),
    (r"bg-yellow-500/20", r"bg-yellow-500/10 dark:bg-yellow-500/20"),
    (r"bg-green-500/20", r"bg-green-500/10 dark:bg-green-500/20"),
    # Fix Muted text on light mode
    (r"text-muted-foreground/50", r"text-muted-foreground/80 dark:text-muted-foreground/50"),
    # Dashboard specific texts that were hard to read
    (r'text-\[10px\] font-bold text-white', r'text-[10px] font-bold text-foreground dark:text-white'),
]

for file_path in glob.glob(os.path.join(components_dir, "*.tsx")):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    for pattern, repl in replacements:
        # Don't replace if it's inside a gradient background line (we only replace specific text-white instances)
        # Actually it's safer to just run the replacements directly since we made them specific (like w-5 h-5 text-white)
        content = re.sub(pattern, repl, content)

    if content != original_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {os.path.basename(file_path)}")

# Update globals.css to ensure text-muted-foreground is readable in light mode
globals_path = r"c:\Aura AI\src\app\globals.css"
with open(globals_path, "r", encoding="utf-8") as f:
    globals_css = f.read()

# Change --muted-foreground for light mode from 45.1% to 35%
globals_css = globals_css.replace("--muted-foreground: 0 0% 45.1%;", "--muted-foreground: 0 0% 35%;")
with open(globals_path, "w", encoding="utf-8") as f:
    f.write(globals_css)
print("Updated globals.css")
