import { AbstractControl } from "@angular/forms";
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
export declare abstract class InputStatus {
    private _id;
    /**
     * Constructs input status.
     *
     * At most one object with the same identifier can exists within input status.
     *
     * @param _id a unique identifier of status object type.
     */
    constructor(_id: string);
    /**
     * An identifier of status object type.
     *
     * @return {string} the identifier passed to constructor.
     */
    readonly id: string;
    /**
     * Nested input status object.
     *
     * @return {Array<InputStatus>} a list of nested input status objects.
     */
    readonly nested: InputStatus[];
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
    readonly ready: boolean;
    /**
     * Input errors.
     *
     * Input errors could be set with `inputErrors()` method.
     *
     * @return {{}|undefined} a map of input errors, if any.
     */
    readonly errors: {
        [key: string]: any;
    } | undefined;
    /**
     * A control, which status is represented by this status.
     *
     * The control can be set with `inputStatusControl()` method.
     *
     * Note that when the status is merged from multiple controls, this value will be undefined.
     *
     * @return {AbstractControl|undefined} a control instance, if eny.
     */
    readonly control: AbstractControl | undefined;
    /**
     * An input status object with the given identifier.
     *
     * @param id target identifier.
     *
     * @return {InputStatus} input status which identifier is equal to the given one, if any.
     */
    get(id: string): InputStatus | undefined;
    /**
     * Checks whether this input status is equal to another one.
     *
     * @param status an input status object to compare this one with. If omitted the method will return `false`.
     */
    equals(status: InputStatus | null | undefined): boolean;
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
    impliedBy(status: InputStatus): boolean;
    /**
     * Merges two input statuses.
     *
     * @param status an input status to merge this one with.
     *
     * @return {InputStatus} new input status combined from the two ones.
     */
    merge(status: InputStatus): InputStatus;
    /**
     * Merges two input status values (i.e. payloads).
     *
     * This method is called for objects of the same type (i.e. with the same identifiers) by `merge()` method. Note
     * that this method don't have to merge nested statuses. The `merge()` method would take care of this.
     *
     * @param status merged input status.
     */
    abstract mergeValues(status: this): this;
    private combine();
}
/**
 * Ready for submit input status.
 */
export declare const InputReady: InputStatus;
/**
 * Not ready for submit input status.
 */
export declare const InputNotReady: InputStatus;
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
export declare function inputStatusControl(control: AbstractControl): InputStatus;
/**
 * Constructs input errors.
 *
 * The `errors` map will be available via `InputStatus.errors` field.
 *
 * @param errors a error map.
 */
export declare function inputErrors(errors: {
    [key: string]: any;
}): InputStatus;
