"""
Fix all translation issues:
1. Add all tactical fields missing from en.json (50/53 units)
2. Fix high-templar: move psi-storm from upgrades to abilities
3. Add lurker upgrades (adaptive-talons, seismic-spines) to en.json, es.json, pt.json
4. Report a full validation summary
"""
import json
import copy

# ==========================================
# TACTICAL DATA FOR ALL UNITS (from units.ts)
# ==========================================
TACTICAL_EN = {
    "scv": {
        "tacticalRole": "Essential worker unit that gathers resources and repairs mechanical units and structures.",
        "strengths": [
            "Can repair mechanical units for free (costs minerals in practice)",
            "Available from the start with zero tech requirement",
            "Can bunker rush or proxy build to disrupt opponents early"
        ],
        "weaknesses": [
            "Extremely fragile and has no real combat ability",
            "Consumed when building structures",
            "Vulnerable if caught outside the base"
        ],
        "goodAgainst": ["Early Drones", "Early Probes"],
        "vulnerableAgainst": ["Any military unit", "Early rushes"],
        "usageTip": "Protect your SCVs at all costs. Use them to repair siege tanks in the field and bunkers during defensive stands.",
        "gamePhase": ["Early", "Mid", "Late"]
    },
    "marauder": {
        "tacticalRole": "Heavy armored infantry that slows targets and deals bonus damage to armored units.",
        "strengths": [
            "Concussive Shells slows all non-massive units on hit",
            "High health pool, far tankier than Marines",
            "Pairs extremely well with Marines in bio compositions"
        ],
        "weaknesses": [
            "Cannot attack air units",
            "Slow without Stimpack",
            "Weak against Banelings and splash AoE"
        ],
        "goodAgainst": ["Roaches", "Stalkers", "Immortals"],
        "vulnerableAgainst": ["Banelings", "Colossi", "Siege Tanks"],
        "usageTip": "Use Marauders as the frontline shield for Marines. Stim them in engagements and pull back damaged ones with Medivac support.",
        "gamePhase": ["Mid", "Late"]
    },
    "reaper": {
        "tacticalRole": "Fast harassment and scouting unit that excels at early map control and cliff traversal.",
        "strengths": [
            "Can jump cliffs and escape most early threats",
            "Excellent for scouting opponent's base in the first few minutes",
            "KD8 Charges create space and deal solid early damage"
        ],
        "weaknesses": [
            "Falls off significantly in mid and late game",
            "Low health; dies quickly to sustained fire",
            "Requires constant micro-management to be effective"
        ],
        "goodAgainst": ["Workers (Drones, Probes, SCVs)", "Zerglings", "Early Queens"],
        "vulnerableAgainst": ["Marines", "Stalkers", "Roaches"],
        "usageTip": "Open with a Reaper to scout and deal early damage. Retreat over cliffs when threatened, and keep them alive to continue scouting mid-game.",
        "gamePhase": ["Early"]
    },
    "ghost": {
        "tacticalRole": "Elite stealth unit that neutralizes enemy spellcasters, spells, and shields with EMP and Snipe.",
        "strengths": [
            "EMP drains Protoss shields and energy in a large radius",
            "Cloak allows repositioning without taking fire",
            "Tactical Nuke forces opponent movement and denies areas"
        ],
        "weaknesses": [
            "Expensive and requires significant tech investment",
            "EMP requires good aim under pressure",
            "Needs constant energy management"
        ],
        "goodAgainst": ["High Templars", "Infestors", "Protoss Armies (EMP)", "Ravagers"],
        "vulnerableAgainst": ["Detectors", "Mass anti-air", "Lings in melee range"],
        "usageTip": "Pre-position Ghosts and use EMP on the Protoss army before engaging. Against Zerg, use Snipe on Infestors before they can cast.",
        "gamePhase": ["Mid", "Late"]
    },
    "hellion": {
        "tacticalRole": "Fast vehicle with a linear flamethrower, devastating against workers and light ground units.",
        "strengths": [
            "Fastest non-flying Terran unit",
            "Flame attack hits multiple units in a line",
            "Extremely effective against light biological units and workers"
        ],
        "weaknesses": [
            "Almost useless against armored units",
            "Fragile — dies quickly to focused fire",
            "Cannot attack air targets"
        ],
        "goodAgainst": ["Zerglings", "Banelings", "Workers", "Hydralisks"],
        "vulnerableAgainst": ["Roaches", "Marauders", "Stalkers"],
        "usageTip": "Use Hellions to raid enemy worker lines or patrol the map for stray units. Transform to Hellbats when the opponent clusters armor.",
        "gamePhase": ["Early", "Mid"]
    },
    "hellbat": {
        "tacticalRole": "Beefy frontline brawler with a cone flamethrower, effective in tight bio-mech compositions.",
        "strengths": [
            "More durable than Hellion form",
            "AoE cone attack hits multiple clustered units",
            "Healed by Medivacs — synergizes with bio-mech drops"
        ],
        "weaknesses": [
            "Very slow movement speed",
            "Weak against armored units and air",
            "Needs to be transformed from Hellion, limiting early flexibility"
        ],
        "goodAgainst": ["Zerglings", "Marines (in bio)", "Light clustered units"],
        "vulnerableAgainst": ["Stalkers", "Roaches", "Ravagers"],
        "usageTip": "Drop Hellbats into enemy worker lines with Medivacs for an efficient trade. In bio-mech, position them at the front to absorb fire.",
        "gamePhase": ["Mid"]
    },
    "siege-tank": {
        "tacticalRole": "Long-range siege weapon that anchors Terran defensive lines and obliterates ground armies at a distance.",
        "strengths": [
            "Devastating area damage in Siege Mode with immense range",
            "Shreds armored units and structures efficiently",
            "Forces opponent to engage from disadvantageous angles"
        ],
        "weaknesses": [
            "Cannot move or attack nearby units in Siege Mode",
            "Vulnerable to air units in all modes",
            "Slow to set up and reposition"
        ],
        "goodAgainst": ["Roaches", "Zealots", "Stalkers", "Zerglings"],
        "vulnerableAgainst": ["Medivac drops behind tank lines", "Liberators", "Brood Lords"],
        "usageTip": "Always siege Tanks behind marine walls or bunkers. Never leave them exposed. Viking support counters enemy air harassment.",
        "gamePhase": ["Mid", "Late"]
    },
    "cyclone": {
        "tacticalRole": "Mobile anti-air and anti-ground skirmisher with a Lock-On ability that fires while kiting.",
        "strengths": [
            "Can fire while moving after locking on",
            "Strong anti-air for early game protection",
            "Very mobile — difficult to catch or pin down"
        ],
        "weaknesses": [
            "Mediocre DPS without upgrades and micromanagement",
            "Lock-On can be broken by moving target out of range",
            "High gas cost limits early production"
        ],
        "goodAgainst": ["Mutalisks", "Phoenixes", "Oracles", "Banshees"],
        "vulnerableAgainst": ["Blink Stalkers", "Immortals", "Ravagers"],
        "usageTip": "Use Cyclones as mobile anti-air in the early game and as fast kiting units. Lock onto high-priority air targets immediately.",
        "gamePhase": ["Early", "Mid"]
    },
    "widow-mine": {
        "tacticalRole": "Stealthy ambush mine that punishes enemy movement with devastating splash damage.",
        "strengths": [
            "Invisible when burrowed and between attacks",
            "Sentinel Missile deals enormous splash that one-shots groups",
            "Deters enemy from advancing without detection"
        ],
        "weaknesses": [
            "Very predictable placement over time",
            "Has a reload cooldown between shots",
            "Countered by detectors and slow advance"
        ],
        "goodAgainst": ["Clustered Marines", "Zerglings", "Phoenixes", "Overlords"],
        "vulnerableAgainst": ["Observers", "Overseers", "Ravagers (with detection)"],
        "usageTip": "Place Widow Mines at watch points and ramps. Always pair with Vikings or Turrets for mutual anti-air protection of the mines themselves.",
        "gamePhase": ["Early", "Mid"]
    },
    "thor": {
        "tacticalRole": "Massive heavy mech with overwhelming firepower against both ground armies and capital ships.",
        "strengths": [
            "Enormous health pool and high base armor",
            "High-impact payload slaughters massive air units",
            "Strong area suppression against clustered ground units"
        ],
        "weaknesses": [
            "Very slow movement speed",
            "Expensive to produce and maintain",
            "Vulnerable to EMP, Abduct, and kiting"
        ],
        "goodAgainst": ["Mutalisks", "Brood Lords", "Carriers", "Ultralisks"],
        "vulnerableAgainst": ["Blink Stalkers", "Infestors (Neural Parasite)", "Vipers"],
        "usageTip": "Deploy Thors as stationary centerpieces of a ground army. Use High-Impact Payload to hard-counter incoming Brood Lords or Carriers.",
        "gamePhase": ["Late"]
    },
    "viking": {
        "tacticalRole": "Transformable fighter that rules the skies and can land to support ground forces at key moments.",
        "strengths": [
            "Top-tier anti-air vs massive units (Brood Lords, Carriers)",
            "Can land to push towers or defend drops",
            "Cost-efficient answer to Protoss air superiority"
        ],
        "weaknesses": [
            "Mediocre DPS in ground mode",
            "Squishy for its cost against massed air",
            "Can be caught transitioning between modes"
        ],
        "goodAgainst": ["Brood Lords", "Carriers", "Tempests", "Corruptors"],
        "vulnerableAgainst": ["Phoenixes", "Void Rays", "Massed Corruptors"],
        "usageTip": "Always have a Viking force to counter enemy capital ships. Land Vikings to snipe isolated Siege Tanks or Lurkers.",
        "gamePhase": ["Mid", "Late"]
    },
    "medivac": {
        "tacticalRole": "Critical support dropship that keeps bio armies alive with healing and repositions them via drops.",
        "strengths": [
            "Automatically heals all nearby biological units",
            "Afterburners enable rapid retreat or aggressive drops",
            "Doubles as both healer and transport in one unit"
        ],
        "weaknesses": [
            "No offensive capability whatsoever",
            "Extremely fragile — dies quickly to focused anti-air",
            "Requires constant protection to be effective"
        ],
        "goodAgainst": ["Supports bio vs. any enemy composition"],
        "vulnerableAgainst": ["Phoenixes", "Hydralisks", "Queens", "Missile Turrets"],
        "usageTip": "Keep Medivacs stacked behind your marines. Never let them lead an attack. Drop bio armies into mineral lines when the opponent engages elsewhere.",
        "gamePhase": ["Mid", "Late"]
    },
    "liberator": {
        "tacticalRole": "Zone-denial support flyer with a powerful ground siege mode and anti-air capabilities.",
        "strengths": [
            "Creates a lethal zone on the ground that melts units entering it",
            "Strong anti-air splash in Fighter Mode",
            "Forces opponent to divert resources to handle it"
        ],
        "weaknesses": [
            "Stationary and unable to reposition quickly in Defender Mode",
            "Targeted zone is predictable",
            "Expensive gas sink compared to alternatives"
        ],
        "goodAgainst": ["Zerglings", "Workers in mineral lines", "Mutalisks"],
        "vulnerableAgainst": ["Vikings", "Corruptors", "Hydralisks", "Stalkers"],
        "usageTip": "Use Liberators to zone enemy expansion mineral lines. Position them over ramps in Defender Mode to deny ground army movement.",
        "gamePhase": ["Mid", "Late"]
    },
    "raven": {
        "tacticalRole": "Primary Terran detector and spellcaster, enabling powerful battlefield disruption.",
        "strengths": [
            "Interference Matrix disables mechanical units for a long duration",
            "Anti-Armor Missile reduces armor of all hit units simultaneously",
            "Provides crucial detection of cloaked and burrowed units"
        ],
        "weaknesses": [
            "Very high gas cost limits production",
            "No direct damage without abilities",
            "Fragile against concentrated anti-air fire"
        ],
        "goodAgainst": ["Lurkers", "Dark Templars", "Banshees", "Disruptors"],
        "vulnerableAgainst": ["Phoenix", "Vikings", "Corruptors"],
        "usageTip": "Use Interference Matrix on the most dangerous enemy mechanical unit before an engagement. Anti-Armor Missile works best against stacked armies.",
        "gamePhase": ["Mid", "Late"]
    },
    "banshee": {
        "tacticalRole": "Ground attack aircraft that specializes in cloaked harassment of workers and undefended units.",
        "strengths": [
            "Cloaking makes it nearly invisible without detection",
            "Extremely effective against undefended expansions",
            "High DPS against ground targets for an air unit"
        ],
        "weaknesses": [
            "Cannot attack air units at all",
            "Slow movement makes it vulnerable if caught",
            "Countered hard by any detection unit"
        ],
        "goodAgainst": ["Workers", "Lurkers (burrowed)", "Siege Tanks", "Queens"],
        "vulnerableAgainst": ["Overseers", "Observers", "Vikings (when detected)", "Turrets"],
        "usageTip": "Send cloaked Banshees to enemy expansions while they are distracted. Cloak them before entry and retreat before detection arrives.",
        "gamePhase": ["Mid"]
    },
    "battlecruiser": {
        "tacticalRole": "Unstoppable capital ship with incredible durability and Tactical Jump for instant repositioning.",
        "strengths": [
            "Massive health pool and armor — takes extremely long to kill",
            "Yamato Cannon one-shots most units and structures",
            "Tactical Jump allows instant retreat or surprise attacks"
        ],
        "weaknesses": [
            "Extremely expensive and slow to build",
            "Countered efficiently by Corruptors with upgrades",
            "Not viable until very late game"
        ],
        "goodAgainst": ["Thors (through attrition)", "Roaches", "Stalkers", "Structures"],
        "vulnerableAgainst": ["Corruptors", "Void Rays (prismatic)", "Vikings (massed)"],
        "usageTip": "Tactical Jump to a vulnerable part of the opponent's base when their army is occupied. Yamato key defensive structures.",
        "gamePhase": ["Late"]
    },
    "drone": {
        "tacticalRole": "Zerg worker that sacrifices itself to build structures — the backbone of the Swarm economy.",
        "strengths": [
            "Unique mechanic: consumed to build structures instantly",
            "Can be mass-produced from multiple Hatcheries simultaneously",
            "Excellent early mineral saturation speed"
        ],
        "weaknesses": [
            "Consumed permanently when morphing into structures",
            "Extremely fragile in combat",
            "Requires constant production discipline to keep balanced"
        ],
        "goodAgainst": ["Early Rushes (with enough Spine Crawlers)"],
        "vulnerableAgainst": ["Any harassment unit", "Reapers", "Hellions"],
        "usageTip": "Always keep drone count at maximum while your larva and minerals allow. Never lose drones to avoidable harassment.",
        "gamePhase": ["Early", "Mid", "Late"]
    },
    "overlord": {
        "tacticalRole": "Flying supply provider and essential backbone for scouting and Zerg army logistics.",
        "strengths": [
            "Provides supply without building structures",
            "Doubles as a scouting unit in early game",
            "Can upgrade into an Overseer for detection"
        ],
        "weaknesses": [
            "Very slow without Pneumatized Carapace",
            "No attack or defense whatsoever",
            "Easy target for enemy anti-air units"
        ],
        "goodAgainst": ["N/A — supports your army"],
        "vulnerableAgainst": ["Phoenixes", "Vikings", "Marines"],
        "usageTip": "Spread Overlords around the map early for vision. Keep them in safe spots later. Morph one to Overseer when detection is needed.",
        "gamePhase": ["Early", "Mid", "Late"]
    },
    "overseer": {
        "tacticalRole": "Detection unit and Changeling espionage tool — essential for countering cloaked strategies.",
        "strengths": [
            "Provides detection vs. cloaked and burrowed units",
            "Changeling can scout enemy base indefinitely if undetected",
            "Contaminate halts enemy production during critical timings"
        ],
        "weaknesses": [
            "Costs larva and resources that could go to army",
            "Fragile — easily killed by anti-air",
            "Limited combat utility beyond detection"
        ],
        "goodAgainst": ["Dark Templar", "Ghosts (cloaked)", "Banshees"],
        "vulnerableAgainst": ["Phoenixes", "Vikings", "Missile Turrets"],
        "usageTip": "Keep one Overseer with your main army and position a second near key expansions. Use Contaminate on enemy Templar Archives or Tech Labs.",
        "gamePhase": ["Mid", "Late"]
    },
    "queen": {
        "tacticalRole": "Macro powerhouse that injects larvae for production and spreads creep for map control.",
        "strengths": [
            "Spawn Larvae multiplies unit production exponentially",
            "Extremely tanky for its cost with high health and shields",
            "Can defend against early air harassment and Oracle openings"
        ],
        "weaknesses": [
            "Slow without creep — cannot keep up with mobile armies",
            "Relies on macro play; low combat contribution in direct fights",
            "Prioritizing Queens over units slows early army build"
        ],
        "goodAgainst": ["Reapers", "Phoenixes", "Early aggression"],
        "vulnerableAgainst": ["Marine + Medivac drops", "Mass air armies"],
        "usageTip": "Inject every Hatchery each cycle. Spread creep with creep tumors and position Queens near the edge of creep for map control.",
        "gamePhase": ["Early", "Mid", "Late"]
    },
    "baneling": {
        "tacticalRole": "Suicidal explosive unit that single-handedly demolishes grouped biological infantry.",
        "strengths": [
            "Incredible AoE damage that obliterates bio clumps",
            "Centrifugal Hooks upgrade enables burrowed Baneling mines",
            "Forces opponent to split units or face total annihilation"
        ],
        "weaknesses": [
            "Dies instantly upon exploding",
            "Requires proper micro to connect with enemy groups",
            "Useless against armored units (does minimal damage)"
        ],
        "goodAgainst": ["Marines", "Zerglings (in ZvZ)", "Zealots"],
        "vulnerableAgainst": ["Hellions", "Siege Tanks", "Force Fields (that separate them)"],
        "usageTip": "Burrow Banelings in choke points and wait for clustered Marines to walk over them. Combine with Zerglings to force splits.",
        "gamePhase": ["Early", "Mid"]
    },
    "roach": {
        "tacticalRole": "Durable armored ground unit with high health regeneration, ideal for tanking and zone control.",
        "strengths": [
            "Very high health and armor for its cost",
            "Rapid burrowed regeneration lets it recover quickly",
            "Can move while burrowed with Tunneling Claws upgrade"
        ],
        "weaknesses": [
            "Slow movement speed without upgrades",
            "Susceptible to Immortal barrier and armored-bonus damage",
            "Falls off in usefulness against splash and high-range units"
        ],
        "goodAgainst": ["Zerglings", "Marines", "Stalkers", "Hydralisks"],
        "vulnerableAgainst": ["Immortals", "Marauders", "Siege Tanks"],
        "usageTip": "Lead with Roaches to absorb damage in engagements. Burrow damaged Roaches behind the battle line to regenerate and return to fight.",
        "gamePhase": ["Early", "Mid"]
    },
    "ravager": {
        "tacticalRole": "Roach evolution with Corrosive Bile artillery that demolishes force fields and structures.",
        "strengths": [
            "Corrosive Bile can break Protoss Force Fields before they matter",
            "Excellent against structures and defensive positions",
            "Good range for a relatively cheap unit"
        ],
        "weaknesses": [
            "Corrosive Bile requires precise aim under pressure",
            "Fragile compared to Roaches with similar cost",
            "Consumed larva and gas reduces Hydralisk/Mutalisk numbers"
        ],
        "goodAgainst": ["Force Fields", "Stalkers", "Siege Tanks (in sieged mode)", "Planetary Fortresses"],
        "vulnerableAgainst": ["Marines", "Stalkers (blink)", "Immortals"],
        "usageTip": "Use Ravagers to pre-emptively break Force Fields the moment Sentries cast them, allowing your Zerglings to flood through.",
        "gamePhase": ["Early", "Mid"]
    },
    "hydralisk": {
        "tacticalRole": "Versatile high-DPS attacker effective against both air and ground targets.",
        "strengths": [
            "Excellent DPS output for its cost",
            "Attacks both air and ground units simultaneously",
            "Lunge upgrade provides massive bonus speed on creep"
        ],
        "weaknesses": [
            "Fragile — low health pool relative to damage",
            "Very slow off creep without upgrades",
            "Susceptible to splash damage and AoE"
        ],
        "goodAgainst": ["Marines", "Stalkers", "Colossi", "Oracles"],
        "vulnerableAgainst": ["Hellions", "Banelings", "Siege Tanks", "Colossi (with upgrades)"],
        "usageTip": "Keep Hydralisks on creep whenever possible. Pair them with Roaches to protect against melee flanks and with Vipers vs. Protoss.",
        "gamePhase": ["Mid", "Late"]
    },
    "lurker": {
        "tacticalRole": "Subterranean area siege unit. Shreds incoming ground waves with spikes fired while burrowed.",
        "strengths": [
            "Devastating linear area-of-effect splash damage",
            "Fires from absolute safety while burrowed",
            "Outranges standard base defenses with upgrades"
        ],
        "weaknesses": [
            "Cannot attack while unburrowed or moving",
            "Vulnerable to air units and high-range sieges"
        ],
        "goodAgainst": ["Marines", "Hydralisks", "Stalkers", "Zealots"],
        "vulnerableAgainst": ["Tempests", "Liberators", "Brood Lords", "Vipers"],
        "usageTip": "Burrow Lurkers at critical choke points or ramp entrances to deny enemy ground armies any access to your bases.",
        "gamePhase": ["Mid", "Late"]
    },
    "infestor": {
        "tacticalRole": "Biological control caster — roots, disables, and takes over enemy units with devastating spells.",
        "strengths": [
            "Fungal Growth roots and deals damage in an area",
            "Neural Parasite temporarily steals any enemy unit",
            "Microbial Shroud protects ground units from air fire"
        ],
        "weaknesses": [
            "Cannot attack directly without casting spells",
            "Very slow and fragile without protection",
            "Expensive energy management and micro required"
        ],
        "goodAgainst": ["Colossi", "Siege Tanks", "Thors", "Immortals"],
        "vulnerableAgainst": ["Ghosts (Snipe/EMP)", "Phoenixes", "Vikings"],
        "usageTip": "Move Infestors with your burrowed Zerg army. Fungal Growth key groups before engagement, then Neural Parasite the most dangerous enemy unit.",
        "gamePhase": ["Mid", "Late"]
    },
    "swarm-host": {
        "tacticalRole": "Siege unit that generates endless free flying Locusts to pressure enemies and deny areas.",
        "strengths": [
            "Constantly generates free units passively — no additional cost",
            "Forces opponent to react and waste resources",
            "Flying Locusts upgrade bypasses terrain and cliff defenses"
        ],
        "weaknesses": [
            "Requires heavy protection; no direct attacks",
            "Locusts are individually very weak",
            "Extremely slow to reposition when under threat"
        ],
        "goodAgainst": ["Structures", "Defensively-positioned armies", "Siege Tanks"],
        "vulnerableAgainst": ["Viking", "Liberators", "Colossus"],
        "usageTip": "Burrow Swarm Hosts behind ridges or at max range. Keep Zerglings nearby to protect them from units trying to snipe your Swarm Hosts.",
        "gamePhase": ["Late"]
    },
    "mutalisk": {
        "tacticalRole": "Rapid air harasser with a multi-bounce attack, terrorizing expansions and isolated units.",
        "strengths": [
            "Extreme speed makes them very hard to catch",
            "Glaive Wurm bounces to nearby units for extra efficiency",
            "Rapid health regeneration out of combat"
        ],
        "weaknesses": [
            "Individual DPS is low",
            "Extremely vulnerable to high-burst or splash anti-air",
            "Heavy micro required to keep them alive"
        ],
        "goodAgainst": ["Workers", "Overlords", "Siege Tanks (unsieged)", "Isolated units"],
        "vulnerableAgainst": ["Marines (with Medivac)", "Thors", "Phoenixes", "Widow Mines"],
        "usageTip": "Harass multiple enemy expansions simultaneously with Mutalisks. Keep them moving to avoid Marine stim surges and Widow Mine volleys.",
        "gamePhase": ["Mid"]
    },
    "corruptor": {
        "tacticalRole": "Specialist air-to-air fighter optimized for destroying massive capital ships.",
        "strengths": [
            "Bonus damage vs. massive units makes it the primary capital ship counter",
            "Can morph into the devastating Brood Lord",
            "Cost-efficient against slow, massive air targets"
        ],
        "weaknesses": [
            "Poor DPS against non-massive targets",
            "Fragile when caught against mass non-massive fighters",
            "Slow movement limits response time"
        ],
        "goodAgainst": ["Battlecruisers", "Brood Lords", "Carriers", "Colossus"],
        "vulnerableAgainst": ["Vikings", "Marines (massed)", "Hydralisks"],
        "usageTip": "Use Corruptors to deny enemy air-superiority compositions. Always transition them to Brood Lords once you have 6+ Corruptors.",
        "gamePhase": ["Mid", "Late"]
    },
    "viper": {
        "tacticalRole": "Battlefield manipulator that dismantles enemy armies with Abduct, Blinding Cloud, and Parasitic Bomb.",
        "strengths": [
            "Abduct pulls siege units out of position instantly",
            "Blinding Cloud makes ground armies useless in a zone",
            "Parasitic Bomb chains anti-air damage to fleets"
        ],
        "weaknesses": [
            "No combat attack of its own",
            "Fragile — must stay out of direct combat",
            "Consume harms friendly Zerg structures"
        ],
        "goodAgainst": ["Siege Tanks", "Battlecruisers", "Carriers", "Vikings"],
        "vulnerableAgainst": ["Phoenixes", "Infested Terrans", "Focused fire without support"],
        "usageTip": "Abduct the lead Siege Tank or Thor before engagement. Drop Blinding Cloud on the bio or mech army and follow up with Ultralisks.",
        "gamePhase": ["Late"]
    },
    "ultralisk": {
        "tacticalRole": "Unstoppable melee juggernaut with AoE Kaiser Blades and immunity to crowd control effects.",
        "strengths": [
            "Enormous AoE melee attack shreds clustered armies",
            "Immune to stuns, slow, and mind control (Frenzied)",
            "Burrow allows repositioning and regeneration"
        ],
        "weaknesses": [
            "Cannot attack air units at all",
            "Expensive to mass produce",
            "Kited effectively by high-range or mobile units"
        ],
        "goodAgainst": ["Marines", "Zealots", "Stalkers", "Marauders"],
        "vulnerableAgainst": ["Immortals", "Siege Tanks", "Mass Blink Stalkers"],
        "usageTip": "Pair Ultralisks with Vipers. Blinding Cloud disables kiting, and the Ultralisks plow through blinded armies freely.",
        "gamePhase": ["Late"]
    },
    "brood-lord": {
        "tacticalRole": "Aerial siege titan that bombards ground armies with relentless Broodlings from unmatched range.",
        "strengths": [
            "Longest attack range of any Zerg unit",
            "Broodlings block paths and tie up enemy units while the Brood Lord fires",
            "Untouchable by ground armies — must be addressed with air"
        ],
        "weaknesses": [
            "Extremely slow movement speed",
            "Corruptors required to protect them from enemy flyers",
            "Expensive larva, mineral, and gas investment"
        ],
        "goodAgainst": ["Ground armies", "Siege Tanks (sieged)", "Structures"],
        "vulnerableAgainst": ["Vikings", "Void Rays", "Phoenixes", "Tempests"],
        "usageTip": "Siege Brood Lords at maximum range and move them forward as the Broodlings and your ground army clear the space. Always protect with Corruptors.",
        "gamePhase": ["Late"]
    },
    "probe": {
        "tacticalRole": "Protoss worker that gathers resources and warps in structures via dimensional pylon networks.",
        "strengths": [
            "Can warp structures anywhere with pylon power",
            "Teleports away after starting a warp-in unlike SCV",
            "Can proxy buildings far from base for surprise rushes"
        ],
        "weaknesses": [
            "Extremely fragile in combat",
            "Slower production than SCV due to single unit from Nexus",
            "Economy devastated if Probes die early"
        ],
        "goodAgainst": ["Early pressure with proxy gates"],
        "vulnerableAgainst": ["Reapers", "Hellions", "Zerglings"],
        "usageTip": "Always keep your Probe count growing through the first 5 minutes. Warp in structures quickly to maintain tech advantage.",
        "gamePhase": ["Early", "Mid", "Late"]
    },
    "zealot": {
        "tacticalRole": "High-damage melee warrior that excels at surrounding and destroying armies with Charge.",
        "strengths": [
            "Charge upgrade provides immense closing speed",
            "High damage per swing vs. biological units",
            "Cheap and fast to produce in numbers"
        ],
        "weaknesses": [
            "Melee range only — cannot attack air",
            "Slow without Charge; easily kited",
            "Easily countered by AoE or splash damage"
        ],
        "goodAgainst": ["Marines", "Zerglings", "Hydralisks", "Roaches"],
        "vulnerableAgainst": ["Hellions", "Banelings", "Siege Tanks"],
        "usageTip": "Warp Zealots in continuously and use Charge to surround enemy bio balls. Lead Zealots around the edges to flank while Colossi deal AoE.",
        "gamePhase": ["Early", "Mid"]
    },
    "sentry": {
        "tacticalRole": "Defensive support caster whose Force Fields control terrain and protect armies from superior numbers.",
        "strengths": [
            "Force Field blocks ground movement, splitting armies",
            "Guardian Shield reduces all ranged damage to nearby units",
            "Hallucination can scout or waste enemy detection"
        ],
        "weaknesses": [
            "Energy-dependent — useless with no energy",
            "Force Fields can be destroyed by Ravagers",
            "Weak combat statistics on its own"
        ],
        "goodAgainst": ["Zerglings rushing choke points", "Massed bio compositions"],
        "vulnerableAgainst": ["Ravagers", "Banelings", "EMP Rounds (Ghost)"],
        "usageTip": "Place Force Fields at ramp bases to block Zerg run-bys. Use Guardian Shield before engaging bio-mech armies to reduce incoming DPS.",
        "gamePhase": ["Early", "Mid"]
    },
    "adept": {
        "tacticalRole": "Highly mobile early harasser that can project a phantom and teleport to flank or escape.",
        "strengths": [
            "Psionic Transfer creates opportunities for flanks and fakes",
            "Resonating Glaives makes it a strong early unit",
            "Shaded bonus vs. light is excellent against early bio"
        ],
        "weaknesses": [
            "Falls off in large-scale engagements later",
            "Fragile — dies fast if caught in bad position",
            "Shade takes 3 seconds before teleport completes"
        ],
        "goodAgainst": ["Marines", "Zerglings", "Workers"],
        "vulnerableAgainst": ["Marauders", "Roaches", "Stalkers"],
        "usageTip": "Send Adept shades into the opponent's base to scout and damage workers. Cancel the shade if the shade is intercepted.",
        "gamePhase": ["Early", "Mid"]
    },
    "high-templar": {
        "tacticalRole": "Premier psionic spellcaster. Wreaks havoc with Psi Storms and disables spellcasters with Feedback.",
        "strengths": [
            "Psi Storm deals massive damage over time in a wide area",
            "Feedback drains enemy energy and inflicts equivalent damage",
            "Morphs into an Archon when energy is depleted"
        ],
        "weaknesses": [
            "No standard auto-attacks",
            "Very slow and fragile"
        ],
        "goodAgainst": ["Marines", "Hydralisks", "Vipers", "Infestors", "Mutalisks"],
        "vulnerableAgainst": ["Ghosts (EMP/Snipe)", "Sniper units", "Phoenixes"],
        "usageTip": "Pre-storm incoming bio before engagement. Use Feedback on enemy Ghosts before they EMP, and on Vipers to drain their Consume energy.",
        "gamePhase": ["Mid", "Late"]
    },
    "dark-templar": {
        "tacticalRole": "Permanently cloaked assassin that can end games if the opponent lacks detection.",
        "strengths": [
            "Always invisible — devastating without detection",
            "High single-target damage per hit",
            "Shadow Stride allows instant dashes for micro-intensive plays"
        ],
        "weaknesses": [
            "Countered entirely by detection",
            "Low health for the investment cost",
            "Poor in large-scale frontal fights"
        ],
        "goodAgainst": ["Workers (undetected)", "Ghosts", "Infestors", "Ravens"],
        "vulnerableAgainst": ["Observers", "Overseers", "Ravens", "Missile Turrets"],
        "usageTip": "Drop Dark Templars in enemy worker lines when they're already engaged on another front. Cancel the timing if a detector is present.",
        "gamePhase": ["Mid"]
    },
    "archon": {
        "tacticalRole": "Massive energy entity with powerful shields and AoE attacks — deadly vs. biological units.",
        "strengths": [
            "Massive health + shield pool makes it extremely durable",
            "AoE attack deals bonus damage to biological units",
            "Immune to neural parasite and mind control"
        ],
        "weaknesses": [
            "Requires two Templar to create — sacrifices powerful spellcasters",
            "Slow movement speed limits repositioning",
            "No ranged attacks"
        ],
        "goodAgainst": ["Zerglings", "Marines", "Hydralisks", "Mutalisks"],
        "vulnerableAgainst": ["Immortals", "Siege Tanks", "Disruptors"],
        "usageTip": "Merge spent High Templars into Archons rather than letting them die with no energy. Pair Archons with Zealots for a fearsome ground ball.",
        "gamePhase": ["Mid", "Late"]
    },
    "observer": {
        "tacticalRole": "Invisible permanent detector that provides crucial vision and detection across the battlefield.",
        "strengths": [
            "Permanently cloaked — very hard to kill without detection",
            "Provides sight of burrowed and cloaked units",
            "Surveillance Mode doubles vision range"
        ],
        "weaknesses": [
            "Fragile and slow without a speed upgrade",
            "One Observer is often not enough vs. multi-prong threats",
            "Revealed by enemy detectors and anti-cloak abilities"
        ],
        "goodAgainst": ["Lurkers", "Dark Templars", "Banshees", "Widow Mines"],
        "vulnerableAgainst": ["Phoenixes", "Vikings", "Hydralisks"],
        "usageTip": "Always move an Observer with your main army and position others near enemy expansions. Scout for Widow Mines and Lurkers before advancing.",
        "gamePhase": ["Mid", "Late"]
    },
    "warp-prism": {
        "tacticalRole": "Mobile pylon and transport that enables surprise attacks anywhere on the map.",
        "strengths": [
            "Creates a warp-in zone anywhere on the map",
            "Extremely fast in Phase Mode with speed upgrade",
            "Can drop entire armies behind enemy lines"
        ],
        "weaknesses": [
            "Fragile — dies quickly to focused fire",
            "Expensive and high-priority target",
            "Requires protection and constant micro"
        ],
        "goodAgainst": ["Undefended expansions", "Workers via warp-in drops"],
        "vulnerableAgainst": ["Phoenixes", "Stalkers (Blink to air)", "Hydralisks"],
        "usageTip": "Harass enemy mineral lines with Adepts or Immortals warped in near the Warp Prism. Always retreat the Prism before it dies.",
        "gamePhase": ["Mid", "Late"]
    },
    "immortal": {
        "tacticalRole": "Heavy robotic frontliner with a barrier shield that hard-counters single-target burst damage.",
        "strengths": [
            "Barrier absorbs up to 100 damage per activation — counters Marauders",
            "Exceptional DPS against armored units",
            "High base armor makes it extremely durable under fire"
        ],
        "weaknesses": [
            "Slow and cannot retreat quickly",
            "Barrier does not help vs. AoE splash",
            "Weak against biological units (no bonus damage)"
        ],
        "goodAgainst": ["Marauders", "Siege Tanks", "Roaches", "Ravagers"],
        "vulnerableAgainst": ["Banelings", "Infestors (Neural Parasite)", "Mass Zerglings"],
        "usageTip": "Use Immortals as the frontline against heavy armored armies. Pair with Sentries to block path with Force Fields and protect from flanks.",
        "gamePhase": ["Mid", "Late"]
    },
    "colossus": {
        "tacticalRole": "Massive walker that sweeps through light bio armies with thermal lances, striding over cliffs.",
        "strengths": [
            "Enormous AoE that tears through clustered light infantry",
            "Can walk up and down cliffs freely",
            "Effectively forces opponent to split or die to lasers"
        ],
        "weaknesses": [
            "Massive tag — vulnerable to anti-air (Vikings, Corruptors)",
            "Slow repositioning makes it a priority target",
            "Expensive — hard to replace if lost"
        ],
        "goodAgainst": ["Marines", "Zerglings", "Hydralisks", "Zealots"],
        "vulnerableAgainst": ["Vikings", "Corruptors", "Stalkers (with Blink)"],
        "usageTip": "Always send Vikings or use Stalkers to protect Colossi from anti-massive air attacks. Position them behind your ground army and let them sweep freely.",
        "gamePhase": ["Mid", "Late"]
    },
    "disruptor": {
        "tacticalRole": "Volatile AoE devastator that deletes entire army compositions with well-aimed Purification Novas.",
        "strengths": [
            "Single Nova can wipe out an entire bio ball",
            "Forces opponent to immediately scatter and micro constantly",
            "Low resource cost for the devastation potential"
        ],
        "weaknesses": [
            "Long cooldown between shots",
            "Nova is telegraphed — experienced players will dodge it",
            "Very fragile if caught without army protection"
        ],
        "goodAgainst": ["Bio balls", "Clustered Zerg", "Massed Zealots"],
        "vulnerableAgainst": ["Spread armies", "Ravagers", "EMP rounds"],
        "usageTip": "Fire Novas at the edge of bio clumps (not the center) where players are slow to micro. Always keep the Disruptor behind your army.",
        "gamePhase": ["Mid", "Late"]
    },
    "phoenix": {
        "tacticalRole": "Lightning-fast fighter that harasses and lifts critical units with Graviton Beam.",
        "strengths": [
            "Graviton Beam lifts high-value ground units out of combat",
            "Fastest air unit in the game — extremely agile",
            "Excellent at sniping Overlords to deny Zerg supply"
        ],
        "weaknesses": [
            "Cannot attack ground units directly",
            "Fragile against massed anti-air units",
            "Graviton Beam requires manual targeting and casting"
        ],
        "goodAgainst": ["Overlords", "Queens", "Mutalisks", "Infestors"],
        "vulnerableAgainst": ["Vikings", "Corruptors", "Hydralisks"],
        "usageTip": "Open Phoenix to kill Overlords, deny Zerg supply, and lift Queens. Transition to adding Carriers or Void Rays after securing air control.",
        "gamePhase": ["Early", "Mid"]
    },
    "void-ray": {
        "tacticalRole": "Slow but powerful beam ship that melts armored units and structures with Prismatic Alignment.",
        "strengths": [
            "Prismatic Alignment dramatically boosts damage vs. armored targets",
            "Attacks both ground and air units",
            "Durable for an air unit"
        ],
        "weaknesses": [
            "Slow movement — easily kited by fast units",
            "Prismatic Alignment reduces speed during activation",
            "Countered hard by Vikings and Corruptors"
        ],
        "goodAgainst": ["Structures", "Battlecruisers", "Thors", "Immortals"],
        "vulnerableAgainst": ["Vikings", "Corruptors", "Marines (massed)"],
        "usageTip": "Use Void Rays to overwhelm enemy structures during Prismatic Alignment. Activate it just before engaging to maximize burst output.",
        "gamePhase": ["Mid", "Late"]
    },
    "oracle": {
        "tacticalRole": "Versatile support flyer that scouts, disables workers, traps units, and reveals the map.",
        "strengths": [
            "Pulsar Beam destroys undefended workers in seconds",
            "Revelation reveals all cloaked/burrowed units in a large area",
            "Stasis Ward traps units for free in pre-placed ambushes"
        ],
        "weaknesses": [
            "Fragile — easy to kill with basic anti-air",
            "Pulsar Beam consumes energy rapidly",
            "Requires constant micro to be efficient"
        ],
        "goodAgainst": ["Workers (undefended)", "Lurkers (Revelation)", "Banshees"],
        "vulnerableAgainst": ["Vikings", "Hydralisks", "Queens"],
        "usageTip": "Open Oracle to scout the map and harass the opponent's economy. Pre-place Stasis Wards on ramps or expansion paths.",
        "gamePhase": ["Early", "Mid"]
    },
    "tempest": {
        "tacticalRole": "Ultra-long-range capital ship designed to siege ground positions and demolish massive units.",
        "strengths": [
            "Longest attack range of any Protoss unit",
            "Bonus damage vs. massive units (Brood Lords, Ultralisks)",
            "Forces opponent to reposition or lose units at max range"
        ],
        "weaknesses": [
            "Very slow movement — hard to reposition quickly",
            "Extremely expensive to mass",
            "Cannot engage non-massive air units effectively"
        ],
        "goodAgainst": ["Brood Lords", "Ultralisks", "Lurkers (sieged)", "Battlecruisers"],
        "vulnerableAgainst": ["Corruptors", "Vipers (Abduct)", "Vikings"],
        "usageTip": "Position Tempests just out of enemy range and fire from behind a Stalker/Zealot wall. Always protect from Vipers who can Abduct them.",
        "gamePhase": ["Late"]
    },
    "carrier": {
        "tacticalRole": "Protoss capital ship that overwhelms the battlefield with swarms of semi-autonomous Interceptors.",
        "strengths": [
            "Builds free Interceptors that replace themselves during combat",
            "High durability — shield + hull pool is massive",
            "Deals significant sustained DPS vs. ground and air"
        ],
        "weaknesses": [
            "Very slow and expensive to mass",
            "Interceptors can be individually killed reducing DPS",
            "Useless if caught by fast air units before Interceptors launch"
        ],
        "goodAgainst": ["Zerglings", "Hydralisks", "Roaches", "Marines"],
        "vulnerableAgainst": ["Vikings", "Corruptors", "Void Rays"],
        "usageTip": "Group Carriers together for maximum Interceptor saturation. Always pair with Stalkers or Void Rays to ward off Viking and Corruptor threats.",
        "gamePhase": ["Late"]
    },
    "mothership": {
        "tacticalRole": "Unique flagship that cloaks all friendly units, warps armies with Recall, and freezes time.",
        "strengths": [
            "Cloaking Field makes your entire army invisible",
            "Strategic Recall can save your army from certain death",
            "Time Warp stops enemy armies at critical chokepoints"
        ],
        "weaknesses": [
            "Only one can exist at a time — losing it is catastrophic",
            "Extremely expensive and slow to build",
            "Priority target — opponent always focuses it first"
        ],
        "goodAgainst": ["Massed armies (via Time Warp)", "Any army (via Cloaking Field)"],
        "vulnerableAgainst": ["Vikings", "Corruptors (if uncloaked)", "Feedback (High Templar)"],
        "usageTip": "Use Recall to save a dying army or to drop troops at a new location. Use Time Warp at ramps to stall pushes while your forces regroup.",
        "gamePhase": ["Late"]
    }
}

