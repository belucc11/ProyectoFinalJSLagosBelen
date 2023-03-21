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

function agregarProducto(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-agregar-carrito')) {
        const seleccionarProducto = e.target.parentElement; 
        identificarProducto(seleccionarProducto);
    }
    
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
    loadHtml();
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
    loadHtml();
    
}

function loadHtml(){
    clearHtml();
    carrito.forEach(producto => {
        const {imagen, nombre, precio, cantidad, id} = producto;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${imagen}" alt="">
            <div class="item-content">
                <h5>${nombre}</h5>
                <h5 class="cart-price">$${precio}</h5>
                <h6>Cantidad: ${cantidad}</h6>
            </div>
            <span class="borrar-producto" data-id="${id}">X</span>
            `;

        productosCarrito.appendChild(row);

        precioTotal.innerHTML = totalCarrito;

        cantidadProductos.innerHTML = contarProductos;
    });
}
 function clearHtml(){
    productosCarrito.innerHTML = '';
 }

