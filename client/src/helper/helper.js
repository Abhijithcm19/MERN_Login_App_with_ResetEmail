import axios from 'axios' 

axios.defaults.baseURL = "process.env.REACT_APP_SERVER_DOMAIN"

/** make Api request */





/**authenticate function */
export async function authenticate(username){
    try{
        return await axios.post('/api/authentication', {username})
    } catch (error){
        return {error : "Username doesn't exit ...!"}
    }
}


/**get User details */
export async function getUser({username}){
    try{
const {data} = await axios.get(`/api/user/${username}`)

    } catch (error){
        return {error : "Password dosen't match"}
    }
}

/**register user function */
export async function registerUser(credentials){
    try {
        const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        /** send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}


/** login function */
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}


/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}
