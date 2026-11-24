import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

source_path, font_path, destination_path = map(Path, sys.argv[1:4])
suffixes = {'.html', '.js'}
text = ''.join(path.read_text(encoding='utf-8') for path in source_path.iterdir() if path.suffix in suffixes)
text += ''.join(chr(point) for point in range(0x20, 0x7f))

options = subset.Options()
options.name_IDs = ['*']
font = TTFont(font_path)
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
font.flavor = 'woff2'
font.save(destination_path)

verified = TTFont(destination_path)
assert all(ord(char) in verified.getBestCmap() for char in '第一股添加到主屏幕周一中午食堂排队'), 'missing display glyphs'
print(f'{len(verified.getBestCmap())} characters, {destination_path.stat().st_size} bytes')
