import glob, re

# Files to process with their blog link patterns
patterns_to_remove = [
    # Desktop nav: <a href="blog.html" ...>Blog</a>
    r'\n?\s*<a href="blog\.html"[^>]*>Blog[^<]*</a>',
    r'\n?\s*<a href="blog\.html"[^>]*>Blog\s*&amp;\s*Guides[^<]*</a>',
    # Mobile nav: <a href="blog.html" class="block ...">Blog</a>
    r'\n?\s*<a href="blog\.html" class="block[^"]*"[^>]*>Blog[^<]*</a>',
    # Footer: <li><a href="blog.html" ...>Blog...</a></li>
    r'\n?\s*<li><a href="blog\.html"[^>]*>Blog[^<]*</a></li>',
    r'\n?\s*<li><a href="blog\.html"[^>]*>Journal[^<]*</a></li>',
    # Legal pages: <a href="../blog.html" ...>Blog</a>
    r'\n?\s*<a href="\.\.\/blog\.html"[^>]*>Blog[^<]*</a>',
    r'\n?\s*<a href="\.\.\/blog\.html" class="block[^"]*"[^>]*>Blog[^<]*</a>',
]

files = sorted(glob.glob('*.html')) + sorted(glob.glob('*/*.html'))

for f in files:
    if f in ['blog.html', 'blog-details.html']:
        continue  # skip blog pages themselves
    
    with open(f, encoding='utf-8') as fh:
        original = fh.read()
    
    content = original
    for pat in patterns_to_remove:
        content = re.sub(pat, '', content, flags=re.IGNORECASE)
    
    if content != original:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f"Updated: {f}")
    else:
        print(f"No change: {f}")