# Upgrades missing from en.json that exist in units.ts
MISSING_UPGRADES_EN = {
    "lurker": {
        "adaptive-talons": {
            "name": "Adaptive Talons",
            "description": "Decreases the time required for Lurkers to burrow or unburrow, enabling rapid repositioning."
        },
        "seismic-spines": {
            "name": "Seismic Spines",
            "description": "Increases the attack range of the Lurker while burrowed from 8 to 10."
        }
    }
}

# Fix high-templar: psi-storm should be an ABILITY, not an upgrade
HIGH_TEMPLAR_PSI_STORM_ABILITY = {
    "psi-storm": {
        "name": "Psionic Storm",
        "description": "Calls down a storm of psionic energy that deals 80 damage over 2.85 seconds in an area of effect."
    }
}

# ==========================================
# Apply fixes to en.json
# ==========================================
with open('src/messages/en.json', 'r') as f:
    en = json.load(f)

# 1. Add tactical fields to all units that are missing them
units_updated = 0
for uid, tactical_data in TACTICAL_EN.items():
    if uid in en['units']:
        unit = en['units'][uid]
        added_fields = []
        for field, value in tactical_data.items():
            if field not in unit:
                unit[field] = value
                added_fields.append(field)
        if added_fields:
            units_updated += 1
            print(f'  EN {uid}: added {added_fields}')
    else:
        print(f'  WARNING: {uid} not found in en.json')

