import glob, re

files = sorted(glob.glob('*.html')) + sorted(glob.glob('*/*.html'))
found = []
for f in files:
    if f in ['blog.html', 'blog-details.html']:
        continue
    with open(f, encoding='utf-8') as fh:
        c = fh.read()
    hits = re.findall(r'href=["\'](?:\.\./)?blog\.html["\']', c, re.IGNORECASE)
    if hits:
        found.append(f + ': ' + repr(hits[:2]))

if found:
    print("BLOG LINKS STILL FOUND:")
    for x in found:
        print("  " + x)
else:
    print("CLEAN - no blog nav links remain in any non-blog page")
