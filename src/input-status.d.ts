export declare abstract class InputStatus {
    private _id;
    constructor(_id: string);
    readonly id: string;
    readonly nested: InputStatus[];
    readonly ready: boolean;
    readonly errors: {
        [key: string]: any;
    } | undefined;
    get(id: string | symbol): InputStatus | undefined;
    equals(status: InputStatus | null | undefined): boolean;
    abstract equalValues(status: this): boolean;
    merge(status: InputStatus): InputStatus;
    abstract mergeValues(status: this): this;
    private combine();
}
export declare const InputReady: InputStatus;
export declare const InputNotReady: InputStatus;
export declare class InputErrors extends InputStatus {
    private _errors;
    constructor(_errors: {
        [key: string]: any;
    });
    readonly errors: {
        [key: string]: any;
    };
    equalValues(status: this): boolean;
    mergeValues(status: this): this;
}
