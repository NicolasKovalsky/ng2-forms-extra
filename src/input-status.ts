import {AbstractControl} from "@angular/forms";

/**
 * Input status interface.
 *
 * This is a base class for input status implementations. Actual input status can be represented by one or more input
 * status objects of different types. Input status objects of different types could be distinguished by their
 * identifiers.
 *
 * There are several predefined input status implementations. Their payload is available via methods of the base
 * class.
 *
 * Input status object is meant to be immutable.
 */
export abstract class InputStatus {

    /**
     * Constructs input status.
     *
     * At most one object with the same identifier can exists within input status.
     *
     * @param _id a unique identifier of status object type.
     */
    constructor(private _id: string) {
    }

    /**
     * An identifier of status object type.
     *
     * @return {string} the identifier passed to constructor.
     */
    get id(): string {
        return this._id;
    }

    /**
     * Nested input status object.
     *
     * @return {Array<InputStatus>} a list of nested input status objects.
     */
    get nested(): InputStatus[] {
        return [];
    }

    /**
     * Whether the input is ready to be submitted.
     *
     * If some of the inputs are not ready, the submit would be prevented.
     *
     * When input is ready this does not necessarily mean that it is valid. Nevertheless, the validation errors won't be
     * displayed for ready for submit inputs. This typically means that user didn't entered the invalid data. On attempt
     * to submit an invalid* input will be marked as non-ready, submit will be prevented, and errors will be displayed.
     *
     * This value can be set with `InputReady` and `InputNotReady` constants.
     *
     * @return {boolean}
     */
    get ready(): boolean {

        const readiness = this.get(inputReadinessId);

        return readiness == null || readiness.ready;
    }

    /**
     * Input errors.
     *
     * Input errors could be set with `inputErrors()` method.
     *
     * @return {{}|undefined} a map of input errors, if any.
     */
    get errors(): {[key: string]: any} | undefined {

        const errors = this.get(inputErrorsId);

        return errors && errors.errors;
    }

    /**
     * A control, which status is represented by this status.
     *
     * The control can be set with `inputStatusControl()` method.
     *
     * Note that when the status is merged from multiple controls, this value will be undefined.
     *
     * @return {AbstractControl|undefined} a control instance, if eny.
     */
    get control(): AbstractControl | undefined {

        const statusControl = this.get(inputStatusControlId);

        return statusControl && statusControl.control;
    }

    /**
     * An input status object with the given identifier.
     *
     * @param id target identifier.
     *
     * @return {InputStatus} input status which identifier is equal to the given one, if any.
     */
    get(id: string): InputStatus | undefined {
        return id === this.id ? this : undefined;
    }

    /**
     * Checks whether this input status is equal to another one.
     *
     * @param status an input status object to compare this one with. If omitted the method will return `false`.
     */
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

    /**
     * Checks whether this status value (i.e. payload) equals to another one.
     *
     * This method is called for objects of the same type (i.e. with the same identifiers) by `equals()` method. Note
     * that this method don't have to check for nested statuses equality. The `equals()` method would take care of this.
     *
     * @param status another status object to compare values with.
     */
    abstract equalValues(status: this): boolean;

    /**
     * Checks whether this input status is implied by another one.
     *
     * This method is called to remove unnecessary input statuses from combined ones.
     *
     * @param status another input status to check this one against.
     */
    impliedBy(status: InputStatus): boolean {
        return status === this;
    }

    /**
     * Merges two input statuses.
     *
     * @param status an input status to merge this one with.
     *
     * @return {InputStatus} new input status combined from the two ones.
     */
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

    /**
     * Merges two input status values (i.e. payloads).
     *
     * This method is called for objects of the same type (i.e. with the same identifiers) by `merge()` method. Note
     * that this method don't have to merge nested statuses. The `merge()` method would take care of this.
     *
     * @param status merged input status.
     */
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

/**
 * Ready for submit input status.
 */
export const InputReady: InputStatus = new InputReadiness(true);

/**
 * Not ready for submit input status.
 */
export const InputNotReady: InputStatus = new InputReadiness(false);


/**
 * Constructs input status control.
 *
 * The control instance will be available via `InputStatus.control` field.
 *
 * When merged with another input status the control value would be preserved, unless another input status represents
 * another control. In the latter case the control status would be dropped from merged status.
 *
 * @param control a control which status should be represented.
 */
export function inputStatusControl(control: AbstractControl): InputStatus {
    return new InputStatusControl(control);
}

const inputStatusControlId = "__control__";

class InputStatusControl extends InputStatus {

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
        return this._control === status._control;
    }

    mergeValues(status: this): this {
        if (!status._control || this._control === status._control) {
            return this;
        }
        if (!this._control) {
            return status;
        }
        return noInputStatusControl as this;
    }

}

const noInputStatusControl = new InputStatusControl(undefined);


/**
 * Constructs input errors.
 *
 * The `errors` map will be available via `InputStatus.errors` field.
 *
 * @param errors a error map.
 */
export function inputErrors(errors: {[key: string]: any}): InputStatus {
    return new InputErrors(errors);
}

const inputErrorsId = "__errors__";

class InputErrors extends InputStatus {

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
