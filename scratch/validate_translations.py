import json

with open('src/messages/en.json') as f:
    en = json.load(f)
with open('src/messages/es.json') as f:
    es = json.load(f)
with open('src/messages/pt.json') as f:
    pt = json.load(f)

en_units = en['units']
es_units = es['units']
pt_units = pt['units']

print('='*60)
print('VALIDATION REPORT')
print('='*60)

all_ok = True
tactical_fields = ['tacticalRole', 'strengths', 'weaknesses', 'goodAgainst', 'vulnerableAgainst', 'usageTip', 'gamePhase']

for uid in sorted(en_units.keys()):
    en_u = en_units[uid]
    es_u = es_units.get(uid, {})
    pt_u = pt_units.get(uid, {})
    
    issues = []
    
    # Check tactical fields
    for field in tactical_fields:
        if field not in en_u:
            issues.append(f'EN missing {field}')
        if field not in es_u:
            issues.append(f'ES missing {field}')
        if field not in pt_u:
            issues.append(f'PT missing {field}')
    
    # Check upgrades match
    en_upgrades = set(en_u.get('upgrades', {}).keys())
    es_upgrades = set(es_u.get('upgrades', {}).keys())
    pt_upgrades = set(pt_u.get('upgrades', {}).keys())
    
    if en_upgrades != es_upgrades:
        issues.append(f'Upgrade mismatch EN/ES: EN={sorted(en_upgrades)}, ES={sorted(es_upgrades)}')
    if en_upgrades != pt_upgrades:
        issues.append(f'Upgrade mismatch EN/PT: EN={sorted(en_upgrades)}, PT={sorted(pt_upgrades)}')
    
    # Check abilities match
    en_abilities = set(en_u.get('abilities', {}).keys())
    es_abilities = set(es_u.get('abilities', {}).keys())
    pt_abilities = set(pt_u.get('abilities', {}).keys())
    
    if en_abilities != es_abilities:
        issues.append(f'Ability mismatch EN/ES: EN={sorted(en_abilities)}, ES={sorted(es_abilities)}')
    if en_abilities != pt_abilities:
        issues.append(f'Ability mismatch EN/PT: EN={sorted(en_abilities)}, PT={sorted(pt_abilities)}')
    
    if issues:
        all_ok = False
        print(f'\n{uid}:')
        for issue in issues:
            print(f'  WARNING: {issue}')

if all_ok:
    print('\nALL UNITS PASS VALIDATION - all 3 languages are consistent!')
else:
    print('\nSome issues remain - see above')

print()
print(f'EN: {len(en_units)} units, {sum(1 for u in en_units.values() if "strengths" in u)}/53 with tactical data')
print(f'ES: {len(es_units)} units, {sum(1 for u in es_units.values() if "strengths" in u)}/53 with tactical data')
print(f'PT: {len(pt_units)} units, {sum(1 for u in pt_units.values() if "strengths" in u)}/53 with tactical data')

# Check high-templar specifically
print('\nHigh Templar check:')
ht_en = en_units.get('high-templar', {})
print(f'  EN abilities: {list(ht_en.get("abilities", {}).keys())}')
print(f'  EN upgrades: {list(ht_en.get("upgrades", {}).keys())}')

# Check lurker upgrades
print('\nLurker check:')
lk_en = en_units.get('lurker', {})
print(f'  EN upgrades: {list(lk_en.get("upgrades", {}).keys())}')
lk_es = es_units.get('lurker', {})
print(f'  ES upgrades: {list(lk_es.get("upgrades", {}).keys())}')
lk_pt = pt_units.get('lurker', {})
print(f'  PT upgrades: {list(lk_pt.get("upgrades", {}).keys())}')
