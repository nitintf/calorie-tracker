import axios from 'axios'

const adminToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNjQ2OTgyODEwLCJleHAiOjE2NDk1NzQ4MTB9.rDHngb16wnesNgrJL67vO69sTaLP4Y7h7XWLdL-558I' // admin

const userToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwiaWF0IjoxNjQ2OTgyODQ5LCJleHAiOjE2NDk1NzQ4NDl9.lqtZYSyDjGChPl0CAx-jOeMrs4oHh2k9t4kitCZhu0A' //user

let API = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        Authorization: `Bearer ${userToken}`,
    },
})

export default API
