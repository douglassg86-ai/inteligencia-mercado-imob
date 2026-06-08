import re

footer_html = """
<div class="copper-bar-thick"></div>

<!-- ═══ FOOTER ════════════════════════════════════════════════ -->
<footer>
  <img
    src="assets/logos-incorporadoras.png"
    alt="Plaenge | Vanguard"
    class="footer-logo"
  >
  <p class="footer-text">JANELA 23 &nbsp;·&nbsp; PLAENGE | VANGUARD</p>
</footer>

"""

def add_footer(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "<!-- ═══ FOOTER ════════════════════════════════════════════════ -->" not in content:
        content = content.replace("<!-- ═══ SCRIPTS ═══════════════════════════════════════════════ -->", footer_html + "<!-- ═══ SCRIPTS ═══════════════════════════════════════════════ -->")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

add_footer('/Users/douglas/Desktop/inteligencia-mercado-imob/public/janela23/index.html')
add_footer('/Users/douglas/Desktop/inteligencia-mercado-imob/public/janela23/dacas/index.html')
