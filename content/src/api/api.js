import instance from './axios'

export default class Api {

    isAuth = false
    async registration(data) {
        try{
            const response = await instance.post('/registration', data)
            this.isAuth = true
        }catch(e){
            this.isAuth = false
            console.log(e)
        }
    }
    async login(data) {
        try{
            const response = await instance.post('/login', data)
            localStorage.setItem('token', response.data.accessToken)
            this.isAuth = true
        }catch(err){
                this.isAuth = false
                console.log(this.isAuth)
        }
    }

    async logout() {
        try{
            instance.post('/logout').then(res => {
                localStorage.clear('token', res.data.accessToken)
            })
        }catch(e){
            console.log(e)
        }
    }

    async checkAuth(){
        try{
            instance.get('/refresh').then( res => {
                localStorage.setItem('token', res.data.accessToken)
            })
            this.isAuth = true
        }catch(e){
            this.isAuth = false
            console.log(e)
        }
    }

    async getAllUsers(){
        try{
            const response = await instance.get('/users')
            console.log(response.data[0].phone)
        }catch(e){
            console.log(e)
        }
    }
    
    async getMe(){
        try{
            const response = await instance.get('/me')
            return response.data
        }catch(e){
            console.log(e)
        }
    }

    async createDialog(data) {
        try{
            const response = await instance.post('/dialogs', {partner_phone : data})
            this.isAuth = true
        }catch(e){
            this.isAuth = false
            console.log(e)
        }
    }

}

