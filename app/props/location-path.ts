export class LocationPath {
    pathname: string;
    state: LocationState;

    constructor(pathname: string, id: number, name?: string) {
        this.pathname = pathname;
        this.state = new LocationState(id, name);
    }
}

export class LocationState {
    id: number;
    name?: string;

    constructor(id: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}
