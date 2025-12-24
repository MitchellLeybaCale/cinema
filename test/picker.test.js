const assert = require('assert');
const Picker = require('../picker.js');

(function () {
  const items = [1, 2, 3, 4, 5];
  const q = Picker.createQueue(items);

  assert.strictEqual(q.remaining(), 5, 'initial remaining should be 5');

  const seen = new Set();
  while (q.remaining() > 0) {
    const x = q.pick();
    assert(!seen.has(x), 'picked item should not repeat');
    seen.add(x);
  }

  assert.strictEqual(seen.size, items.length, 'should have seen exactly all items');

  q.reset();
  assert.strictEqual(q.remaining(), 5, 'after reset remaining should be back to 5');

  console.log('OK - picker tests passed');
})();
