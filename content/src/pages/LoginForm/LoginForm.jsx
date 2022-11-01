import React, { useState} from 'react';
import Api from '../../api/api'
import { useNavigate } from "react-router-dom";
import './LoginForm.scss';

export const api = new Api();


const LoginForm = () => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [validate, setValidate] = useState(true)
    let navigate = useNavigate()

    // login and go to profile if client is logged in
    async function loginHandler() {
        await api.login({ phone, password })
        if (api.isAuth) {
            navigate('/home', { replace: true })
        }else{
            setValidate(false)
        }
        //console.log(api.isAuth)
    }

    return (

        <div className = 'r-main'>
            <input className = 'r-input'
                onChange={e => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder='Phone number'
            />
            <input className = 'r-input'
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Password'
            />
            {validate ? '' : <p className = 'r-error-msg'>Неправильный логин или пароль</p>}
            <button className = 'r-button' onClick={loginHandler}>
                Sign in
            </button>
        </div>
    )
}


export default LoginForm;