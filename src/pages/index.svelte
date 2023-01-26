<script>
    import axios from 'axios'
    import { url } from '@roxi/routify'
    import { host, isLogin, myData, showOnlyMe } from '../stores'

    const size = 5
    let page = 0
    let content = []
    let totalPages = 0
    let boards
    let number = 0
    let numberOfElements = 0
    let pageNums = Array.from(new Array(5), (_, cur) => cur + page).filter(e => e < totalPages)

    //destructuring 사용시 오류가있음. routify 문제인지 모르겠음.

    function firstPage() {
        page = 0
        pageNums = Array.from(new Array(5), (_, cur) => cur + page).filter(e => e < totalPages)
    }

    function lastPage() {
        page = totalPages - 1
        pageNums = Array.from(new Array(5), (_, cur) => cur + page).filter(e => e < totalPages)
    }

    function prevPage() {
        page -= 5
        if (page < 0) {
            page = 0
        }
        pageNums = Array.from(new Array(5), (_, cur) => cur + page).filter(e => e < totalPages)
    }

    function nextPage() {
        page += 5
        if (page > totalPages - 1) {
            page = totalPages - 1
        }
        pageNums = Array.from(new Array(5), (_, cur) => cur + page).filter(e => e < totalPages)
    }

    function clickPage(pageNum) {
        page = pageNum
        if (page > totalPages - 1) {
            page = totalPages - 1
        }
        if (page < 0) {
            page = 0
        }
    }

    $: URL =
        $showOnlyMe === true
            ? `http://${$host}/api/board/my-post/${page}/${size}`
            : `http://${$host}/api/board/lists`
    $: if ($showOnlyMe === true) {
        boards = axios
            .put(URL, { email: $myData.email })
            .then(res => {
                ({ content, totalPages, number, numberOfElements } = res.data)
            })
    } else {
        const formData = new FormData()
        formData.append('page', page)
        formData.append('size', size)
        boards = axios
            .put(URL, formData)
            .then(res => {
                ({ content, totalPages, number, numberOfElements } = res.data)
            })
    }

    function add100() {
        const URL = `http://${$host}/api/board/add100`
        axios.post(URL)
            .then(res => {
                res.data
                alert('100개 게시완료.')
                window.location.reload()
            })
    }
</script>

<div class='main'>
    <h1>게시판</h1>
</div>

{#if $isLogin === true && $myData.email === 'test@naver.com'}
    <div class='text-center'>
        <button class='btn btn-outline-warning' on:click={add100}>100개 게시</button>
    </div>
{/if}

    <div class='main'>
    {#if $isLogin === true}
        <div class='text-end fs-5'>
            <a
                class='badge bg-primary text-wrap'
                style='width: 5rem'
                href="{$url('/post')}">글쓰기</a
            >
        </div>
    {/if}

        {#if $isLogin === true}
        <div class='form-check text-start'>
            <input
                bind:checked='{$showOnlyMe}'
                class='form-check-input'
                type='checkbox'
                value=''
                id='flexCheckDefault'
            />
            <label class='form-check-label' for='flexCheckDefault'
            >내가 쓴 게시글</label
            >
        </div>
    {/if}

        {#await boards}
        <p>불러오는중...</p>
    {:then a}
        <table class='type09'>
            <thead class='type09'>
                <tr>
                    <th>id</th>
                    <th>작성자</th>
                    <th>제목</th>
                    <th>조회수</th>
                    <th>추천</th>
                </tr>
            </thead>
            <tbody class='type09'>
                {#each content as { id, email, title, hits, likes }}
                    <tr>
                        <td>{id}</td>
                        <td>{email}</td>
                        <td
                        ><a href="{$url('/board/:id', { id })}">{title}</a
                        ></td
                        >
                        <td>{hits}</td>
                        <td>{likes}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/await}
</div>
<div class='text-center p-5'>
    <button class='btn btn-outline-secondary' on:click={firstPage}>첫 페이지</button>
    <button class='btn btn-outline-primary' on:click={prevPage}>이전</button>
    {#each pageNums as pageNum}
    <button class='btn btn-outline-primary' on:click={()=>clickPage(pageNum)}>{pageNum + 1}</button>
    {/each}
    <button class='btn btn-outline-primary' on:click={nextPage}>다음</button>
    <button class='btn btn-outline-secondary' on:click={lastPage}>마지막 페이지</button>
</div>

<div class='text-center p-3 mb-3'>
    {page + 1}페이지
</div>