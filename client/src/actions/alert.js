import { SET_ALERT, REMOVE_ALERT } from './types'
import uuid from 'uuid'

export const setAlert = (msg, alertTypes, timeout = 3000) => dispatch => {
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: {
            msg,
            alertTypes,
            id
        }
    });

    setTimeout(() => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        })
    }, timeout)
}