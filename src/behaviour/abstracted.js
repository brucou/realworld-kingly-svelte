// This file aims at containing abstracted machines, that is
// pieces of behaviour that can be viewed as part of a whole
//
// Candidates for such abstraction may be:
// - fetching a resource and dealing with success and error of the fetch
// - fetching a resource requiring authentication and dealing with success and error of the fetch
// - form pages requiring authentication and dealing with success and error of the publishing

/**
 * @typedef {function (extendedState, eventData, settings): Boolean} Guard
 *
 * @typedef {Object} AuthFormEvents
 * @property {String} AUTH_CHECKED
 * @property {String} SUBMIT_TRIGGERED
 * @property {String} FAILED_SUBMISSION
 * @property {String} SUCCEEDED_SUBMISSION
 *
 * @typedef {Object} AuthFormStates
 * @property {String} fetchingAuthenticationPreForm
 * @property {String} fetchingAuthenticationPreSubmit
 * @property {String} enteringData
 * @property {String} fallback
 * @property {String} submitting
 * @property {String} done
 *
 * @typedef {Object} AuthFormActionFactories
 * @property {ActionFactory} showInitializedForm
 * @property {ActionFactory} showSubmittingForm
 * @property {ActionFactory} submit
 * @property {ActionFactory} fallback
 * @property {ActionFactory} retry
 * @property {ActionFactory} finalize
 * @property {ActionFactory} fetchAuth
 */

import { isNot } from "../shared/helpers";

/**
 * @param {{events: AuthFormEvents, actionFactories: AuthFormActionFactories, states: AuthFormStates,
 *   isAuthenticatedGuard: Guard}} def
 * @return {*[]}
 */
export function getAuthenticatedFormPageTransitions(def) {
  const { events, states, actionFactories, isAuthenticatedGuard } = def;
  const { AUTH_CHECKED, SUBMIT_TRIGGERED, FAILED_SUBMISSION, SUCCEEDED_SUBMISSION } = events;
  const {
    fetchingAuthenticationPreForm,
    fetchingAuthenticationPreSubmit,
    enteringData,
    fallback: fallbackState,
    submitting,
    done
  } = states;
  const {
    showInitializedForm,
    showSubmittingForm,
    submit,
    fallback: fallbackActionF,
    retry,
    finalize
  } = actionFactories;
  const isNotAuthenticatedGuard = isNot(isAuthenticatedGuard);

  return [
    {
      from: fetchingAuthenticationPreForm,
      event: AUTH_CHECKED,
      guards: [
        { predicate: isAuthenticatedGuard, to: enteringData, action: showInitializedForm },
        { predicate: isNotAuthenticatedGuard, to: fallbackState, action: fallbackActionF }
      ]
    },
    {
      from: enteringData,
      event: SUBMIT_TRIGGERED,
      to: fetchingAuthenticationPreSubmit,
      action: showSubmittingForm
    },
    {
      from: fetchingAuthenticationPreSubmit,
      event: AUTH_CHECKED,
      guards: [
        { predicate: isAuthenticatedGuard, to: submitting, action: submit },
        { predicate: isNotAuthenticatedGuard, to: fallbackState, action: fallbackActionF }
      ]
    },
    { from: submitting, event: SUCCEEDED_SUBMISSION, to: done, action: finalize },
    { from: submitting, event: FAILED_SUBMISSION, to: fetchingAuthenticationPreForm, action: retry }
  ];
}