print(f'\\nEN: Updated {units_updated} units with tactical data')

# 2. Add missing upgrades to lurker
for uid, upgrades in MISSING_UPGRADES_EN.items():
    if uid in en['units']:
        if 'upgrades' not in en['units'][uid]:
            en['units'][uid]['upgrades'] = {}
        for upgrade_id, upgrade_data in upgrades.items():
            if upgrade_id not in en['units'][uid]['upgrades']:
                en['units'][uid]['upgrades'][upgrade_id] = upgrade_data
                print(f'  EN {uid}: added upgrade {upgrade_id}')

# 3. Fix high-templar: move psi-storm from upgrades to abilities
if 'high-templar' in en['units']:
    ht = en['units']['high-templar']
    # Remove psionic-storm from upgrades if it exists there
    if 'upgrades' in ht and 'psionic-storm' in ht['upgrades']:
        del ht['upgrades']['psionic-storm']
        print('  EN high-templar: removed psionic-storm from upgrades')
    # Also remove 'psi-storm' from upgrades if it exists there
    if 'upgrades' in ht and 'psi-storm' in ht['upgrades']:
        del ht['upgrades']['psi-storm']
        print('  EN high-templar: removed psi-storm from upgrades')
    # Add to abilities
    if 'abilities' not in ht:
        ht['abilities'] = {}
    if 'psi-storm' not in ht['abilities']:
        ht['abilities']['psi-storm'] = HIGH_TEMPLAR_PSI_STORM_ABILITY['psi-storm']
        print('  EN high-templar: added psi-storm to abilities')

