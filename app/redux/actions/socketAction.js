/**
 * Created by liboyuan on 2016/12/22.
 */

export const SOCKET_READY = 'SOCKET_READY';
export const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';

export function socket_ready() { return { type: SOCKET_READY } }
export function socket_disconnect() { return { type: SOCKET_DISCONNECT } }