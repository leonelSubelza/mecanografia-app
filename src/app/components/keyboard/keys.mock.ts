export interface Key {
  values: string[];
  isPressed: boolean;
  type: 'number' | 'symbol' | 'button';
}

export const keys: Key[][] = [
  [
    { values: ['1'], isPressed: false, type: 'number' },
    { values: ['2'], isPressed: false, type: 'number' },
    { values: ['3'], isPressed: false, type: 'number' },
    { values: ['4'], isPressed: false, type: 'number' },
    { values: ['5'], isPressed: false, type: 'number' },
    { values: ['6'], isPressed: false, type: 'number' },
    { values: ['7'], isPressed: false, type: 'number' },
    { values: ['8'], isPressed: false, type: 'number' },
    { values: ['9'], isPressed: false, type: 'number'},
    { values: ['0'], isPressed: false, type: 'number' },
  ],
[
  { values: ['\\', 'Q'], isPressed: false, type: 'symbol'},
  { values: ['^', 'W'], isPressed: false, type: 'symbol'},
  { values: ['~', 'E'], isPressed: false, type: 'symbol'},
  { values: ['|', 'R'], isPressed: false, type: 'symbol'},
  { values: ['[', 'T'], isPressed: false, type: 'symbol'},
  { values: [']', 'Y'], isPressed: false, type: 'symbol'},
  { values: ['<', 'U'], isPressed: false, type: 'symbol'},
  { values: ['>', 'I'], isPressed: false, type: 'symbol'},
  { values: ['{', 'O'], isPressed: false, type: 'symbol'},
  { values: [']', 'P'], isPressed: false, type: 'symbol'},
],
[
  { values: ['@', 'A'], isPressed: false, type: 'symbol'},
  { values: ['#', 'S'], isPressed: false, type: 'symbol'},
  { values: ['&', 'D'], isPressed: false, type: 'symbol'},
  { values: ['*', 'F'], isPressed: false, type: 'symbol'},
  { values: ['-', 'G'], isPressed: false, type: 'symbol' },
  { values: ['+', 'H'], isPressed: false, type: 'symbol' },
  { values: ['=', 'J'], isPressed: false, type: 'symbol' },
  { values: ['(', 'K'], isPressed: false, type: 'symbol' },
  { values: [')', 'L'], isPressed: false, type: 'symbol' },
  { values: ['%', 'Ñ'], isPressed: false, type: 'symbol' },
],
  [
    { values: ['BLOQ MAYÚS'], isPressed: false, type: 'button' },
    { values: ['_', 'Z'], isPressed: false, type: 'symbol' },
    { values: ['$', 'X'], isPressed: false, type: 'symbol' },
    { values: ['"', 'C'], isPressed: false, type: 'symbol' },
    { values: [`'`, 'V'], isPressed: false, type: 'symbol' },
    { values: [':', 'B'], isPressed: false, type: 'symbol' },
    { values: [';', 'N'], isPressed: false, type: 'symbol' },
    { values: ['/', 'M'], isPressed: false, type: 'symbol' },
    { values: ['Backspace'], isPressed: false, type: 'button' },
  ],
  [
    { values: ['Symb'], isPressed: false, type: 'button' },
    { values: [','], isPressed: false, type: 'symbol' },
    { values: ['SPACE'], isPressed: false, type: 'button' },
    { values: ['.'], isPressed: false, type: 'symbol' },
    { values: ['ENTER'], isPressed: false, type: 'button' },
  ],
];
