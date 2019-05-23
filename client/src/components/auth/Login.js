import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
const Login = () => {

    //formData===state && setFormData===setState
    const [loginData, setFormData] = useState({

        email: '',
        password: ''

    })

    const { email, password } = loginData;

    const onChangeHandler = (e) => {
        setFormData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(loginData)
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Login</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign-In Your Account</p>
            <form className="form" action="" onSubmit={(e) => onSubmitHandler(e)}>

                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" onChange={e => onChangeHandler(e)} value={email} required />

                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={e => onChangeHandler(e)}
                        minLength="6"
                        value={password} required
                    />
                </div>

                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </Fragment>
    )
}

export default Login;