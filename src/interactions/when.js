import Convergence from '@bigtest/convergence';
import { action, conditional } from './helpers';

/**
 * Converges on a condition. When the condition is a string, an
 * instance property is checked for a truthy value. If the string
 * starts with an `!`, the validation is inverted. Given a function,
 * will converge when the function does not error or return false.
 *
 * ``` javascript
 * \@interactor class ButtonInteractor {
 *   isLoading = hasClass('.is-loading');
 * }
 * ```
 *
 * ``` javascript
 * // waits until not in a loading state before clicking
 * await new ButtonInteractor()
 *   .when('!isLoading')
 *   .click()
 * ```
 *
 * @method Interactor#when
 * @param {String|Function} condition - Property name or function to
 * converge on
 * @returns {Interactor} A new instance with additional convergences
 */
export function when(condition) {
  let assertion = conditional(this, condition);
  return Convergence.prototype.when.call(this, assertion);
}

/**
 * Interaction creator for converging on a condition.
 *
 * ``` javascript
 * \@interactor class ButtonInteractor {
 *   isLoading = hasClass('.is-loading');
 *   doneLoading = when('!isLoading');
 * }
 * ```
 *
 * ``` javascript
 * // waits until not in a loading state before clicking
 * await new ButtonInteractor()
 *   .doneLoading()
 *   .click()
 * ```
 *
 * @function when
 * @param {String|Function} condition - Property name or function to
 * converge on
 * @returns {Object} Property Descriptor
 */
export default function(condition) {
  return action(function() {
    return when.call(this, condition);
  });
}
