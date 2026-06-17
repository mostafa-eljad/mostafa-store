import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('https://gkwkorqpktidgxladvzi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2tvcnFwa3RpZGd4bGFkdnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTYzNzAsImV4cCI6MjA4OTU5MjM3MH0.hBT4v2wUyn2KRme6dutz4cK0pApZyF9fonRb0DPyQxM')

let navlinks = document.querySelector(".navlinks")
let navbtn = document.querySelector(".navbtn")
navbtn.addEventListener("click",()=>{
    navlinks.classList.toggle("navlinks")
    
})


let container = document.querySelector(".container");
let nameinput = document.querySelector("#nameInput");
let priceinput = document.querySelector("#priceInput");
let descriptioninput = document.querySelector("#descriptionInput");
let catagoryinput = document.querySelector("#catagoryinput");
let input = document.querySelector("#imageInput");
let uploadbtn = document.querySelector("#uploadBtn");


document.getElementById("login").addEventListener("click", () => {
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: "https://anass-azdod.github.io/mostafa-store/"
        }
    })
  })
uploadbtn.addEventListener("click", async()=>{

    let files = input.files;
    let name = nameinput.value;
    let price = priceinput.value;
    let description = descriptioninput.value;
    let imagesUrl = []
    let catagory = catagoryinput.value

    if (!files || !name || !price || !description ){
      return alert("ادخل المعلومات")
    }
    for(let file of files){
        let filepath = Date.now()+'-'+ file.name

        let {error : upoaldError} = await supabase.storage
        .from('mostafa-bucket')
        .upload(filepath, file)

        if(upoaldError){
            console.error(upoaldError)
            return
        }
        let {data} = supabase.storage
        .from('mostafa-bucket')
        .getPublicUrl(filepath)
        imagesUrl.push(data.publicUrl)
    }
    let {error : dbError} = await supabase
    .from('mostafa-store')
    .insert([
        {
            name:name,
            price:price,
            image:imagesUrl[0],
            description:description,
            images:imagesUrl,
            catagory:catagory
        
        }
    ])
    if(dbError){
        console.error(dbError)
        return
    }
    alert("تم اضافة المنتج")
    nameinput.value = ""
    priceinput.value = ""
    descriptioninput.value = ""
    catagoryinput.value = ""
    input.value = ""
})


async function display() {
    let {data,error } = await supabase
    .from('mostafa-store')
    .select('*')
    
    if (error){
        console.error(error)
        return
    }
    let edit = document.querySelector(".edit")
    data.forEach(product =>{
        let divtag = document.createElement("tr")
        divtag.className= "displaydiv"

        let nametag = document.createElement("td")
        nametag.textContent = product.name

        let pricetag = document.createElement("td")
        pricetag.textContent = product.price

        let destag = document.createElement("td")
        destag.classList.add("destag")
        destag.textContent = product.description

        let imgholder = document.createElement("td")
        imgholder.classList.add("imgholder")

        let imgtag = document.createElement("img")
        imgtag.src = product.image
        imgtag.style.width = ""
        imgtag.style.height = ""

        

        let btndelete = document.createElement("button")
        btndelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
        btndelete.addEventListener("click",async()=>{
            let deletecard = document.createElement("div")
            deletecard.className = "deletecard"
            let deleteh1 = document.createElement("h1")
            deleteh1.textContent = "هل تريد حذف هذا العنصر؟"
            let deletetbn1 = document.createElement("button")
            deletetbn1.textContent = "نعم"
            deletetbn1.className = "deletetbn1"

            let deletetbn2 = document.createElement("button")
            deletetbn2.textContent = "لا"
            deletetbn2.className = "deletetbn2"


            deletetbn1.addEventListener("click", async()=>{
                let {error} = await supabase
                .from('mostafa-store')
                .delete()
                .eq('id', product.id)
                if(error){
                    console.log(error)
                    return
                }
                alert("deleted")
                divtag.remove()
                deletecard.style.display = "none"

            })
            
            deletetbn2.addEventListener("click", ()=>{
                deletecard.style.display = "none"
                return
            })

            
            deletecard.append(deleteh1,deletetbn1,deletetbn2)
            container.append(deletecard)
        })
        let editbtn = document.createElement("button")
        editbtn.textContent = "تعديل"
        editbtn.addEventListener("click",async ()=>{
            let edit_form = document.querySelector(".edit-form")
            edit_form.style.display ="block"

            document.querySelector("#edit-name").value = product.name
            document.querySelector("#edit-price").value = product.price
            document.querySelector("#edit-desc").value = product.description

            localStorage.setItem("editId", product.id)
            edit.style.display ="none"
        })

        imgholder.append(imgtag)
        divtag.append(imgholder,nametag,pricetag,destag,btndelete,editbtn)
        edit.append(divtag)
    })
}
document.querySelector("#save-edit").addEventListener("click",async ()=>{
    let id = localStorage.getItem("editId")

    let newname = document.querySelector("#edit-name").value
    let newprice = document.querySelector("#edit-price").value
    let newdesc = document.querySelector("#edit-desc").value

    let {error} = await supabase
        .from("mostafa-store")
        .update({
            name: newname,
            price: newprice,
            description: newdesc
        })
        .eq("id",Number(id))
    
    if(error){
        console.log(error)
        return
    }
    alert("تم التعديل")
    location.reload()
})
display()
