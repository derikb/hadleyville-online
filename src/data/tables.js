export default [
    {
        id: 1,
        key: 'locations',
        title: 'Locations Outside of Town',
        tables: {
          default: [
            "Train [in motion/broken down/stopped by blocked tracks]",
            "Family Farm [abandoned/prospering/failing]",
            "Cattle Ranch",
            "Mine [abandoned/active]",
            "Grazing land [disputed]",
            "River [rapids]",
            "Rocky hills",
            "Deep woods",
            "Religious camp",
            "Bandit camp",
            "Log cabin [abandoned/hideout/hermit]"
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
    id: 3,
    key: 'npcs',
    title: 'NPC Characteristics',
    sequence: ['size', 'manner', 'physical_trait', 'quirk', 'speech'],
    tables: {
      size: [
        "Short",
        "Thin",
        "Average",
        "Tall",
        "Large",
        "Pick Two"
      ],
      dress: [
          "Cleancut",
          "Filthy",
          "Fancy",
          "Practical",
          "Rich",
          "Uniform"
      ],
      manner: [
          "Gregarious",
          "Icy",
          "Pious",
          "Flirtacious / Obsequious",
          "Aggressive / Critical",
          "Reserved"
      ],
      physical_trait: [
          "Missing Limb",
          "Hairy",
          "Unusual hair",
          "Muscular",
          "Unusually Attractive",
          "Unusually Ugly"
      ],
      quirk: [
          "Touchy",
          "Fingers Talisman [crucifix/ring/gun]",
          "Ticket/Fidgety",
          "Bad Sense [sight/hearing]",
          "Drinks/Smokes Profusely",
          "Gestures a lot"
      ],
      speech: [
          "Stutters",
          "Florid",
          "Terse",
          "Curses excessively",
          "Laughs a lot",
          "Meandering"
      ]
    }
  },
  {
    id: 4,
    key: 'jobs',
    title: 'NPC Jobs',
    tables: {
      default: [
        { label: "Worker", "subtable": "worker", "print": true },
        { label: "Merchant", "subtable": "merchant","print": true },
        { label: "Craftsman", "subtable": "craftsman", "print": true },
        { label: "Professional", "subtable": "professional", "print": true },
        { label: "Wealthy", "subtable": "wealthy", "print": true },
        { label: "Ne'er Do Well", "subtable": "neer_do_well", "print": true }
      ],
      worker: [
        "Farmer",
        "Bartender",
        "Clerk",
        "Cowboy",
        "Soldier",
        "Laundress",
        "Prostitute",
        "Logger",
        "Parent",
        "Miner",
        "Trapper",
        "Unemployed"
      ],
      merchant: [
          "General Store",
          "Bathhouse",
          "Hotel/Boarding",
          "Saloon",
          "Pimp",
          "Hardware",
          "Livery",
          "Foreman/Manager",
          "Food/Cafe",
          "Freight",
          "Haberdasher",
          "Feed Barn"
      ],
      craftsman: [
          "Blacksmith",
          "Wainwright",
          "Brewer/Distiller",
          "Saddler",
          "Tailor",
          "Barber",
          "Cook",
          "Butcher",
          "Gunsmith",
          "Sawmill",
          "Carpenter",
          "?"
      ],
      professional: [
          "Doctor",
          "Lawyer",
          "Newspaper Editor",
          "Teacher",
          "Sheriff",
          "Army Officer",
          "Preacher",
          "Telegraph Operator",
          "Conductor",
          "Assayer",
          "Surveyor",
          "Marshal"
      ],
      wealthy: [
          "Mine Owner",
          "Cattle Baron",
          "Trust Fund Child",
          "Banker",
          "Politician",
          "Nouveau Riche"
      ],
      neer_do_well: [
          "Gambler",
          "Addict",
          "Gunfighter",
          "Actor",
          "Musician",
          "Dancer",
          "Thug",
          "Gossip",
          "Thief",
          "Gigolo",
          "Hermit",
          "Vigilante"
      ]
    }
  },
  {
    id: 5,
    key: 'goals',
    title: 'NPC Goals',
    tables: {
      long_term: [
        "Wealth",
        "Safety [family/self]",
        "Civic Good",
        "Knowledge/Skill/Craft",
        "Piety/Charity",
        "Status/Power",
        "Peace & Quiet",
        "Passion"
      ],
      short_term: [
          "Business Deal",
          "Pleasure/Addiction",
          "Property",
          "Specific Object",
          "Money",
          "Job/Work",
          "Love/Lust/Desire",
          "Revenge/Hate"
      ],
      secrets: [
          "Love’s another’s spouse [mutual/unrequited/unexpressed]",
          "Fled a murder rap [innocent/guilty]",
          "Fraud at profession",
          "Hidden vice [dope/alcohol/sex]",
          "Secret child in town",
          "Ran with a bad bunch of hombres",
          "Owes a lot of money / Broke",
          "Hallucinatory visions [religious/psychotic]"
      ]
    }
  },
  {
    id: 6,
    key: 'relationships',
    title: 'NPC Relationships',
    tables: {
      default: [
        { label: "Hate", weight: 1 },
        { label: "Dislike", weight: 5 },
        { label: "Suspicious", weight: 7 },
        { label: "Neutral", weight: 10 },
        { label: "Like", weight: 7 },
        { label: "Friend", weight: 5 },
        { label: "Love", weight: 1 }
      ],
      specific: [
          "Lovers [current/former]",
          "Enemies [long term/recent/former]",
          "Rivalry [business/love]",
          "Loaner/Debtor",
          "Comrades [current/former] [business/army/mines/banditry/cowboys]",
          "Employer/Employee [current/former]",
          "Family [happy/secret/estranged]"
      ],
      faction: [
          "Community leaders (business owners)",
          "Pious church goers",
          "Miners/Loggers [union]",
          "Ranchers",
          "The Law (sheriff, deputies, judges, posse members, etc.)",
          "Homesteaders",
          "Bandits"
      ]
    }
  },
  {
    id: 7,
    key: 'events',
    title: 'Events',
    tables: {
      regular: [
        "Wedding [jealousy/drunken revelry]",
        "Funeral [murder/inheritance]",
        "Market day [theft/rivalry/strangers]",
        "Holiday",
        "Arrival [stage/train]",
        "Sunday services",
        "Payday at the [mine/ranch/camp]"
      ],
      crimes: [
          "Drunken brawl",
          "Murder",
          "Theft",
          "Kidnapping",
          "Bandit raid",
          "Shootout",
          "[Stage/train] ambushed",
          "Arson"
      ],
      natural: [
          "Resource Depletion",
          "Sickness",
          "Rainstorm",
          "Windstorm",
          "Fire",
          "Wild animals"
      ],
      other: [
          "Territorial dispute [ranchers/farmers/both]",
          "Heartless capitalist tries to run thing",
          "A dark past catches up with someone",
          "Mine collapse/Logging accident",
          "Election",
          "Workers strike",
          "Lynch mob",
          "New business opens"
      ]
    }
  },
  {
    id: 8,
    key: 'stranger',
    title: 'A Stranger Comes to Town',
    tables: {
      default: [
        "Gunslinger",
        "Pinkerton Detective",
        "Itinerant Preacher",
        "[Son/father/daughter/lover] thought to be dead",
        "Family member with a [problem/past/secret]",
        "Ex-con [stranger/relative/old friend]",
        "Snake Oil Salesman",
        "Rabblerouser",
        "Swindler [man/woman/couple/family]",
        "Rich [worldly/naive] [man/couple/woman] from back East",
        "Bandit [with/out] his gang",
        "Family looking to settle",
        "Destitute men looking for work",
        "Former soldiers [hungry/crazed/in pursuit/pursued]",
        "Bounty hunter with a [recent/old] warrant for [townsperson/bandit/gunslinger]",
        "Traveling salesman",
        "[Troublesome/pitiful] [man/woman] comes to get [family/friend] out of jail",
        "Politician [campaigning/canvassing]",
        "Woman fleeing [fiance/husband]",
        "Travelling Troupe of Actors"
      ]
    }
  },
  {
    id: 9,
    key: 'town_landscape',
    title: 'Landscape Prominent Feature',
    tables: {
      default: [
        "Town build on the banks of a winding stream crossed by makeshift bridges.",
        "Town build upon rocky outcrops, street(s) wind back and forth, buildings are all at different levels.",
        "Town grew around a single giant tree, the rest of the land is flat and barren.",
        "Town sits in a narrow valley, overlooked by ridges, main road snakes down to town and then back up and out.",
        "Town built at foot of cliff where the first mine was found.",
        "Town expanded from a small waterfall and pool amongst tall evergreens."
      ]
    }
  },
  {
    id: 10,
    key: 'items',
    title: 'Items',
    tables: {
      default: [
        { label: "weapons", "subtable": "weapons", "print": true },
        { label: "valuables", "subtable": "valuables","print": true },
        { label: "clothes", "subtable": "clothes", "print": true },
        { label: "consumables", "subtable": "consumables", "print": true },
        { label: "papers", "subtable": "papers", "print": true },
        { label: "other", "subtable": "other", "print": true }
      ],
      weapons: [
        "Famous gunslinger’s pistol",
        "Knife",
        "Gun [shotgun/pistol/rifle]",
        "Bandolier of bullets",
        "Cavalry Sword",
        "Ax"
      ],
      valuables: [
          "Wedding band of [live/dead] spouse",
          "Thoroughbred horse",
          "Unopened bottle of imported liquor",
          "Wallet of bills",
          "Pouch of gold",
          "Combination to safe on a photo"
      ],
      clothes: [
          "Hat [lady’s/man’s] [fine/plain]",
          "Boots [new/muddy/decorative]",
          "Dress [fancy/torn/bloodied]",
          "Shirt [fancy/bloodstained/torn]",
          "Gun belt",
          "Earrings [plain/bejeweled]"
      ],
      consumables: [
          "Bottle of whisky",
          "Jerky",
          "Tobacco pouch and rolling papers",
          "Canned peaches",
          "Sweet buns",
          "Wine bottle"
      ],
      papers: [
          "Newspaper [local/nearby /far]",
          "Deed to mines",
          "Arrest warrant",
          "Letter [incriminating/sentimental]",
          "Dime novel",
          "Daguerrotype"
      ],
      other: [
          "Dice [loaded]",
          "Playing cards [fresh/used]",
          "Keys to [house/business/lockbox/jail]",
          "Hammer [nails]",
          "Pipe and matches",
          "Lantern"
      ]
    }
  },
  {
    id: 11,
    key: 'dressing',
    title: 'Set Dressing',
    tables: {
      outside: [
        "Balconies",
        "Boardwalks",
        "Hitching posts",
        "Water troughs",
        "Fences",
        "Barrels",
        "Mud Puddles",
        "Hand scrawled signs",
        "Water wagon",
        "Log bridges",
        "Water wheels",
        "Framed out buildings",
        "Tents",
        "Horses and Wagons",
        "Posters (Wanted, Ads, Broadsheets)"
      ],
      inside: [
          "Piano",
          "Billiard table",
          "Dart board",
          "Music box",
          "Spittoons",
          "Bed pans",
          "Paintings [landscape/pretty woman/historical figure]",
          "Mismatched chairs",
          "Makeshift tables",
          "Ladders",
          "Heavy curtains",
          "Wash tubs"
      ]
    }
  },
  {
    id: 12,
    key: "town_name",
    title: "Town Names",
    tables: {
      default: [
        { label: "{{table:this:main}}{{table:this:ending1}}", weight: 4 },
        { label: "{{table:this:main}} {{table:this:ending2}}", weight: 4 },
        { label: "Fort {{table:this:main}}", weight: 1 }
      ],
      main: [
        "Hadley",
        "Smith",
        "Adams",
        "Snake",
        "Elk",
        "Fire",
        "Coal",
        "Oak",
        "Maple",
        "Elm",
        "Wilder",
        "Jackson",
        "Washington",
        "Revere",
        "Franklin",
        "Shallow",
        "Rapid",
        "Gold",
        "Summer",
        "Spring",
        "Nugget",
        "Mary"
      ],
      ending1: [
        "ville",
        "town",
        "berg",
        "woods"
      ],
      ending2: [
        "Hollow",
        "Hills",
        "City",
        "Falls",
        "Rapids"
      ]
    }
  }
];
