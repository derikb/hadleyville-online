export default [
    {
        id: 3,
        key: 'npcs',
        title: 'NPC Characteristics',
        sequence: ['size', 'manner', 'physical_trait', 'quirk', 'speech'],
        tables: {
            size: [
                'Short',
                'Thin',
                'Average',
                'Tall',
                'Large',
                'Pick Two'
            ],
            dress: [
                'Cleancut',
                'Filthy',
                'Fancy',
                'Practical',
                'Rich',
                'Uniform'
            ],
            manner: [
                'Gregarious',
                'Icy',
                'Pious',
                'Flirtacious / Obsequious',
                'Aggressive / Critical',
                'Reserved'
            ],
            physical_trait: [
                'Missing Limb',
                'Hairy',
                'Unusual hair',
                'Muscular',
                'Unusually Attractive',
                'Unusually Ugly'
            ],
            quirk: [
                'Touchy',
                'Fingers Talisman ({{oneof:Crucifix|Ring|Gun|Cards}})',
                'Ticket/Fidgety',
                'Bad Sense of {{oneof:Sight|Hearing}}',
                '{{oneof:Drinks|Smokes|Chews}} Profusely',
                'Gestures a lot'
            ],
            speech: [
                'Stutters',
                'Florid',
                'Terse',
                'Curses excessively',
                'Laughs a lot',
                'Meandering'
            ]
        }
    },
    {
        id: 4,
        key: 'jobs',
        title: 'NPC Jobs',
        display_opt: [
            { table: 'worker', hide_table: true },
            { table: 'merchant', hide_table: true },
            { table: 'craftsman', hide_table: true },
            { table: 'professional', hide_table: true },
            { table: 'wealthy', hide_table: true },
            { table: 'neer_do_well', hide_table: true }
        ],
        tables: {
            default: [
                { label: 'Worker', subtable: 'worker', print: false },
                { label: 'Merchant', subtable: 'merchant', print: false },
                { label: 'Craftsman', subtable: 'craftsman', print: false },
                { label: 'Professional', subtable: 'professional', print: false },
                { label: 'Wealthy', subtable: 'wealthy', print: false },
                { label: 'Ne\'er Do Well', subtable: 'neer_do_well', print: false }
            ],
            worker: [
                'Farmer',
                'Bartender',
                'Clerk',
                'Cowboy',
                'Soldier',
                'Laundress',
                'Prostitute',
                'Logger',
                'Parent',
                'Miner',
                'Trapper',
                'Unemployed'
            ],
            merchant: [
                'General Store',
                'Bathhouse',
                'Hotel/Boarding',
                'Saloon',
                'Pimp',
                'Hardware',
                'Livery',
                'Foreman/Manager',
                'Food/Cafe',
                'Freight',
                'Haberdasher',
                'Feed Barn'
            ],
            craftsman: [
                'Blacksmith',
                'Wainwright',
                'Brewer/Distiller',
                'Saddler',
                'Tailor',
                'Barber',
                'Cook',
                'Butcher',
                'Gunsmith',
                'Sawmill',
                'Carpenter',
                '?'
            ],
            professional: [
                'Doctor',
                'Lawyer',
                'Newspaper Editor',
                'Teacher',
                'Sheriff',
                'Army Officer',
                'Preacher',
                'Telegraph Operator',
                'Conductor',
                'Assayer',
                'Surveyor',
                'Marshal'
            ],
            wealthy: [
                'Mine Owner',
                'Cattle Baron',
                'Trust Fund Child',
                'Banker',
                'Politician',
                'Nouveau Riche'
            ],
            neer_do_well: [
                'Gambler',
                'Addict',
                'Gunfighter',
                'Actor',
                'Musician',
                'Dancer',
                'Thug',
                'Gossip',
                'Thief',
                'Gigolo',
                'Hermit',
                'Vigilante'
            ]
        }
    },
    {
        id: 5,
        key: 'goals',
        title: 'NPC Goals',
        display_opt: [
            { table: 'long_term', hide_table: true },
            { table: 'short_term', hide_table: true },
            { table: 'secrets', hide_table: true }
        ],
        tables: {
            long_term: [
                'Wealth',
                'Safety of {{oneof:Family|Self}}',
                'Civic Good',
                'Knowledge/Skill/Craft',
                'Piety/Charity',
                'Status/Power',
                'Peace & Quiet',
                'Passion'
            ],
            short_term: [
                'Business Deal',
                'Pleasure/Addiction',
                'Property',
                'Specific Object',
                'Money',
                'Job/Work',
                'Love/Lust/Desire',
                'Revenge/Hate'
            ],
            secrets: [
                'Love’s another’s spouse ({{oneof:mutual|unrequited|unexpressed}})',
                'Fled a murder rap ({{oneof:innocent|guilty}})',
                'Fraud at profession',
                'Hidden vice ({{oneof:dope|alcohol|sex}})',
                'Secret child in town',
                'Ran with a bad bunch of hombres',
                'Owes a lot of money / Broke',
                'Hallucinatory visions ({{oneof:religious|psychotic}})'
            ]
        }
    },
    {
        id: 6,
        key: 'relationships',
        title: 'NPC Relationships',
        tables: {
            default: [
                { label: 'Hate', weight: 1 },
                { label: 'Dislike', weight: 5 },
                { label: 'Suspicious', weight: 7 },
                { label: 'Neutral', weight: 10 },
                { label: 'Like', weight: 7 },
                { label: 'Friend', weight: 5 },
                { label: 'Love', weight: 1 }
            ],
            specific: [
                'Lovers ({{oneof:current|former}})',
                'Enemies ({{oneof:long term|recent|former}})',
                'Rivalry ({{oneof:business|love}})',
                'Loaner/Debtor',
                'Comrades ({{oneof:current|former}}) ({{oneof:business|army|mines|banditry|cowboys}})',
                'Employer/Employee ({{oneof:current|former}})',
                'Family ({{oneof:happy|secret|estranged}})'
            ],
            faction: [
                'Community leaders (business owners)',
                'Pious church goers',
                'Miners/Loggers {{oneof:union|}}',
                'Ranchers',
                'The Law (sheriff, deputies, judges, posse members, etc.)',
                'Homesteaders',
                'Bandits'
            ]
        }
    },
    {
        id: 7,
        key: 'events',
        title: 'Events',
        tables: {
            regular: [
                'Wedding ({{oneof:jealousy|drunken revelry}})',
                'Funeral ({{oneof:murder|inheritance}})',
                'Market day {{oneof:theft|rivalry|strangers}}',
                'Holiday',
                'Arrival of ({{oneof:Stage|Train}})',
                'Sunday services',
                'Payday at the {{oneof:Mine|Ranch|Camp}}'
            ],
            crimes: [
                'Drunken brawl',
                'Murder',
                'Theft',
                'Kidnapping',
                'Bandit raid',
                'Shootout',
                '({{oneof:Stage|Train}}) ambushed',
                'Arson'
            ],
            natural: [
                'Resource Depletion',
                'Sickness',
                'Rainstorm',
                'Windstorm',
                'Fire',
                'Wild animals'
            ],
            other: [
                'Territorial dispute ({{oneof:ranchers|farmers|both}})',
                'Heartless capitalist tries to run things',
                'A dark past catches up with someone',
                'Mine collapse/Logging accident',
                'Election',
                'Workers strike',
                'Lynch mob',
                'New business opens',
                'Square dance'
            ]
        }
    },
    {
        id: 8,
        key: 'stranger',
        title: 'A Stranger Comes to Town',
        tables: {
            default: [
                'Gunslinger',
                'Pinkerton Detective',
                'Itinerant Preacher',
                '{{oneof:Son|Father|Daughter|Lover}} thought to be dead',
                'Family member with a {{oneof:problem|past|secret}}',
                'Ex-con {{oneof:stranger|relative|old friend}}',
                'Snake Oil Salesman',
                'Rabblerouser',
                'Swindler {{oneof:man|woman|couple|family}}',
                'Rich ({{oneof:worldly|naive}}) {{oneof:man|couple|woman}} from back East',
                'Bandit {{oneof:with|without}} his gang',
                'Family looking to settle',
                'Destitute men looking for work',
                'Former soldiers ({{oneof:hungry|crazed|in pursuit|pursued}})',
                'Bounty hunter with a {{oneof:recent|old}} warrant for {{oneof:townsperson|bandit|gunslinger}}',
                'Traveling salesman',
                '{{oneof:Troublesome|Pitiful}} {{oneof:Man|Woman}} comes to get {{oneof:Family|Friend}} out of jail',
                'Politician ({{oneof:campaigning|canvassing}})',
                'Woman fleeing {{oneof:fiance|husband}}',
                'Travelling Troupe of Actors'
            ]
        }
    },
    {
        id: 10,
        key: 'items',
        title: 'Items',
        tables: {
            default: [
                { label: 'weapons', subtable: 'weapons', print: true },
                { label: 'valuables', subtable: 'valuables', print: true },
                { label: 'clothes', subtable: 'clothes', print: true },
                { label: 'consumables', subtable: 'consumables', print: true },
                { label: 'papers', subtable: 'papers', print: true },
                { label: 'other', subtable: 'other', print: true }
            ],
            weapons: [
                'Famous gunslinger’s pistol',
                'Knife',
                'Gun ({{oneof:shotgun|pistol|rifle}})',
                'Bandolier of bullets',
                'Cavalry Sword',
                'Ax',
                'Whip'
            ],
            valuables: [
                'Wedding band of {{oneof:live|dead}} spouse',
                'Thoroughbred horse',
                'Unopened bottle of imported liquor',
                'Wallet of bills',
                'Pouch of gold',
                'Combination to safe on a photo',
                'Crucifix'
            ],
            clothes: [
                'Hat {{oneof:lady’s|man’s}} {{oneof:fine|plain}}',
                'Boots {{oneof:new|muddy|decorative}}',
                'Dress {{oneof:fancy|torn|bloodied}}',
                'Shirt {{oneof:fancy|bloodstained|torn}}',
                'Gun belt',
                'Earrings {{oneof:plain|bejeweled}}'
            ],
            consumables: [
                'Bottle of whisky',
                'Jerky',
                'Tobacco pouch and rolling papers',
                'Canned peaches',
                'Sweet buns',
                'Wine bottle'
            ],
            papers: [
                'Newspaper {{oneof:local|nearby|far}}',
                'Deed to mines',
                'Arrest warrant',
                'Letter {{oneof:incriminating|sentimental}}',
                'Dime novel',
                'Daguerrotype'
            ],
            other: [
                'Dice [loaded]',
                'Playing cards {{oneof:fresh|used}}',
                'Keys to {{oneof:house|business|lockbox|jail}}',
                'Hammer {{oneof:and nails|}}',
                'Pipe and matches',
                'Lantern'
            ]
        }
    },
    {
        id: 9,
        key: 'town_landscape',
        title: 'Landscape Prominent Feature',
        tables: {
            default: [
                'Town build on the banks of a winding stream crossed by makeshift bridges.',
                'Town build upon rocky outcrops, street(s) wind back and forth, buildings are all at different levels.',
                'Town grew around a single giant tree, the rest of the land is flat and barren.',
                'Town sits in a narrow valley, overlooked by ridges, main road snakes down to town and then back up and out.',
                'Town built at foot of cliff where the first mine was found.',
                'Town expanded from a small waterfall and pool amongst tall evergreens.'
            ]
        }
    },
    {
        id: 11,
        key: 'dressing',
        title: 'Set Dressing',
        display_opt: [
            { table: 'outside', hide_table: true },
            { table: 'inside', hide_table: true }
        ],
        tables: {
            outside: [
                'Balconies',
                'Boardwalks',
                'Hitching posts',
                'Water troughs',
                'Fences',
                'Barrels',
                'Mud Puddles',
                'Hand scrawled signs',
                'Water wagon',
                'Log bridges',
                'Water wheels',
                'Framed out buildings',
                'Tents',
                'Horses and Wagons',
                'Posters (Wanted, Ads, Broadsheets)'
            ],
            inside: [
                'Piano',
                'Billiard table',
                'Dart board',
                'Music box',
                'Spittoons',
                'Bed pans',
                'Paintings {{oneof:landscape|pretty woman|historical figure}}',
                'Mismatched chairs',
                'Makeshift tables',
                'Ladders',
                'Heavy curtains',
                'Wash tubs',
                'Valise filled with dresses',
                'Old Clock',
                'Brightly upholstered chair/couch',
                'Crystal decanter filled with whiskey'
            ]
        }
    },
    {
        id: 1,
        key: 'locations',
        title: 'Locations Outside of Town',
        tables: {
            default: [
                'Train {{oneof:in motion|broken down|stopped by blocked tracks}}',
                'Family Farm {{oneof:abandoned|prospering|failing}}',
                'Cattle Ranch',
                'Mine {{oneof:abandoned|active}}',
                'Grazing land {{oneof:disputed|}}',
                'River {{oneof:rapids|}}',
                'Rocky hills',
                'Deep woods',
                'Religious camp',
                'Bandit camp',
                'Log cabin {{oneof:abandoned|hideout|hermit}}'
            ]
        }
    },
    {
        id: 2,
        key: 'resources',
        title: 'Settlement Resources',
        tables: {
            default: [
                'Gold',
                'Lumber',
                'Farmland',
                'Water',
                'Railway',
                'Furs/Game'
            ]
        }
    },
    {
        id: 12,
        key: 'town_name',
        title: 'Town Names',
        display_opt: [
            { table: 'main', hide_table: true },
            { table: 'ending1', hide_table: true },
            { table: 'ending2', hide_table: true }
        ],
        tables: {
            default: [
                { label: '{{table:this:main}}{{table:this:ending1}}', weight: 4 },
                { label: '{{table:this:main}} {{table:this:ending2}}', weight: 4 },
                { label: 'Fort {{table:this:main}}', weight: 1 }
            ],
            main: [
                'Hadley',
                'Smith',
                'Adams',
                'Snake',
                'Elk',
                'Fire',
                'Coal',
                'Oak',
                'Maple',
                'Elm',
                'Wilder',
                'Jackson',
                'Washington',
                'Revere',
                'Franklin',
                'Shallow',
                'Rapid',
                'Gold',
                'Summer',
                'Spring',
                'Nugget',
                'Mary'
            ],
            ending1: [
                'ville',
                'town',
                'berg',
                'woods'
            ],
            ending2: [
                'Hollow',
                'Hills',
                'City',
                'Falls',
                'Rapids'
            ]
        }
    }
];
