import { describe, expect, it } from '@jest/globals';

import { diff } from '../diff';
import { patch } from '../patch';

/**** ><> ↑ --------- Import statements ->  */
describe('patch()', () => {
  it('works on many examples', () => {
    const things = [
      [
        'Hello, this is a pretty long sentence about not much at all.',
        'Hello, this is a pretty short sentence.',
      ],
      ['xxxxxxxxxxyyyyyyyyyyyyyyyyzzzzzzzzzzzzzzzz', 'abc'],
      ['xyz', 'xyz'],
    ];
/**** ><> ↑ --------- Test suite definition and setup ->  */

    for (const thing of things) {
      // Test 100 chunk sizes
/**** ><> ↑ --------- First loop iterating over test cases ->  */
      for (let i = 1; i < 5; i++) {
        // Test both directions
/**** ><> ↑ --------- Second loop iterating over chunk sizes ->  */
        for (let j = 0; j < 2; j++) {
          let a, b;

          if (j === 0) {
            a = thing[0];
            b = thing[1];
          } else {
            a = thing[1];
            b = thing[0];
          }

/**** ><> ↑ --------- Third loop testing both directions ->  */
          // Diff the result
          const diffResult = diff(a, b, i * 5);
          // Use the diff to patch it and make sure it equals the same
          expect(patch(a, diffResult)).toBe(b);
/**** ><> ↑ --------- Diff the result and testing the patch with assertion ->  */
        }
      }
    }
  });
});
/**** ><> ↑ --------- End of loops and test case ->  */
