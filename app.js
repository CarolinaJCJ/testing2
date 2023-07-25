const botonVaciar = document.getElementById('vaciar-carrito')
const precioTotal = document.getElementById('precioTotal');

let carrito = [];

leerArchivo();
actualizarCarrito();

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('shop-body')) {
    carrito = JSON.parse(localStorage.getItem('shop-body'))
    actualizarCarrito()
  }
})

document.getElementById('btnBuscar').addEventListener('click', function () {
  let busqueda = document.getElementById('busqueda').value;
  let productos = getProductos();
  let filtro_producto = productos.filter((item) => item.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  if (filtro_producto.length === 0 || filtro_producto === undefined) {
    alert('Producto no encontrado');
  } else {

    let contenidoHtml = '';
    filtro_producto.forEach((p) => {
      contenidoHtml += `<div id="caja_${p.id}" class="caja-producto">`;
      contenidoHtml += `<div class="product-image"><img src="${p.img}" alt="image" /></div>`;
      contenidoHtml += `<div class="product-title">${p.nombre}</div>`;
      contenidoHtml += `<div class="product-description">${p.desc}</div>`;
      contenidoHtml += `<div class="product-price">${formatMoney(p.precio)}</div>`;
      contenidoHtml += `<div class="product-button"><div class="btn-agregar">Agregar al carrito</div></div>`;
      contenidoHtml += `</div>`;
    });

    document.getElementsByClassName('shop-body')[0].innerHTML = contenidoHtml;

    let els = document.getElementsByClassName('btn-agregar')
    Array.from(els).forEach((el) => {
      el.addEventListener('click', function () {
        swal.fire({ icon: "success", title: "Exito!", text: "Se agrego al carrito" })
      });
    });
  }

});
///

const respuesta = (productosAgregar) => {
  const existe = carrito.some((prod) => prod.id === productosAgregar);

  if (existe) {
    carrito.forEach((prod) => {
      if (prod.id === productosAgregar.id) {
        prod.cantidad++;
        prod.subtotal = prod.precio * prod.cantidad;
        return prod;
      }
    });
  } else {
    //const item = getProductos().find((prod) => prod.id === productosAgregar);
    carrito.push(productosAgregar); 
  }

  localStorage.setItem('shop-body', JSON.stringify(carrito));
  actualizarCarrito();
};


let compras = document.getElementById("boton-carrito")
compras.addEventListener("click", respuesta)

//
function cargarProductosEnLaPagina() {

  let productos = getProductos();
  let contenidoHtml = '';
  productos.forEach(p => {
    //JSON.stringify(p,null,2)
    contenidoHtml += `<div id="caja_${p.id}" class="caja-producto">
                            <div class="product-image"><img src="${p.img}" alt="image" /></div>
                            <div class="product-title">${p.nombre}</div>
                            <div class="product-description">${p.desc}</div>
                            <div class="product-price">${formatMoney(p.precio)}</div>
                            <div class="product-button"><button id="${p.id}" class="btn-agregar">Agregar al carrito</button></div>
                          </div>`
  });

  document.getElementsByClassName('shop-body')[0].innerHTML = contenidoHtml;

  let els = document.getElementsByClassName('btn-agregar')
  Array.from(els).forEach((el) => {
    el.addEventListener('click', function () {
      console.log(el.id);
      carrito.push(getProductos().find(product => product.id === Number(el.id)))
      console.log(carrito);
      actualizarCarrito()
      swal.fire({ icon: "success", title: "Exito!", text: "Se agrego al carrito" })
    });
  });

}

function formatMoney(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
function getProductos() {
  return JSON.parse(localStorage.getItem('basedatos'));
}

function leerArchivo() {
  //Busqueda
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {

      localStorage.setItem('basedatos', JSON.stringify(data));
      cargarProductosEnLaPagina();

    })
    .catch(error => {

      console.error('Error al cargar el archivo JSON:', error);
    });

}

function actualizarCarrito() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartItemCount = document.querySelector('.cart-item-count');


 /* function calcularTotal() {
    let total = carrito.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0);
    // console.log(total);

    precioTotal.innerHTML = `Total a Pagar: $ ${total}`;
}*/

  const reduceCarrito = carrito.reduce((newCarrito, nextProduct) => {

//    const total = carrito.reduce((newCarrito, productos) => newCarrito + productos.nextProduct, 0) 
    const searchProduct = newCarrito.find(p => p.id === nextProduct.id);
    if (searchProduct) {
      searchProduct.cantidad += 1;
    } else {
      newCarrito.push(nextProduct);
    }
    return newCarrito;
  }, []);
  
  carrito = reduceCarrito


  if (carrito.length === 0) {
  
    cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
  } else {

    let contenidoHtml = '';
    carrito.forEach((item) => {
      contenidoHtml += `<div class="cart-item">`;
      contenidoHtml += `<img src="${item.img}" alt="image" class="cart-item-image" />`;
      contenidoHtml += `<div class="cart-item-details">`;
      contenidoHtml += `<p class="cart-item-title">${item.nombre}</p>`;
      contenidoHtml += `<p class="cart-item-price">${formatMoney(item.precio)}</p>`;
      contenidoHtml += `<p class="cart-item-quantity">Cantidad: ${item.cantidad}</p>`;
      contenidoHtml += `</div>`;
      contenidoHtml += `</div>`;
    });


    cartItemsContainer.innerHTML = contenidoHtml;

    cartItemCount.textContent = carrito.length;
  }
  precioTotal.innerHTML = `Total a Pagar: $ ${total}`;
}


const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');

btnVaciarCarrito.addEventListener('click', vaciarCarrito);
function vaciarCarrito() {
  carrito = [];

localStorage.removeItem('shop-body');

actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem('shop-body');
  actualizarCarrito();
}

Swal.fire({
  title: 'Bienvenido!',
  text: '',
  imageUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnh3Ynl1MjYzczJhNmowcWxkcDJwZnZieWo0bzd0NXA0d3Yyd3lycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4AlRnuga8EJOM/giphy.gif',
  imageWidth: 200,
  imageHeight: 300,
  imageAlt: 'Custom image',
})

function formatMoney(number) {
    if (typeof number !== 'number') {
      return "Invalid Number";
    }
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

