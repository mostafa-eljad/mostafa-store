// let navbtn = document.querySelector(".navbtn")
// navbtn.addEventListener("click",()=>{
//     let navlinks=  document.querySelector(".navlinks")
//     navlinks.classList.toggle("navlinks") 
// })
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://gkwkorqpktidgxladvzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tvcnFwa3RpZGd4bGFkdnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTYzNzAsImV4cCI6MjA4OTU5MjM3MH0.hBT4v2wUyn2KRme6dutz4cK0pApZyF9fonRb0DPyQxM')

let navlinks = document.querySelector(".navlinks")
let navbtn = document.querySelector(".navbtn")
navbtn.addEventListener("click",()=>{
    navlinks.classList.toggle("navlinks")
    
})
const params = new URLSearchParams(window.location.search)
const id = params.get("id")

if (!id) {
  alert("No product selected")
} else {
  loadProduct(id)
}

// Load product
async function loadProduct(id) {
  const { data, error } = await supabase
    .from('mostafa-store')
    .select('*')
    .eq("id", id)
    .single()

  if (error) {
    console.error(error)
    return
  }

  // --------------------
  // Product info
  // --------------------
  document.getElementById("pro-page-title").textContent = data.name
  document.getElementById("pro-page-price").textContent = data.price.toFixed(2) + " Dh"
  document.getElementById("pro-page-description").textContent = data.description || ""

  // --------------------
  // Images (Gallery)
  // --------------------
  const mainImg = document.getElementById("main-img")
  const galleryContainer = document.querySelector(".small-img") // your container

  // galleryContainer.innerHTML = ""

  let images = (data.images && data.images.length > 0)
    ? data.images
    : [data.image]

  // Set main image
  mainImg.src = images[0]

  // Create small images
  let img1 = document.getElementById("img1")
  let img2 = document.getElementById("img2")
  let img3 = document.getElementById("img3")
  if (images[1]) img1.src = images[1]
  if (images[2]) img2.src = images[2]
  if (images[3]) img3.src = images[3]

    ;[img1, img2, img3].forEach(img => {
  img.addEventListener("click", () => {
    if (img.src) {
        let currentMain = mainImg.src
        mainImg.src = img.src
        img.src = currentMain
        
    }
  })
})

  

  // --------------------
  // Add to cart
  // --------------------
  const cartBtn = document.querySelector(".product-button")
  let voicePage = document.querySelector(".voice")
  let voice = []
  
    cartBtn.addEventListener("click", () => {
      voice.push(data.name)
      voice.forEach(one =>{
        let voiceLine = document.createElement("h2")
        voiceLine.textContent = one
      })
      voicePage.append(voiceLine)
      alert(`${data.name} added to cart!`)
    })
    let btncart = document.querySelector(".add-to-cart")
    btncart.addEventListener("click",(e)=>{
            e.stopPropagation();
            let cart = JSON.parse(localStorage.getItem("cart")) || []
            if(!cart.some(item=>item.name === data.name)){
              cart.push({
                  id:data.id,
                  name:data.name,
                  price:data.price
              })
            }
            localStorage.setItem("cart", JSON.stringify(cart))
            btncart.style.backgroundColor = "white"
            btncart.style.color = "black"

            
        })
}

