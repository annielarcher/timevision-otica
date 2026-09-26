import re

with open(r'c:\Users\carol\Desktop\oticastimevision\src\app\admin\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

keywords = ['role', 'cargo', 'permissao', 'gerente', 'super', 'admin', 'equipe']

for i, line in enumerate(lines, 1):
    line_lower = line.lower()
    for kw in keywords:
        if kw in line_lower:
            print(f"Line {i} ({kw}): {line.strip()}")
            break
