export default [
    {
        id: 1,
        key: 'locations',
        title: 'Locations Outside of Town',
        tables: {
          default: [
            'Cave',
            'Mine',
            'Shack'
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
            'Farmland'
          ]
        }
    },
    {
      id: 3,
      key: 'npcs',
      title: 'NPC Characteristics',
      sequence: ['size', 'manner'],
      tables: {
        size: [
          'Small',
          'Medium',
          'Large'
        ],
        manner: [
          'Brusk',
          'Meek',
          'Flirty',
          'Angry'
        ]
      }
  }
];
