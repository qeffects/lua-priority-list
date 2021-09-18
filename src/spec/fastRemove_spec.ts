import { fastRemove } from "../fastRemove"

describe('Fast Remove', () => {
    it('Removes things from a list start correctly', () => {
        const list = [1, 2, 3, 4, 5];
        assert.is_equal(fastRemove(list, 1), 1);
        assert.is_equal(list.length, 4);
        assert.is_equal(fastRemove(list, 1), 2);
        assert.is_equal(list.length, 3);
        assert.is_equal(fastRemove(list, 1), 3);
        assert.is_equal(list.length, 2);
        assert.is_equal(fastRemove(list, 1), 4);
        assert.is_equal(list.length, 1);
        assert.is_equal(fastRemove(list, 1), 5);
        assert.is_equal(list.length, 0);
    })
    it('Removes things from a list end correctly', () => {
        const list = [1, 2, 3, 4, 5];
        assert.is_equal(fastRemove(list, 5), 5);
        assert.is_equal(fastRemove(list, 4), 4);
        assert.is_equal(fastRemove(list, 3), 3);
        assert.is_equal(fastRemove(list, 2), 2);
        assert.is_equal(fastRemove(list, 1), 5);
    })
})