# Write en.json
with open('src/messages/en.json', 'w') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)
    f.write('\\n')

print('\\nen.json updated successfully!')

# ==========================================
# Add missing lurker upgrades to ES and PT
# ==========================================
LURKER_UPGRADES_ES = {
    "adaptive-talons": {
        "name": "Garras Adaptativas",
        "description": "Reduce el tiempo necesario para que los Merodeadores se entierren o desentierren, permitiendo un reposicionamiento rápido."
    },
    "seismic-spines": {
        "name": "Espinas Sísmicas",
        "description": "Aumenta el alcance de ataque del Merodeador enterrado de 8 a 10."
    }
}

LURKER_UPGRADES_PT = {
    "adaptive-talons": {
        "name": "Garras Adaptativas",
        "description": "Reduz o tempo necessário para os Espreitas se enterrarem ou desentarrarem, permitindo um reposicionamento rápido."
    },
    "seismic-spines": {
        "name": "Espinhos Sísmicos",
        "description": "Aumenta o alcance de ataque do Espreita enterrado de 8 para 10."
    }
}

# Fix high-templar in ES
HIGH_TEMPLAR_PSI_STORM_ES = {
    "psi-storm": {
        "name": "Tormenta Psiónica",
        "description": "Invoca una tormenta de energía psiónica que inflige 80 de daño en 2,85 segundos en un área de efecto."
    }
}

