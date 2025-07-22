export interface Key {
  values: string[];
  isPressed: boolean;
}

export const keys: Key[][] = [
  [
    { values: ['1'], isPressed: false },
    { values: ['2'], isPressed: false },
    { values: ['3'], isPressed: false },
    { values: ['4'], isPressed: false },
    { values: ['5'], isPressed: false },
    { values: ['6'], isPressed: false },
    { values: ['7'], isPressed: false },
    { values: ['8'], isPressed: false },
    { values: ['9'], isPressed: false },
    { values: ['0'], isPressed: false },
  ],
  [
    { values: [`\\`, 'q'], isPressed: false },
    { values: ['^', 'w'], isPressed: false },
    { values: ['~', 'e'], isPressed: false },
    { values: ['|', 'r'], isPressed: false },
    { values: ['[', 't'], isPressed: false },
    { values: [']', 'y'], isPressed: false },
    { values: ['<', 'u'], isPressed: false },
    { values: ['>', 'i'], isPressed: false },
    { values: ['{', 'o'], isPressed: false },
    { values: [']', 'p'], isPressed: false },
  ],
  [
    { values: ['@', 'a'], isPressed: false },
    { values: ['#', 's'], isPressed: false },
    { values: ['&', 'd'], isPressed: false },
    { values: ['*', 'f'], isPressed: false },
    { values: ['-', 'g'], isPressed: false },
    { values: ['+', 'h'], isPressed: false },
    { values: ['=', 'j'], isPressed: false },
    { values: ['(', 'k'], isPressed: false },
    { values: [')', 'l'], isPressed: false },
    { values: ['%', 'ñ'], isPressed: false },
  ],
  [
    { values: ['SHIFT'], isPressed: false },
    { values: ['_', 'z'], isPressed: false },
    { values: ['$', 'x'], isPressed: false },
    { values: ['"', 'c'], isPressed: false },
    { values: [`'`, 'v'], isPressed: false },
    { values: [':', 'b'], isPressed: false },
    { values: [';', 'n'], isPressed: false },
    { values: ['/', 'm'], isPressed: false },
    { values: ['DELETE'], isPressed: false },
  ],
  [
    { values: ['123'], isPressed: false },
    { values: [','], isPressed: false },
    { values: ['SPACE'], isPressed: false },
    { values: ['.'], isPressed: false },
    { values: ['ENTER'], isPressed: false },
  ],
];
