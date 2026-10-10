"""Assemble src/ into index.html, the single file published as the artifact.
Edit the files in src/, run `python3 build.py`, then publish index.html."""
import pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
style = (src / '00-style.html').read_text(encoding='utf8')
js = '\n'.join((src / f).read_text(encoding='utf8') for f in ['10-data.js', '20-engine.js', '30-services.js', '40-ui.js'])
html = style + '\n<div id="app"></div>\n<script>\n(() => {\n\'use strict\';\n' + js + '\n})();\n</script>\n'
(root / 'index.html').write_text(html, encoding='utf8')
print('index.html', len(html.encode('utf8')), 'bytes')
