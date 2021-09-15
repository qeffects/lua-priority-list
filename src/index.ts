import { binarySearch } from "lua-bin-search";
import { ObjectPool } from "lua-object-pool";

interface ListMember {
    priority: number; member: any
}

function ListMemberReset(this: any, o: ListMember){
    o.member = 0;
    o.priority = 0;
};

function ListMemberFactory(this: any){return {priority: 0, member: 0}}

const priorityPool = new ObjectPool<ListMember>(50, 100, ListMemberFactory, ListMemberReset)

export class PriorityList<T> {
    list: { priority: number; member: T }[];
    private presence: LuaTable<T, boolean>;
    constructor() {
        this.list = [];
        this.presence = new LuaTable<T, boolean>();
    }

    /**
     * Adds a member to this priority list
     * @param priority the priority of the member, lower means higher priority
     * @param member the member itself
     */
    put(priority: number, member: T): void {
        this.presence.set(member, true);

        const listM = priorityPool.take()
        listM.member = member;
        listM.priority = priority;

        if (this.list.length < 1) {
            table.insert(this.list, listM);
        }

        if (this.list.length < 2) {
            if (this.list[0].priority < priority) {
                table.insert(this.list, 2, listM);
            } else {
                table.insert(this.list, 1, listM);
            }
        }

        if (this.list.length >= 2) {
            let insertIndex = binarySearch.findInsert(this.list, "priority", priority)

            table.insert(this.list, insertIndex, listM);
        }
    }

    /**
     * Finds a member in the priority list
     * @param member The member to be found
     * @returns Position of the member
     */
    find(member: T): number {
        for (const i of $range(1, this.list.length)) {
            if (this.list[i - 1].member === member) {
                return i;
            }
        }
        return 1;
    }

    /**
     * Removes a member from the priority list
     * @param member The member to be removed
     */
    remove(member: T): void {
        const i = this.find(member);
        const lm = table.remove(this.list, i)

        this.presence.delete(member);

        lm && priorityPool.free(lm);
    }

    /**
     * Checks if the member is in the priority list
     * @param member 
     * @returns True if it's present, false if not
     */
    isPresent(member: T): boolean {
        return this.presence.has(member);
    }

    /**
     * Removes and returns the member with the highest priority
     * @returns your highest priority member
     */
    take(): T {
        const c = this.list[this.list.length - 1].member;
        this.presence.delete(c);

        const lm = table.remove(this.list, this.list.length);

        lm && priorityPool.free(lm);

        return c;
    }
}
