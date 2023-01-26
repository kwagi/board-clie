<script>
    import axios from 'axios'
    import { redirect } from '@roxi/routify'
    import { host } from '../stores'

    let email = ''
    let password = ''
    let name = ''
    let phone = ''

    const regSubmit = () => {
        const url = `http://${$host}/api/member/register`

        let data = {
            email,
            password,
            name,
            phone
        }

        axios
            .post(url, data)
            .then(() => {
                alert('회원가입성공!')
                $redirect('/login')
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

<title>회원가입</title>
<div class='main'>
    <h1>회원가입</h1>
    <label class='form-control-plaintext'
    >이메일 <input
        bind:value={email}
        placeholder='example@domain.com'
        type='email'
    /></label
    >
    <label class='form-control-plaintext'>비밀번호 <input bind:value={password} type='password' /></label>
    <label class='form-control-plaintext'>이름 <input bind:value={name} type='text' /></label>
    <label class='form-control-plaintext'
    >전화번호 <input
        bind:value={phone}
        placeholder='01011111111'
        type='tel'
    /></label
    >
</div>
<div class='main'>
    <label><button class='btn btn-outline-primary' on:click={regSubmit}>회원가입</button></label>
</div>