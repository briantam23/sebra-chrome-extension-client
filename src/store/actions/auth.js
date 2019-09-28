import { SET_CUSTOMER_AUTH, REMOVE_AUTH } from '../constants';
import axios from 'axios';


export const exchangeTokenForAuth = (params = {}, history) => (
    dispatch => {
        /* const { recipientAddress } = params;
        const chargeAmount = Number(params.chargeAmount); */

        const token = window.localStorage.getItem('token');

        if(!token) return;
        return axios.get('https://vast-plains-55545.herokuapp.com/api/auth', { headers: { authorization: token } })
            .then(res => res.data.data)
            .then(auth => {
                dispatch(_setCustomerAuth(auth));
                history.push('/');
            })
            .catch(ex => window.localStorage.removeItem('token'))
    }
)

const _setCustomerAuth = auth => ({
    type: SET_CUSTOMER_AUTH,
    auth
})
const _removeAuth = auth => ({
    type: REMOVE_AUTH,
    auth
})

export const logout = history => {
    window.localStorage.removeItem('token');
    history.push('/')
    return _removeAuth({});
 }

export const login = (state, params, history) => {
    const { username, password } = state;
    
    return dispatch => (
        axios.post('https://vast-plains-55545.herokuapp.com/api/auth', { username, password })
            .then(res => res.data.data)
            .then(data => {
                window.localStorage.setItem('token', data.token);
                dispatch(exchangeTokenForAuth(params, history));
            })
    )
}