HIGH_TEMPLAR_PSI_STORM_PT = {
    "psi-storm": {
        "name": "Tempestade Psiônica",
        "description": "Invoca uma tempestade de energia psiônica que causa 80 de dano em 2,85 segundos em uma área de efeito."
    }
}

for lang, lurker_upgrades, ht_psi_storm in [
    ('es', LURKER_UPGRADES_ES, HIGH_TEMPLAR_PSI_STORM_ES),
    ('pt', LURKER_UPGRADES_PT, HIGH_TEMPLAR_PSI_STORM_PT)
]:
    with open(f'src/messages/{lang}.json', 'r') as f:
        data = json.load(f)
    
    # Add lurker upgrades
    if 'lurker' in data['units']:
        if 'upgrades' not in data['units']['lurker']:
            data['units']['lurker']['upgrades'] = {}
        for upgrade_id, upgrade_data in lurker_upgrades.items():
            if upgrade_id not in data['units']['lurker']['upgrades']:
                data['units']['lurker']['upgrades'][upgrade_id] = upgrade_data
                print(f'  {lang.upper()} lurker: added upgrade {upgrade_id}')
    
    # Fix high-templar: move psi-storm to abilities
    if 'high-templar' in data['units']:
        ht = data['units']['high-templar']
        # Remove from upgrades if present
        for key in ['psionic-storm', 'psi-storm']:
            if 'upgrades' in ht and key in ht['upgrades']:
                del ht['upgrades'][key]
                print(f'  {lang.upper()} high-templar: removed {key} from upgrades')
        # Add to abilities
        if 'abilities' not in ht:
            ht['abilities'] = {}
        if 'psi-storm' not in ht['abilities']:
            ht['abilities']['psi-storm'] = ht_psi_storm['psi-storm']
            print(f'  {lang.upper()} high-templar: added psi-storm to abilities')
    
    with open(f'src/messages/{lang}.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\\n')
    
    print(f'{lang.upper()} updated successfully!')

