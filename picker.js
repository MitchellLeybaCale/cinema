/* picker.js — small, testable picker utility */
(function () {
  'use strict';

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createQueue(items) {
    let queue = shuffle(items.slice());
    return {
      reset() {
        queue = shuffle(items.slice());
      },
      pick() {
        return queue.pop();
      },
      remaining() {
        return queue.length;
      }
    };
  }

  const Picker = { shuffle, createQueue };

  // Browser global
  if (typeof window !== 'undefined') {
    window.Picker = Picker;
  }

  // Node export for tests
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Picker;
  }
})();
