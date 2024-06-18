import { UserList } from "./settings";

export class LocalGame {
    constructor (
        public gameId: number,
        public players: UserList[],
        public mode: string,
        public checkout: string,
        public ended: boolean,
        public date: Date,
        public throws: any[]
    ) {}
}