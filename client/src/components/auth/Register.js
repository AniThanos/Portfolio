import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert'
import PropTypes from 'prop-types'
const Register = ({ setAlert }) => {

    //formData===state && setFormData===setState
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData;

    const onChangeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert("Password not match", 'danger', 2000)
        }
        else {
            console.log("Success")
            //send data to server example without redux
            // const newUser = {
            //     name, email, password
            // }
            // try {

            //     const config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            //     const body = JSON.stringify(newUser);
            //     const res = await axios.post('/api/users/register', body, config)
            //     console.log(res.data)
            // } catch (err) {
            //     console.log(err.response.data);
            // }
        }
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" action="" onSubmit={(e) => onSubmitHandler(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" onChange={e => onChangeHandler(e)} value={name} required />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" onChange={e => onChangeHandler(e)} value={email} required />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                    >
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        onChange={e => onChangeHandler(e)}
                        minLength="6"
                        value={password2} required
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired
}
export default connect(null, { setAlert })(Register);
