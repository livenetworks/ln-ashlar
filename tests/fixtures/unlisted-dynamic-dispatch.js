/**
 * Test fixture for verifying the anti-rot dynamic dispatch guard.
 * This file contains a dynamic event dispatch not covered by the dynamic allowlist.
 */

export function triggerUnlistedDynamic(el, kind) {
	dispatch(el, 'ln-' + kind + ':unlisted-action', { test: true });
}
