<script>
    import { redirect, url } from '@roxi/routify'
    import { isLogin, myData, showOnlyMe } from '../stores'</script>

<nav class='main'>
    {#if $isLogin === true}
        <a href={$url('/')} class='btn'>홈</a> |
        <a href={$url('/info')} class='btn'>내 정보</a> |
        <button class='btn btn-warning'
            on:click={() => {
                isLogin.set(false)
                showOnlyMe.set(false)
                localStorage.removeItem('token')
                $redirect('/')
                const resetData = {}
                myData.set(resetData)
            }}>로그아웃</button
        >

    {:else}
        <a href={$url('/')} class='btn'>홈</a> |
        <a href={$url('/login')} class='btn'>로그인</a> |
        <a href={$url('/register')} class='btn'>회원가입</a>
    {/if}
</nav>