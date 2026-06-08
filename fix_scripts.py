import re

new_scripts = """<!-- ═══ SCRIPTS ═══════════════════════════════════════════════ -->
<script>
  /* ── SCROLL REVEAL ──────────────────────────────── */
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
    { threshold: 0.08 }
  );
  document.querySelectorAll('.r').forEach(el => observer.observe(el));
</script>

</body>
</html>
"""

def fix_scripts(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'<!-- ═══ SCRIPTS ═══════════════════════════════════════════════ -->.*', new_scripts, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_scripts('/Users/douglas/Desktop/inteligencia-mercado-imob/public/janela23/index.html')
fix_scripts('/Users/douglas/Desktop/inteligencia-mercado-imob/public/janela23/dacas/index.html')
