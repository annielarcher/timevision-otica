import re

with open(r'c:\Users\carol\Desktop\oticastimevision\src\app\admin\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

keywords = ['role', 'cargo', 'permissao', 'gerente', 'super', 'admin', 'equipe']

for i, line in enumerate(lines, 1):
    for kw in keywords:
        if re.search(r'\b' + kw + r'\b', line, re.IGNORECASE):
            print(f"Line {i} ({kw}): {line.strip()}")
            break
