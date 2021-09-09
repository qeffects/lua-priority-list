export class PriorityList<T> {
    list: { priority: number; tiebreak: number; member: T }[];
    private presence: LuaTable<T, boolean>;
    constructor() {
        this.list = [];
        this.presence = new LuaTable<T, boolean>();
    }

    put(priority: number, member: T, tiebreak?: number): void {
        this.presence.set(member, true);

        if (this.list.length < 1) {
            table.insert(this.list, { priority: priority, tiebreak: tiebreak, member: member });
        }

        if (this.list.length < 2) {
            if (this.list[0].priority < priority) {
                table.insert(this.list, 2, { priority: priority, tiebreak: tiebreak, member: member });
            } else {
                table.insert(this.list, 1, { priority: priority, tiebreak: tiebreak, member: member });
            }
        }

        if (this.list.length >= 2) {
            let startindex = 1;
            let endIndex = this.list.length;
            let insertIndex = 1;
            let found = false;
            let iter = 0;

            if (this.list[this.list.length - 1].priority > priority) {
                insertIndex = this.list.length + 1;
                found = true;
            }

            if (this.list[0].priority < priority) {
                insertIndex = 1;
                found = true;
            }

            while (!found) {
                iter += 1;
                const checkIndex = math.floor((endIndex - startindex) / 2 + startindex);
                if (this.list[checkIndex - 1].priority > priority) {
                    if (this.list[checkIndex]) {
                        if (this.list[checkIndex].priority < priority) {
                            insertIndex = checkIndex + 1;
                            break;
                        }
                    } else {
                        insertIndex = checkIndex + 1;
                        break;
                    }
                    startindex = checkIndex + 1;
                } else if (this.list[checkIndex - 1].priority < priority) {
                    if (this.list[checkIndex - 2]) {
                        if (this.list[checkIndex - 2].priority > priority) {
                            insertIndex = checkIndex;
                            break;
                        }
                    } else {
                        insertIndex = checkIndex;
                        break;
                    }
                    endIndex = checkIndex - 1;
                } else {
                    if (this.list[checkIndex - 1].tiebreak && tiebreak) {
                        if (this.list[checkIndex - 1].tiebreak > tiebreak) {
                            insertIndex = checkIndex + 1;
                            break;
                        } else {
                            insertIndex = checkIndex;
                            break;
                        }
                    }
                    insertIndex = checkIndex;
                    break;
                }

                if (iter > 100) {
                    error("too many iterations");
                }
            }
            table.insert(this.list, insertIndex, { priority: priority, tiebreak: tiebreak, member: member });
        }
    }

    find(member: T): number {
        for (const i of $range(1, this.list.length)) {
            if (this.list[i - 1].member === member) {
                return i;
            }
        }
        return 1;
    }

    remove(member: T): void {
        const i = this.find(member);

        this.presence.delete(member);

        table.remove(this.list, i);
    }

    isPresent(member: T): boolean {
        return this.presence.has(member);
    }

    take(): T {
        const c = this.list[this.list.length - 1].member;

        this.presence.delete(c);

        table.remove(this.list, this.list.length);

        return c;
    }
}
