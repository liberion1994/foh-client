/**
 * Created by liboyuan on 2016/10/20.
 */

export const CHANNEL_HALL = '大厅';

/**
 * @return {string}
 */
export function tidToChannelName(tid) {
    return '第' + tid + '桌';
}