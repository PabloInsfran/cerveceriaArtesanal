//funcionalidad del btns
const clickButton = document.querySelectorAll(".button");

const tbody = document.querySelector("tbody");

let carrito = [];

//recorrer los btns y añadir al carrito
clickButton.forEach(btn => {
    btn.addEventListener("click", addToCarritoItem)
})



//carrito
function addToCarritoItem (e){
    
    //identificar el btn haciendo click, y contenido
    const button = e.target
    
    //cobtener card completa-closest atributo para obtener obtener la clase mas cercana a la mencionada en ("")
    const item = button.closest(".card")
    
    //obtener titulo
    const itemTitle = item.querySelector(".card-title").textContent;
    
    //obtener precio
    const itemPrice = item.querySelector(".precio").textContent;
    
    //obtener img
    const itemImg = item.querySelector(".card-img-top").src;
    
    //Array con los datos 
    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1    
    }
    //función adherir al carrito
    addItemCarrito(newItem)
}



//aderir Array carrito
function addItemCarrito(newItem) {
    
    //alert aviso de add producto al carrito
    const alert = document.querySelector(".alert")

    //visualizar 2" el mensaje
    setTimeout(function () {
        alert.classList.add("hide")
    }, 2000)
    alert.classList.remove("hide")

    //obtener cantidad de producto(numero de productos repetidos dentro del Array)
    const inputElemento = tbody.getElementsByClassName("input__elemento")

    //sumar productos iguales al carrito
    for (let i = 0; i < carrito.length; i++) {
       
        //comparar los titulos obtenidos- trim() saca los espacios a los lados
        if (carrito[i].title.trim() === newItem.title.trim()) {
            
            //sumar cantidad si esta repetido
            carrito[i].cantidad ++;
           
            //sumar la cantidad dentro del input cuando esta repetido
            const inputValue = inputElemento[i]
            inputValue.value++;
           
            //se llama la función para ejecutar el total
            CarritoTotal();
            
            //retornar acción suma
            return null;
        }
        
    }

    //guardar en carrito el Array 
    carrito.push(newItem)

    renderCarrito()
}




//renderizar carrito
function renderCarrito() {
   
    //pintar dom
   tbody.innerHTML = ""
   carrito.map(item =>{
    const tr = document.createElement("tr")
    tr.classList.add("itemCarrito")
    
    //contenido
    const content = `
    <th scope="row">1</th>
    <td class="table__productos">
      <img src=${item.img} alt="">
      <h6 class="title">${item.title}</h6>
    </td>
    <td class="table__precio"><p>${item.precio}</p></td>
    <td class="table__catidad">
      <input type="number" min="1" value=${item.cantidad} class="input__elemento">
      <button class="delete btn btn-danger">x</button>
    </td>
    `
    
    //agregar contenido
    tr.innerHTML = content;
    tbody.append(tr)
    CarritoTotal()
    //agregar funcionalidad al btn delete
    tr.querySelector(".delete").addEventListener("click", removeItemCarrito)
    
    //selecionar el input cantodad por su clase y agregar evento para ejecutar 
    tr.querySelector(".input__elemento").addEventListener("change", sumaCantidad)
   })
   
 
}




//suma del monto total
function CarritoTotal() {
    let total = 0;
    
    //const donde se acumula el total
    const itemCartTotal = document.querySelector(".itemCartTotal")
    
    //recorrer matriz principal del carrito para obtener los items del precio y cantidad para despues
    //hacer operación para obtener el total
    carrito.forEach((item) => {
        
        //obtener precio
        const precio = Number(item.precio.replace("$", ""))
       
        //obtener total multiplicando el precio por la cantidad
        total = total + precio*item.cantidad
    })
    
    //pintar DOM con el precio total
    itemCartTotal.innerHTML = `total $${total}`
    
    //envio de carrito al localStorage
    addLocalStorage()
}



//función para remover productos del carrito
function removeItemCarrito(e) {
    //btn delete carrito 
    const buttonDelete = e.target
    
    //componente padre del btn buttonDelete
    const tr = buttonDelete.closest(".itemCarrito")
   
    //obtener el contenido de la clase title 
    const title = tr.querySelector(".title").textContent;
   
    //recorrer matriz del carrito
    for (let i = 0; i < carrito.length; i++) {
        
        //trim () para igualar sin los espacios de los lados 
        if (carrito[i].title.trim() === title.trim()) {
           
            //splice para eliminar elemento dentro del carrito
            carrito.splice(i, 1)
            
        }
        
    }
      //alert aviso de remove producto del carrito
      const alert = document.querySelector(".remove")

      //visualizar 2" el mensaje
      setTimeout(function () {
          alert.classList.add("remove")
      }, 2000)
      alert.classList.remove("remove")




    tr.remove()
   
    //ejecutar el total despues de actualizar las cantidades de productos
    CarritoTotal(); 
}




//función input cantidad
function sumaCantidad(e) {
    
    //componente input
    const sumaInput = e.target

    //obtener componente padre de la clase ItemCarrito
    const tr = sumaInput.closest(".itemCarrito")
    
    //cobtener el identificador mediante el título
    const title = tr.querySelector(".title").textContent;

    //recorrer carrito
    carrito.forEach(item => {
        if (item.title.trim() === title){
            
            // evita numeros negativos
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            
            //asigna el valor de la cantidad
            item.cantidad = sumaInput.value;
            
            CarritoTotal();
        }
    })
}




//enviar carrito al localStorage
function addLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}




//localStorage obtención de carrito

window.onload = function () {
    
    //obtención de carrito del storage
    const storage = JSON.parse(localStorage.getItem("carrito"));
    if (storage) {
        carrito = storage;
        renderCarrito()
    }
}
