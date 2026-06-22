import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://gkwkorqpktidgxladvzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tvcnFwa3RpZGd4bGFkdnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTYzNzAsImV4cCI6MjA4OTU5MjM3MH0.hBT4v2wUyn2KRme6dutz4cK0pApZyF9fonRb0DPyQxM')




let cart = JSON.parse(localStorage.getItem("cart")) || []
let container = document.querySelector(".container")


let voice = document.querySelector(".voice")
let product_table = document.querySelector(".product-table")
let pirce_table = document.querySelector(".price-table")
let quantity_table = document.querySelector(".quantity-table")
let total_table = document.querySelector(".total-table")
let form = document.querySelector(".form-table")
let total = document.createElement("h2")
total.classList.add("grand-total")
let arr = []
let whatsappBtn =document.createElement("button")
    whatsappBtn.classList.add("send-whatsapp")
    whatsappBtn.textContent="ارسل عبر الواتساب"

let labelname = document.createElement("label")  
labelname.textContent = "اسمك:"
labelname.style.display = " block"
let city = document.querySelector(".name-city")
let clientcity= document.createElement("input")
clientcity.placeholder = "ادخل اسم مدينتك"
clientcity.style.width="200px"
clientcity.style.margin="1rem"

let labelcity = document.createElement("label")
labelcity.textContent = "اسم مدينتك:"
labelcity.style.display = " block"

let clientname= document.createElement("input")
clientname.placeholder = "ادخل اسمك"
clientname.style.width="200px"
clientname.style.margin="1rem"

let inputs;
cart.forEach((item, index) => {
    let count = 0 
    // let div = document.createElement("div")
    // div.classList.add("cart-page")
    let rowtable = document.createElement("tr")

    let nameh2 = document.createElement("td")
    nameh2.textContent = item.name
    nameh2.classList.add("proname")

    let priceh2 = document.createElement("td")
    priceh2.textContent = item.price.toFixed(2)
    
    let inputholder = document.createElement("td")
    let counth2 = document.createElement("input")
    counth2.type = "number"
    
    
    let deletebtn = document.createElement("button")
    deletebtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
    deletebtn.addEventListener("click",()=>{
        cart = cart.filter(product => product.id !== item.id)
        localStorage.setItem("cart",JSON.stringify(cart))
        rowtable.remove()
    })
    


    let totalh2 = document.createElement("td")

    
    

    let countbtn = document.createElement("button")
    countbtn.type = "submit"
    countbtn.style.display ="none"
    total.textContent = 0 + " dh"
    totalh2.textContent = 0+ " dh"
    

    counth2.addEventListener("input", (e)=>{
        e.preventDefault()
        let itemTotal = item.price * Number(counth2.value)
        totalh2.textContent = itemTotal.toFixed(2)
        arr[index] = itemTotal
        let grandtotal = arr.reduce((a, b) => a + b, 0)
        total.textContent = grandtotal.toFixed(2) +  "dh"
        if(totalh2){
            total.style.display = "block"
        }

    })
    city.append(labelname,clientname,labelcity,clientcity)
    voice.append(rowtable, total,whatsappBtn)
    rowtable.append(nameh2,priceh2,inputholder,totalh2,countbtn,deletebtn)
    inputholder.append(counth2)
    


});



whatsappBtn.addEventListener("click",async () => {
   


    inputs = document.querySelectorAll("input[type='number']")
    for(let input of inputs){
        if (input.value === ""){
            alert("fill the inputs")
            return
        }
        
    }
    let grandtotal = arr.reduce((a, b) => a + (b || 0), 0)

    
    
    
        
    
        
    let message = "🛒 طلبي:\n\n"
    message += `اسم العميل: ${clientname.value}\n`
    message += `مدينة العميل: ${clientcity.value}\n\n`
    if(clientname.value ==="" || clientcity.value ===""){
        alert("ادخل اسمك و مدينتك")
        return
    }
    else{
        
        cart.forEach((item, index) => {
            let itemTotal = arr[index] || 0
            message += `المنتج: ${item.name}\n`
            message += `الثمن: درهم ${item.price.toFixed(2)} \n\n`
            message += `المجموع: درهم  ${itemTotal.toFixed(2)} \n\n`
        })
        message += `المجموع: درهم ${grandtotal.toFixed(2)} `
    

        

        await saveOrderToSupabase(cart, grandtotal, clientname.value, clientcity.value)

        let url = `https://wa.me/212696526127?text=${encodeURIComponent(message)}`
        window.open(url, "_blank")
    }
    
})
async function saveOrderToSupabase(cart, total, name, city) {
    const {data: userData} = await supabase.auth.getUser()
    const user = userData.user

    if (!user){
        alert("You must be logged in")
        return
    }
    const{data, erorr} = await supabase
        .from("orders")
        .insert({
            user_id : user.id,
            total_price: total,
            invoice_data:cart,
            customer_name:name,
            city:city

        })

        if(erorr){
            console.log(erorr)
        }else{
            alert("order saved")
        }
}