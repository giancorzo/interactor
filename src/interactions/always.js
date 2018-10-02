import Convergence from '@bigtest/convergence';
import { action, conditional } from './helpers';

/**
 * Converges on a condition always passing for a period of time. When
 * the condition is a string, an instance property is checked for a
 * truthy value. If the string starts with an `!`, the validation is
 * inverted. Given a function, will converge if the function does
 * not error or return false throughout the timeout period.
 *
 * ``` javascript
 * \@interactor class ButtonInteractor {
 *   isLoading = hasClass('.is-loading');
 * }
 * ```
 *
 * ``` javascript
 * // ensures it is not loading for at least 100ms before clicking
 * await new ButtonInteractor()
 *   .always('!isLoading', 100)
 *   .click()
 * ```
 *
 * @method Interactor#always
 * @param {String|Function} condition - Property name or function to
 * converge on throughout the timeout
 * @param {Number} [timeout] - Timeout to converge on
 * @returns {Interactor} A new instance with additional convergences
 */
export function always(condition, timeout) {
  let assertion = conditional(this, condition);
  return Convergence.prototype.always.call(this, assertion, timeout);
}

/**
 * Interaction creator for converging on a condition being true for a
 * period of time. The resulting method accepts a timeout which
 * overrides any timeout provided to the creator.
 *
 * ``` javascript
 * \@interactor class ButtonInteractor {
 *   isLoading = hasClass('.is-loading');
 *   notLoading = always('!isLoading', 100);
 * }
 * ```
 *
 * ``` javascript
 * // ensures not in a loading state for 100ms before clicking
 * await new ButtonInteractor()
 *   .notLoading()
 *   .click()
 *
 * // uses 1000ms instead of 100ms
 * await new ButtonInteractor()
 *   .notLoading(1000)
 *   .click()
 * ```
 *
 * @function always
 * @param {String|Function} condition - Property name or function to
 * converge on throughout the timeout
 * @param {Number} [defualtTimeout] - Default timeout to use
 * @returns {Object} Property Descriptor
 */
export default function(condition, defaultTimeout) {
  return action(function(timeout = defaultTimeout) {
    return always.call(this, condition, timeout);
  });
}
