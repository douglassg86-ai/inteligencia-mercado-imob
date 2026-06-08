import re

contacts = {
    "contatos-gestores/Charles.png": "https://wa.me/5551992427285",
    "contatos-gestores/jardim.png": "https://wa.me/5551999630731",
    "contatos-gestores/Nishi.png": "https://wa.me/5551991214230",
    "contatos-gestores/raffael.png": "https://wa.me/5551993777440",
    "contatos-gestores/renato.png": "https://wa.me/5551997196469"
}

def update_links(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_url, new_url in contacts.items():
        content = content.replace(f'href="{old_url}"', f'href="{new_url}"')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_links('public/janela23/index.html')
update_links('public/janela23/dacas/index.html')