# ==========================================
# VALIDATION: Check all 3 files match in structure
# ==========================================
print('\\n' + '='*60)
print('VALIDATION REPORT')
print('='*60)

with open('src/messages/en.json') as f:
    en = json.load(f)
with open('src/messages/es.json') as f:
    es = json.load(f)
with open('src/messages/pt.json') as f:
    pt = json.load(f)

en_units = en['units']
es_units = es['units']
pt_units = pt['units']

all_ok = True
for uid in en_units:
    en_u = en_units[uid]
    es_u = es_units.get(uid, {})
    pt_u = pt_units.get(uid, {})
    
    issues = []
    
    # Check tactical fields
    for field in ['tacticalRole', 'strengths', 'weaknesses', 'goodAgainst', 'vulnerableAgainst', 'usageTip', 'gamePhase']:
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
        issues.append(f'Upgrade mismatch EN/ES: EN={en_upgrades}, ES={es_upgrades}')
    if en_upgrades != pt_upgrades:
        issues.append(f'Upgrade mismatch EN/PT: EN={en_upgrades}, PT={pt_upgrades}')
    
    # Check abilities match
    en_abilities = set(en_u.get('abilities', {}).keys())
    es_abilities = set(es_u.get('abilities', {}).keys())
    pt_abilities = set(pt_u.get('abilities', {}).keys())
    
    if en_abilities != es_abilities:
        issues.append(f'Ability mismatch EN/ES: EN={en_abilities}, ES={es_abilities}')
    if en_abilities != pt_abilities:
        issues.append(f'Ability mismatch EN/PT: EN={en_abilities}, PT={pt_abilities}')
    
    if issues:
        all_ok = False
        print(f'\\n{uid}:')
        for issue in issues:
            print(f'  ⚠ {issue}')

if all_ok:
    print('\\n✅ ALL UNITS PASS VALIDATION - all 3 languages are consistent!')
else:
    print('\\n❌ Some issues remain - see above')
