<script>
    import { host, isLogin, myData } from '../stores'
    import axios from 'axios'
    import { redirect } from '@roxi/routify'

    let password = ''
    const { email } = $myData

    const deleteSubmit = () => {
        const url = `http://${$host}:8080/api/member/delete`
        const data = {
            email,
            password
        }

        axios.delete(url, { data })
            .then(() => {
                    isLogin.set(false)
                    alert('회원탈퇴성공!')
                    $redirect('/')
                }
            )
            .catch(e => {
                if (e.response.data[0]) {
                    alert(e.response.data[0].message) //validation check
                } else if (e.response.data.headers) {
                    alert(e.response.data.headers.message)//error message
                }
            })
    }
</script>

<div class='main'>
    <label>비밀번호: <input bind:value={password} type='password'></label>
</div>

<div class='main'>
    <button class='btn btn-danger' on:click={deleteSubmit}>탈퇴</button>
</div>