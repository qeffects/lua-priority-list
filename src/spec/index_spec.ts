import { PriorityList } from ".."

interface RandomObject {
    foo: string;
    bar: number;
}

describe('Priority List Works', () => {
    it('Adds and removes members in correct order, type: String', () => {
        const prio = new PriorityList<string>();

        prio.put(9, "Last");
        prio.put(1, "First");
        prio.put(4, "Second");

        assert.is_equal("First", prio.take());
        assert.is_equal("Second", prio.take());
        assert.is_equal("Last", prio.take());
    })
    it('Adds and removes members in correct order, type: Number', ()=>{
        const prio = new PriorityList<number>();

        prio.put(3, 1);
        prio.put(1, 5);
        prio.put(2, 20);

        assert.is_equal(5, prio.take());
        assert.is_equal(20, prio.take());
        assert.is_equal(1, prio.take());
    })
    it('Adds and removes members in correct order, type: Object', ()=>{
        const prio = new PriorityList<RandomObject>();

        prio.put(3, {foo: "Bar3", bar: 30});
        prio.put(1, {foo: "Bar1", bar: 10});
        prio.put(2, {foo: "Bar2", bar: 20});

        assert.is_equal("Bar1", prio.take().foo);
        assert.is_equal("Bar2", prio.take().foo);
        assert.is_equal("Bar3", prio.take().foo);
    })
    it('Finds members correctly', ()=>{
        const prio = new PriorityList<RandomObject>();

        const o1 = {foo: "Bar1", bar: 10};
        const o2 = {foo: "Bar2", bar: 10};
        const o3 = {foo: "Bar3", bar: 10};
        const o4 = {foo: "Bar4", bar: 10};
        const o5 = {foo: "Bar5", bar: 10};

        prio.put(7, o4);
        prio.put(1, o1);
        prio.put(5, o3);
        prio.put(9, o5);
        prio.put(3, o2);

        assert.is_equal(5, prio.find(o1));
        assert.is_equal(4, prio.find(o2));
        assert.is_equal(3, prio.find(o3));
        assert.is_equal(2, prio.find(o4));
        assert.is_equal(1, prio.find(o5));
    })
})