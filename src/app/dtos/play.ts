export class Player {
    constructor(
        public playerId: number = 0,
        public name: string = "",
        public number: number = 0,
        public score: number = 0,
        public checkout: string = "",
        public average: number = 0,
        public highscore: number = 0,
        public profilePicture: string = "",
        public throws: Throws = new Throws(),
        public throwsHint: Hint = new Hint(),
        public current: boolean = false,
        public winner: boolean = false,
    ) {}
}

export class Hint {
    constructor(
        public checkoutId: string = "",
        public points: string = "",
        public hint1: string = "",
        public hint2: string = "",
        public hint3: string = "",
    ) {}
}

export class GameInformation {
    constructor(
        public gameId: number = 0,
        public mode: string = "",
        public checkout: string = "",
        public player: Player[] = [],
    ) {}
}

export class Throws {
    constructor(
        public throw1: string = '',
        public throw2: string = '',
        public throw3: string = '',
    ) {}
}