export class LocalDartsPlayer {
    constructor (
        public order: number = 0,
        public playerId: number = 0,
        public username: string = "",
    ) {}
}

export class LocalDarts {
    constructor (
        public mode: string = "",
        public checkout: string = "",
        public date: string = "",
        public ended: boolean = false,
        public players: LocalDartsPlayer[] = [],
        public throws: LocalDartsThrow[] = [],
    ) {}
}

export class LocalDartsThrow {
    constructor (
        public playerId: number = 0,
        public throw1: string = "",
        public throw2: string = "",
        public throw3: string = "",
    ) {}
}