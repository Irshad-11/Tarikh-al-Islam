import os

def gen_folder_tree(output_file, excluded_folders):
    base_path = os.path.dirname(os.path.realpath(__file__))
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"Project Structure for: {base_path}\n")
        f.write("=" * 50 + "\n\n")
        
        for root, dirs, files in os.walk(base_path):
            dirs[:] = [d for d in dirs if d not in excluded_folders]
            level = root.replace(base_path, '').count(os.sep)
            indent = ' ' * 4 * level

            folder_name = os.path.basename(root)
            if folder_name == '': 
                f.write(f".\n")
            else:
                f.write(f"{indent}├── {folder_name}/\n")
            sub_indent = ' ' * 4 * (level + 1)
            for file in files:
                if file != output_file:
                    f.write(f"{sub_indent}└── {file}\n")

if __name__ == "__main__":
    TARGET_OUTPUT = "folder-structure.txt"
    EXCLUDES = {'.git', '__pycache__', 'venv', '.vscode', 'node_modules', '.vscode'}
    
    print(f"Generating structure in {TARGET_OUTPUT}...")
    gen_folder_tree(TARGET_OUTPUT, EXCLUDES)
    print("Done! Check your folder for the txt file.")