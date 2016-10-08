import {AbstractControl} from "@angular/forms";

export abstract class InputStatus {

    constructor(private _id: string) {
    }

    get id(): string {
        return this._id;
    }

    get nested(): InputStatus[] {
        return [];
    }

    get ready(): boolean {

        const readiness = this.get(inputReadinessId);

        return readiness == null || readiness.ready;
    }

    get errors(): {[key: string]: any} | undefined {

        const errors = this.get(inputErrorsId);

        return errors && errors.errors;
    }

    get control(): AbstractControl | undefined {

        const statusControl = this.get(inputStatusControlId);

        return statusControl && statusControl.control;
    }

    get(id: string | symbol): InputStatus | undefined {
        return id === this.id ? this : undefined;
    }

    equals(status: InputStatus | null | undefined): boolean {
        if (!status) {
            return false;
        }
        if (status === this) {
            return true;
        }
        if (this.id === status.id) {
            if (this.nested.length != status.nested.length) {
                return false;
            }
            if (!this.nested.length) {
                return this.equalValues(status as this);
            }
        }
        return this.combine().equalValues(status.combine());
    }

    abstract equalValues(status: this): boolean;

    impliedBy(status: InputStatus): boolean {
        return status === this;
    }

    merge(status: InputStatus): InputStatus {
        if (status.impliedBy(this)) {
            return this;
        }
        if (this.impliedBy(status)) {
            return status;
        }
        if (this.id === status.id && !this.nested.length && !status.nested.length) {
            return this.mergeValues(status as this);
        }
        return this.combine().add(status).optimize();
    }

    abstract mergeValues(status: this): this;

    private combine(): CombinedInputStatus {
        return new CombinedInputStatus().add(this);
    }

}

const combinedInputStatusId = "__combined__";

class CombinedInputStatus extends InputStatus {

    private readonly _map: {[key: string]: InputStatus} = {};
    private _list?: InputStatus[];

    constructor() {
        super(combinedInputStatusId);
    }

    get(id: string | symbol): InputStatus | undefined {
        return id === this.id ? this : this._map[id];
    }

    get nested(): InputStatus[] {
        if (this._list) {
            return this._list;
        }

        const list: InputStatus[] = [];

        for (let id in this._map) {
            if (this._map.hasOwnProperty(id)) {
                list.push(this._map[id]);
            }
        }

        this._list = list;

        return list;
    }

    add(status: InputStatus): this {
        if (status.impliedBy(this)) {
            return this;
        }
        this._list = undefined;
        if (status.id !== this.id) {

            const prev: any = this._map[status.id];

            if (!prev) {
                this._map[status.id] = status;
            } else {

                const merged = prev.mergeValues(status);

                if (!merged.impliedBy(this)) {
                    this._map[status.id] = merged;
                }
            }
        }
        for (let st of status.nested) {
            this.add(st);
        }
        return this;
    }

    equalValues(status: this): boolean {
        return nestedMapContainsAll(this._map, status._map) && mapContainsKeys(status._map, this._map);
    }

    merge(status: InputStatus): this {
        return super.merge(status) as this;
    }

    mergeValues(status: this): this {
        return new CombinedInputStatus().add(this).add(status) as this;
    }

    optimize(): InputStatus {

        const nested = this.nested;

        if (nested.length <= 1) {
            if (!nested.length) {
                return InputReady;
            }
            return nested[0];
        }

        return this;
    }

}

function nestedMapContainsAll(map: {[key: string]: InputStatus}, other: {[key: string]: InputStatus}): boolean {
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            if (!map[key].equals(other[key])) {
                return false;
            }
        }
    }
    return true;
}

const inputReadinessId = "__readiness__";

class InputReadiness extends InputStatus {

    constructor(private _ready: boolean) {
        super(inputReadinessId);
    }

    get ready(): boolean {
        return this._ready;
    }

    impliedBy(status: InputStatus): boolean {
        return this.ready === status.ready;
    }

    equalValues(status: this): boolean {
        return this._ready === status._ready;
    }

    mergeValues(status: this): this {
        return this.ready ? status : this;
    }

}

export const InputReady: InputStatus = new InputReadiness(true);
export const InputNotReady: InputStatus = new InputReadiness(false);

const inputStatusControlId = "__control__";

export class InputStatusControl extends InputStatus {

    constructor(private _control?: AbstractControl) {
        super(inputStatusControlId);
    }

    get control(): AbstractControl | undefined {
        return this._control;
    }

    impliedBy(status: InputStatus): boolean {
        return !this.control || this.control === status.control;
    }

    equalValues(status: this): boolean {
        return this.control === status.control;
    }

    mergeValues(status: this): this {
        if (this.control === status.control) {
            return this;
        }
        return noInputStatusControl as this;
    }

}

const noInputStatusControl = new InputStatusControl(undefined);


const inputErrorsId = "__errors__";

export class InputErrors extends InputStatus {

    constructor(private _errors: {[key: string]: any}) {
        super(inputErrorsId);
    }

    get errors(): {[key: string]: any} {
        return this._errors;
    }

    equalValues(status: this): boolean {
        return equalMaps(this._errors, status._errors);
    }

    mergeValues(status: this): this {
        if (this._errors === status._errors) {
            return this;
        }

        const errors: {[key: string]: any} = {};

        for (let key in this._errors) {
            if (this._errors.hasOwnProperty(key)) {
                errors[key] = this._errors[key];
            }
        }
        for (let key in status._errors) {
            if (status._errors.hasOwnProperty(key)) {
                errors[key] = status._errors[key];
            }
        }

        return new InputErrors(errors) as this;
    }

}

function equalMaps(map1: {[key: string]: any}, map2: {[key: string]: any}) {
    return mapContainsAll(map1, map2) && mapContainsKeys(map2, map1);
}

function mapContainsKeys(map: {[key: string]: any}, other: {[key: string]: any}): boolean {
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            if (!other.hasOwnProperty(key)) {
                return false;
            }
        }
    }
    return true;
}

function mapContainsAll(map: {[key: string]: any}, other: {[key: string]: any}): boolean {
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            if (map[key] !== other[key]) {
                return false;
            }
        }
    }
    return true;
}
