<script>
    import axios from 'axios'
    import { host, isLogin, myData } from '../stores'
    import { redirect } from '@roxi/routify'

    let email = ''
    let password = ''

    const loginSubmit = () => {
        const url = `http://${$host}:8080/api/member/login`

        const data = {
            email,
            password
        }

        axios.put(url, data)
            .then((res) => {
                isLogin.set(true)
                myData.set(res.data)
                localStorage.setItem('token', res.data.token.token)
                $redirect('/')
            })
            .catch((e) => {
                if (e.response.data[0]) {
                    alert(e.response.data[0].message) //validation check
                } else if (e.response.data.headers) {
                    alert(e.response.data.headers.message)//error message
                }
            })
    }
</script>

<div class='container-fluid align-content-center main'>
    <h1>로그인</h1>
    <label class='form-control-plaintext'>이메일:<input type='email' bind:value={email} /></label>
    <label class='form-control-plaintext'>비밀번호:<input type='password' bind:value={password} /></label>
</div>
<div class='main'>
    <label><button class='btn btn-outline-success' on:click={loginSubmit}>로그인</button></label>
</div>