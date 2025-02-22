/**
 * Run a function when the document is ready.
 * Adapted from https://youmightnotneedjquery.com/#ready
 * @param {() => void | Promise<void>} fn Function to run when the document is ready
 */
export function ready(fn: () => void | Promise<void>): void {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}