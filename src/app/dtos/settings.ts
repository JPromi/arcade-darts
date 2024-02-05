export class UserList {
    constructor(
        public userId: number = 0,
        public username: string = "",
    ) {}
}

export class GameSettings {
    constructor(
        public mode: string = "301",
        public checkout: string = "double",
        public players: number[] = [],
    ) {}
}