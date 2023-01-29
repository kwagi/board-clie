<script>
    import { params, redirect } from '@roxi/routify'
    import axios from 'axios'
    import { host, isLogin, myData } from '../../stores'

    const { email } = $myData
    /**
     * 게시글정보
     */
    let id = 0
    const contentsURL = `http://${$host}/api/board/contents?id=${$params.id}`
    let title = ''
    let contents = ''
    let likes = 0
    let postDate = ''
    let postEmail = ''
    let filePath = ''
    let byteToBase64 = ''
    axios
        .get(contentsURL)
        .then(
            (res) => {
                ({
                    id,
                    email: postEmail,
                    title,
                    contents,
                    postDate,
                    filePath,
                    likes
                } = res.data)
                const imageURL = `http://${$host}/api/board/contents`
                const formData = new FormData()
                formData.append('id', id)
                axios.put(imageURL, formData)
                    .then(res => byteToBase64 = res.data)
            }
        )


    /**
     * 게시글의 모든댓글
     */
    const boardReplyURL = `http://${$host}/api/board/replies?id=${$params.id}`
    const allReply = axios.get(boardReplyURL).then((res) => res.data)
    /**
     * 댓글쓰기
     */
    let replyContent = ''
    const writeReply = () => {
        const ReplyWriteURL = `http://${$host}/api/board/reply/write?id=${id}`
        const data = {
            replyWriter: $myData.email,
            replyContent
        }
        axios.post(ReplyWriteURL, data).then(() => {
            window.location.reload()
        })
    }
    /**
     * 게시글 추천
     */
    const clickLikes = () => {
        const clickLikesURL = `http://${$host}/api/board/clickLikes`
        const formData = new FormData()
        formData.append("email",email)
        formData.append("id",$params.id)
        axios
            .post(clickLikesURL,formData)
            .then(() => {
                alert('추천완료!')
            })
            .catch((e) => {
                if (e.response.data[0]) {
                    alert(e.response.data[0].message) //validation check
                } else if (e.response.data.headers) {
                    alert(e.response.data.headers.message) //error message
                }
            })
    }

    const deleteMyPost = () => {
        const URL = `http://${$host}/api/board/delete/${id}?email=${email}`
        axios.delete(URL).then(() => {
            alert('삭제되었습니다.')
            window.location.reload()
        })
    }

    function deleteReply(id) {
        let URL = `http://${$host}/api/board/reply/delete?id=${id}?${$myData.email}`
        axios.delete(URL).then(() => {
            window.location.reload()
        })
    }

    const answerURL = `http://${$host}/api/board/reply/answer`
    let answer = []
    axios.get(answerURL).then((res) => (answer = res.data))

    let answerContent = ''
    const postAnswer = (content, id) => {
        const postAnswerURL = `http://${$host}/api/board/reply/answer/write`
        let data = {
            replyAnswerContent: content,
            id
        }
        if (data.replyAnswerContent === '') {
            alert('공백입니다.')
            return
        }
        axios.post(postAnswerURL, data).then(() => {
            window.location.reload()
            $redirect(`/board/${$params.id}`)}
        )
    }

    let clickedUuid = ''
    let isClickUuid = false
    const clickUuid = (uuid) => {
        clickedUuid = uuid
        isClickUuid = !isClickUuid
    }

    const dataFormat = "data:image/png;base64,"
</script>

<ul class='list-group'>
    <li class='list-group-item'>제목: {title}</li>
    <li class='list-group-item'>
        작성일: {postDate.substring(0, 19).replace('T', '::')}
    </li>
</ul>

<div class='text-center p-5'>
    {#if byteToBase64 === ''}
        <img src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif" alt="Loading">
    {:else}
        <img src={dataFormat}{byteToBase64} alt="">
    {/if}
</div>

<div class='text-center p-5 text-break'>
    <h5>{contents}</h5>
</div>

<div class='text-center' style='padding: 10em'>
    {#if $isLogin === true}
        <button class='btn btn-outline-dark' on:click={clickLikes}
        >추천: {likes}</button
        >
        {#if email === postEmail}
            <button on:click={deleteMyPost} class='btn btn-outline-danger'
            >글 삭제</button
            >
        {/if}
    {/if}
</div>

<div class='main'>
    {#await allReply}
        <p>불러오는중...</p>
    {:then allReply}
        <table class='type09 text-dark'>
            <thead>
                <tr>
                    <th>작성자</th>
                    <th>내용</th>
                    <th>작성일</th>
                    {#if $isLogin === true}
                        <th>삭제</th>
                    {/if}
                </tr>
            </thead>

            <tbody>
                {#each allReply as { id, replyWriter, replyDate, replyContent, replyUuid }}
                    <tr>
                        <td>
                            {#if replyWriter.toString() === postEmail.toString()}
                                <button
                                    on:click={() => clickUuid(replyUuid)}
                                    class='btn btn-outline-primary'
                                >작성자</button
                                >
                            {:else}
                                <button
                                    on:click={() => clickUuid(replyUuid)}
                                    class='btn btn-outline-primary'
                                >{replyWriter}</button
                                >
                            {/if}
                        </td>
                        <td class='text-break'>{replyContent}</td>
                        <td>{replyDate.substring(0, 19).replace('T', '::')}</td>
                        {#if replyWriter === $myData.email}
                            <td
                            ><button
                                on:click={deleteReply(id)}
                                class='btn btn-outline-danger'>삭제</button
                            ></td
                            >
                        {/if}
                    </tr>

                    {#each answer as { boardReply, replyAnswerUuid, replyAnswerDate, replyAnswerContent }}
                        <tr>
                            {#if boardReply.id === id}
                                <td>↳ #{replyAnswerUuid.toString()}의 답변</td>
                                <td>{replyAnswerContent.toString()}</td>
                                <td
                                >{replyAnswerDate
                                    .substring(0, 19)
                                    .replace('T', '::')}</td
                                >
                                <td />
                            {/if}
                        </tr>
                    {/each}
                    {#if isClickUuid === true && replyUuid === clickedUuid}
                        <input
                            type='text'
                            bind:value={answerContent}
                            placeholder='답글'
                        />
                        <button on:click={() => postAnswer(answerContent, id)}
                        >작성</button
                        >
                    {/if}
                {/each}
            </tbody>
        </table>
    {/await}
</div>

{#if $isLogin === true}
    <div class='text-center'>
        <textarea class='col-6' bind:value={replyContent}></textarea>
        <button on:click={writeReply} class='btn btn-outline-primary'
        >작성</button
        >
    </div>
{/if}