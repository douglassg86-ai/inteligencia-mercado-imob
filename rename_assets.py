import os
import shutil

old_dir = 'public/janela23/contatos gestores'
new_dir = 'public/janela23/contatos-gestores'

if os.path.exists(old_dir):
    os.rename(old_dir, new_dir)

for filename in os.listdir(new_dir):
    if " " in filename:
        new_filename = filename.replace(" ", "-")
        os.rename(os.path.join(new_dir, filename), os.path.join(new_dir, new_filename))

def update_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the folder name
    content = content.replace('contatos gestores', 'contatos-gestores')
    # Replace the file names
    content = content.replace('Charles foto.png', 'Charles-foto.png')
    content = content.replace('Jardim foto.png', 'Jardim-foto.png')
    content = content.replace('Nishi foto.png', 'Nishi-foto.png')
    content = content.replace('Raffael foto.png', 'Raffael-foto.png')
    content = content.replace('Renato foto.png', 'Renato-foto.png')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_html('public/janela23/index.html')
update_html('public/janela23/dacas/index.html')

