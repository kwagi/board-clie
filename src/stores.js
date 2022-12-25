import { readable, writable } from "svelte/store"

export const myData = writable({
    email: "",
    name: "",
    phone: "",
    status: "",
    regDate: "",
    recentDate: ""
})

export const isLogin = writable(false)
export const showOnlyMe = writable(false)
// export const host = readable("localhost")
export const host = readable("springsvelte.xyz")
