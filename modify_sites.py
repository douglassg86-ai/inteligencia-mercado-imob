import re

def process_file(filepath, is_dacas=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove ticker
    content = re.sub(r'<!-- ═══ TICKER ══════════════════════════════════════════════ -->.*?</div>\n</div>', '', content, flags=re.DOTALL)
    
    # New hero
    hero_pattern = r'<section id="hero">.*?</section>'
    
    if is_dacas:
        contacts_html = """
         <a href="contatos gestores/raffael.png" target="_blank" style="text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
           <img src="contatos gestores/Raffael foto.png" alt="Raffael" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--copper); box-shadow: 0 4px 12px rgba(201,144,109,0.3);">
           <div style="background: var(--cg); color: #fff; padding: 10px 20px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Raffael
           </div>
         </a>"""
    else:
        contacts_html = """
         <a href="contatos gestores/Charles.png" target="_blank" style="text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
           <img src="contatos gestores/Charles foto.png" alt="Charles" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--copper); box-shadow: 0 4px 12px rgba(201,144,109,0.3);">
           <div style="background: var(--cg); color: #fff; padding: 10px 20px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Charles
           </div>
         </a>
         
         <a href="contatos gestores/jardim.png" target="_blank" style="text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
           <img src="contatos gestores/Jardim foto.png" alt="Jardim" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--copper); box-shadow: 0 4px 12px rgba(201,144,109,0.3);">
           <div style="background: var(--cg); color: #fff; padding: 10px 20px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Jardim
           </div>
         </a>

         <a href="contatos gestores/Nishi.png" target="_blank" style="text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
           <img src="contatos gestores/Nishi foto.png" alt="Nishi" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--copper); box-shadow: 0 4px 12px rgba(201,144,109,0.3);">
           <div style="background: var(--cg); color: #fff; padding: 10px 20px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Nishi
           </div>
         </a>

         <a href="contatos gestores/raffael.png" target="_blank" style="text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
           <img src="contatos gestores/Raffael foto.png" alt="Raffael" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--copper); box-shadow: 0 4px 12px rgba(201,144,109,0.3);">
           <div style="background: var(--cg); color: #fff; padding: 10px 20px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Raffael
           </div>
         </a>

         <a href="contatos gestores/renato.png" target="_blank" style="text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 16px; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
           <img src="contatos gestores/Renato foto.png" alt="Renato" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid var(--copper); box-shadow: 0 4px 12px rgba(201,144,109,0.3);">
           <div style="background: var(--cg); color: #fff; padding: 10px 20px; border-radius: 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: 8px;">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Renato
           </div>
         </a>"""

    new_hero = f"""<section id="hero">
  <div class="hero-bg"></div>
  <div class="hero-glow"></div>

  <div class="hero-content">
    <p class="hero-eyebrow">Janela 23</p>

    <img
      src="assets/logo-campanha.png"
      alt="Janela 23 — Plaenge | Vanguard"
      class="hero-logo"
    >

    <h1 class="hero-tagline">
      A Janela <span class="copper-text">Fechou.</span>
    </h1>

    <p class="hero-sub">Muitos aproveitaram esta janela de oportunidade única.<br>Mas ainda existem grandes oportunidades esperando por você.</p>

    <div style="margin-top: 40px; animation: fadeUp .9s ease-out .8s both; width: 100%; max-width: 900px; margin-left: auto; margin-right: auto;">
       <p style="font-family:'Montserrat',sans-serif; font-size: 14px; font-weight: 700; color: var(--copper); margin-bottom: 32px; text-transform: uppercase; letter-spacing: .1em;">Fale com o seu GPI Plaenge | Vanguard:</p>
       
       <div style="display: flex; flex-wrap: wrap; gap: 32px; justify-content: center;">
{contacts_html}
       </div>
    </div>
  </div>
</section>"""
    
    content = re.sub(hero_pattern, new_hero, content, flags=re.DOTALL)
    
    # Remove everything between the end of hero section and scripts (like products, intro, etc.)
    # The first element after hero is `<div class="copper-bar-thick"></div>`
    # We will remove everything until `<!-- ═══ SCRIPTS ═══════════════════════════════════════════════ -->`
    # EXCEPT, wait, we might have removed the modal videos. Let's keep the modal videos if needed or remove them.
    # The modal videos are obsolete if we remove products. So we can remove until SCRIPTS.
    content = re.sub(r'<div class="copper-bar-thick"></div>.*?<!-- ═══ SCRIPTS', '<!-- ═══ SCRIPTS', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('/Users/douglas/Desktop/inteligencia-mercado-imob/public/janela23/index.html', is_dacas=False)
process_file('/Users/douglas/Desktop/inteligencia-mercado-imob/public/janela23/dacas/index.html', is_dacas=True)
