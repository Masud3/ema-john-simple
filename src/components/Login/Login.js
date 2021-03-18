import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';



function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  initializeLoginFramework();

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true)
    })
  }
  
  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false)
    })
  }

  const handleResponse = (res, redirect) => {
    setUser(res)
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }
  
  const fbSignIn = () =>{
    handleFbSignIn()
    .then(res =>{
      handleResponse(res, true)
    })
  }

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };


  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = (isPasswordValid && passwordHasNumber)
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if (newUser && user.name && user.password) {
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res =>{
        handleResponse(res, true)
      });
    }
    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        handleResponse(res, true)
      });
    }

    e.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={signOut}>Sign out</button> :
          <button onClick={googleSignIn}>Sign in</button>
      }
      <br />
      <button onClick={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photoURL
          } alt="" />
        </div>
      }

      <div>
        <h1>Our own Authentication</h1>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
        <label htmlFor="newUser">New User Sign up</label>
        <form onSubmit={handleSubmit} action="">
          {newUser && <input name="name" type="text" onBlur={handleBlur} required placeholder="Type your name" />}
          <br />
          <input type="text" name="email" onBlur={handleBlur} required placeholder="Type Your Email" />
          <br />
          <input type="password" name="password" onBlur={handleBlur} required placeholder="Type Your Password" />
          <br />
          <input type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
        </form>
        <p style={{ color: 'red' }}>{user.error}</p>
        {
          user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Logged In'} successfully</p>
        }
      </div>
    </div>
  );
}

export default Login;
