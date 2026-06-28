import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('https://gkwkorqpktidgxladvzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tvcnFwa3RpZGd4bGFkdnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTYzNzAsImV4cCI6MjA4OTU5MjM3MH0.hBT4v2wUyn2KRme6dutz4cK0pApZyF9fonRb0DPyQxM')
let container = document.querySelector(".container")
let navlinks = document.querySelector(".navlinks")
let navbtn = document.querySelector(".navbtn")

navbtn.addEventListener("click",()=>{
    navlinks.classList.toggle("navlinks")
})

async function signInWithGoogle() {
    const {data, error} = await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{
            redirectTo: `${window.location.origin}${window.location.pathname}`
        }
    })

    if (error) {
        console.log(error)
    }
}
document.querySelector("#login").addEventListener("click",()=>{
    signInWithGoogle()
})
let order_holder = document.querySelector(".order-holder")
async function getUser() {
    const code = new URLSearchParams(window.location.search).get("code")
    if (code) {
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        if (sessionError) {
            console.log(sessionError)
            return null
        }
        window.history.replaceState({}, document.title, window.location.pathname)
    }

    // const { data }= await supabase.auth.getSession()
    const {data , error}= await supabase.auth.getUser()

    if (error){
        console.log(error)
        return null
    }
    
    
    
    
    // console.log(person.session?.user) 
    let user = data.user
    if (user){
        document.querySelector(".hero-section").style.display ="none"
        let h1h1 = document.createElement("h1")
        h1h1.classList.add("greeting") 
        h1h1.textContent = user.user_metadata.full_name + "مرحبًا "
        container.append(h1h1)
    }
    return user
}

async function loadorders() {
    const{data : userData} = await supabase.auth.getUser()
    const user = userData.user

    if (!user) return

    const {data: orders, error:orderError} = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)


    if (orderError){
        console.log(orderError)
        return
    }
    const { data: existingProfile } = await supabase
        .from("mostafa-profile")
        .select("id")
        .eq("id", user.id)
        .single()

    if(!existingProfile){

        await supabase
        .from("mostafa-profile")
        .insert([{
            id:user.id,
            role:"user"
        }])
        .select()
        .single()
    }

    

    const {data: roleData, error: roleError} = await supabase
        .from("mostafa-profile")        
        .select("role")
        .eq("id", user.id)
        .single()

    if (roleError) {
        console.log(roleError)
        return
    }
    if(roleData.role === "admin"){
        window.location.href = "/mostafa-store/admin.html"
        return
    }
    orders.forEach(order => {
        let div= document.createElement("div")
        div.classList.add("order-card")

        let title=document.createElement("h3")
        title.textContent = `order #${order.id.slice(0, 6)}`

        let price= document.createElement("p")
        price.textContent = `total: ${order.total_price.toFixed(2)} Dh`

        let date = document.createElement("p")
        date.textContent = new Date(order.created_at).toLocaleDateString()

        div.append(title, price, date)
        order_holder.append(div)
    });
    // if(orders.length === 0){
    //     let h2 =  document.createElement("h2")
    //     h2.textContent= "لا توجد أي فاتورة بعد"
    //     order_holder.append(h2)
    // }
}

async function initUserPage() {
    const user = await getUser()
    if (user) {
        await loadorders()
    }
}

initUserPage()
