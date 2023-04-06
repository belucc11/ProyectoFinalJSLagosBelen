//variables
let productos = document.querySelector('.nombre-productos');
let productosCarrito = document.querySelector('.productos-carrito');
let precioTotal = document.querySelector('.precio-total')
let cantidadProductos = document.querySelector('.contar-productos');


let carrito = [];
let totalCarrito = 0;
let contarProductos = 0;

//funciones
escucharEventos();
function escucharEventos(){
    productos.addEventListener('click', agregarProducto);

    productosCarrito.addEventListener('click', borrarProducto);
}

let btn = document.querySelector('.btn-comprar')
btn.addEventListener("click", function(){  

})

function agregarProducto(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-comprar')) {
        const seleccionarProducto = e.target.parentElement; 
        identificarProducto(seleccionarProducto);
    }

    //libreria
    Toastify({
        text:"Producto agregado",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
    }).showToast()


    //local storage
    let arreglo_json = JSON.stringify(carrito);

    localStorage.setItem("carrito", arreglo_json);
}

function borrarProducto(e) {
    if (e.target.classList.contains('borrar-producto')) {
        const borrarId = e.target.getAttribute('data-id');

        carrito.forEach(value => {
            if (value.id == borrarId) {
                let restaPrecio = parseFloat(value.precio) * parseFloat(value.cantidad);
                totalCarrito =  totalCarrito - restaPrecio;
                totalCarrito = totalCarrito.toFixed(2);
            }
        });
        carrito = carrito.filter(producto => producto.id !== borrarId);
        
        contarProductos--;
    }
   
    if (carrito.length === 0) {
        precioTotal.innerHTML = 0;
        cantidadProductos.innerHTML = 0;
    }
    cargarHtml();
}

function identificarProducto(producto){
    const infoProducto = {
        imagen: producto.querySelector('div img').src,
        nombre: producto.querySelector('.nombre').textContent,
        precio: producto.querySelector('div p span').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    totalCarrito = parseFloat(totalCarrito) + parseFloat(infoProducto.precio);
    totalCarrito = totalCarrito.toFixed(2);

    const exist = carrito.some(producto => producto.id === infoProducto.id);
    if (exist) {
        const pro = carrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto;
            } else {
                return producto
            }
        });
        carrito = [...pro];
    } else {
        carrito = [...carrito, infoProducto]
        contarProductos++;
    }
    cargarHtml();
    
}

function cargarHtml(){
    resetearHtml();
    carrito.forEach(producto => {
        const {imagen, nombre, precio, cantidad, id} = producto;
        const lista = document.createElement('div');
        lista.classList.add('item');
        lista.innerHTML = `
            <img src="${imagen}" alt="">
            <div class="item-content">
                <h5>${nombre}</h5>
                <h5 class="cart-price">$${precio}</h5>
                <h6>Cantidad: ${cantidad}</h6>
            </div>
            <span class="borrar-producto" data-id="${id}">X</span>
            `;

        productosCarrito.appendChild(lista);

        precioTotal.innerHTML = totalCarrito;

        cantidadProductos.innerHTML = contarProductos;
    });
}
 function resetearHtml(){
    productosCarrito.innerHTML = '';
 }

//GEO
function mostrar_ubicacion(ubicacion){
    let latitud = ubicacion.coords.latitude
    let longitud = ubicacion.coords.longitude
    let key="e18ead90bc9063e8b5955f2c41706c20"

const clima = document.createElement('div')
clima.classList.add('item')

    fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${key}&units=metric&lang=es`)
    .then(response=> response.json())
    .then(data=>{
            clima.innerHTML =`<div class="clima">
                                    <p>Gracias por visitarnos desde ${data.name} :)</p>
                                    <p>La temperatura actual en tu ubicación es ${data.main.temp}°. Ideal para festejar tu cumpleaños!!</p>
                                    </div>`
            document.body.append(clima)
                })
}


navigator.geolocation.getCurrentPosition(mostrar_ubicacion)
