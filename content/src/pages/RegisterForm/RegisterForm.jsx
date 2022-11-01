import React, { useState, useEffect} from 'react';
import Api from '../../api/api'
import { useNavigate, Link } from "react-router-dom";
import {phone as phonevalidate} from 'phone';
import './RegisterForm.scss'
export const api = new Api();

const RegisterForm = () => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [fullname, setFullname] = useState('')
 
    const [validate, setValidate] = useState(true)
    let navigate = useNavigate()


    // signup and go to signin if client is signed up
    async function signupHandler() {
        const phonevalidation = phonevalidate(phone)
        if (phonevalidation.isValid){
            if(fullname.length < 2){
                setValidate('short-nickname')
            }else if(fullname.length > 50){
                setValidate('long-nickname')
            }else{
                await api.registration({phone, password, fullname})
                if(api.isAuth){
                    navigate('/signin', { replace: true })
                }else{
                    setValidate('exists')
                }
            }
        }else{
            setValidate('phone')
        }
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
                onChange={e => setFullname(e.target.value)}
                value={fullname}
                type="text"
                placeholder='Nickname'
            />
            <input className = 'r-input'
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Password'
            />

            {validate == 'exists' ? <p className = 'r-error-msg'>Такой пользователь уже существует</p> : ''}
            {validate == 'phone' ? <p className = 'r-error-msg'>Неправильно заполнен номер телефона</p> : ''}
            {validate == 'short-nickname' ? <p className = 'r-error-msg'>Имя слишком короткое</p> : ''}
            {validate == 'long-nickname' ? <p className = 'r-error-msg'>Имя слишком длинное</p> : ''}
            

            <button className = 'r-button' onClick={signupHandler}>
                Create Account
            </button>
            <p className = 'r-to-signin'>Already have an account? <Link to = '/signin' className = 'link-to-signin'> Sign In</Link></p>
        </div>
    )
}


export default RegisterForm;