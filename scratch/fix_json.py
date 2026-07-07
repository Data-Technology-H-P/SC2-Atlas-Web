import json

for lang in ['en', 'es', 'pt']:
    filepath = f'src/messages/{lang}.json'
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Remove the literal backslash-n at the end (written as \\n in the file)
    if content.endswith(b'\\n'):
        content = content[:-2]
        print(f'{lang}.json: removed trailing literal backslash-n')
    
    with open(filepath, 'wb') as f:
        f.write(content)
        f.write(b'\n')
    
    # Verify
    try:
        with open(filepath) as f:
            data = json.load(f)
        print(f'{lang}.json: VALID - {len(data["units"])} units')
    except Exception as e:
        print(f'{lang}.json: ERROR - {e}')
