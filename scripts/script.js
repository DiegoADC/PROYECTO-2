// Constantes para detectar donde se crearán las cajas
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footerCart = document.getElementById('shopping-footer');
// Constantes para detectar los templates
const templateCard = document.getElementById('template-card').content;
const templateCart = document.getElementById('template-cart').content;
const templateFooter = document.getElementById('template-fcart').content;
// fragment que ocuparemos para crear elementos en el HTML
const fragment = document.createDocumentFragment();
// Array donde se introducirá los artículos seleccionados
let cart = {}

// EventListeners

// EventListener espera que el HTML este cargado para evitar errores, llama a la función fetchdata y inicia el LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    // llamamos a la función fetchData para que empiece a cargar el JSON
    fetchData();
    // pregunta si existe "cart" en el localStorag
    if(localStorage.getItem('cart')){
        // Si existe, recuperamos la información que esta guardada pero como esta en strig(JSON) lo convertimos a un objeto de javaScript y llamamos a la función “domCart”
        cart = JSON.parse(localStorage.getItem('cart'))
        domCard()
    }
});

// llamamos a la constate "cards" y cuando detecte el evento "click", llamamos a la función addCart y le pasamos el parámetro “e”
cards.addEventListener('click', e =>{
    addCart(e)
})

items.addEventListener('click', e => {
    // llamamos a la constate "items" y cuando detecte el evento "click", llamamos a la función inDe y le pasamos el parámetro “e”
    inDe(e)
})

// obtenemos los datos del json en una funcion async (asincrona)
const fetchData = async () => {
    // hacemos un bloque try para verificar que todo salió bien y si no pasamos un catch(error) y lo mostramos en consola
    try {
        // Pasamos el json y lo volvemos una promesa que el await lo resolver
        const res = await fetch('./json/datos.json');
        // transformamos el json a un objeto, que lo volvemos un promesa que el await lo resolver
        const data = await res.json();
        // llamamos a la funcion "paintCart" y le pasamos los datos
        paintCard(data);
    } catch (error) {
        console.log(error);
    };
};

// Creaamos las cards dinamicamente apartir de la informacion del (JSON)
const paintCard = data => {
    // recibimos los datos y los recorremos con el forEach
    data.forEach(product =>{
        // creamos los las cards apartir del template y los datos del json, el texto los id y el src de las imagenes
        templateCard.querySelector('.scat-price-js').textContent = product.price;
        templateCard.querySelector('p').textContent = product.model;
        templateCard.querySelector('.button').dataset.id = product.id;
        templateCard.querySelector('.sca-img-data').setAttribute('src', product.img);
        templateCard.querySelector('.sca-img').setAttribute('src', product.img);
        // clonamos las cards 
        const cloneCards = templateCard.cloneNode(true);
        // llamos a fragment y le decimos los templates los cree dentro del elemento padre
        fragment.appendChild(cloneCards);
    })  
    // llamos a card que va ser donde se van a pintar las cards y que los pinte dentro del elemento
    cards.appendChild(fragment);

};

// hacemos una verificacion para agregar los elementos al carrito
const addCart = e =>{
    // Preguntamos si elemento que seleccionamos tiene la clase "button" 
    if(e.target.classList.contains('button')){
        // llamamos a setCart y le pasamos los valores padre del elemento
        setCart(e.target.parentElement)
    }
    // detiene la propagacion de los elementos que no se necesitan
    e.stopPropagation()
}

// obtenemos los datos que se generaron en el json y los agregamos en un array para el los articulos que se seleccinaron
const setCart = objet =>{
    // creamos un array que obtiene los valores del los elementos que seleccionemos
    const article = {
        id: objet.querySelector('.button').dataset.id,
        img: objet.querySelector('.sca-img-data').getAttribute('src'),
        model: objet.querySelector('p').textContent,
        price: objet.querySelector('.scat-price-js').textContent,
        amount: 1
    }

    // agregar catidad a los productos
    // preguntamos si en el array cart tiene la const article.id
    if(cart.hasOwnProperty(article.id)){
        // si lo tiene agregamos 1 
        article.amount = cart[article.id].amount + 1
    }
    // ahora cart lo transformamos en una lista, lo cual podremos pasarle los datos a una función
    cart[article.id] = {...article}
    // ahora que ya tenemos los datos llamamos a domCard para que lo pinte
    domCard()

}

// Pinta los artículos agregados en el carrito y guarda los datos en el localStorage
const domCard = () =>{
    // cada vez que pinte algún cambio, primero elimina todo, para evitar que se vaya acumulando
    items.innerHTML = ``
    // como debemos recorrer una lista dentro de un array debemos usar forEach, pero como cart esta en objeto y no lo podemos modificar con forEach por eso se hace primero un Object.values
    Object.values(cart).forEach(product => {
        // Seleccionamos donde están los templates y le pasa los datos del cart
        templateCart.querySelector('.articles-add-img').setAttribute('src', product.img)
        templateCart.querySelector('.articles-add-title').textContent = product.model
        templateCart.querySelector('.aggregate-reduce').dataset.id = product.id
        templateCart.querySelector('.aaddc-count-current').textContent = product.amount
        templateCart.querySelector('.aggregate-more').dataset.id = product.id
        templateCart.querySelector('.aa-price-js').textContent = product.amount * product.price
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    // Una vez que pintamos los productos en el carrito tenemos que pintar el footer del carrito por ello llamamos a paintCardFooter
    paintCardFooter()
    // Una vez que se pintan los artículos en el carrito los guardamos en el localStorage y el objeto cart lo convierte a JSON
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Footer del carrito con los artículos agregados (se comprueba si hay algún artículos, se suma la cantidad total de los artículos, se limpia el carrito)
const paintCardFooter = () => {
    // cada vez que pinte algún cambio, primero elimina todo, para evitar que se vaya acumulando
    footerCart.innerHTML = ``;
    // preguntamos si en cart existe algún objeto (si se ha agregado algún objeto) 
    if (Object.keys(cart).length === 0) {
        footerCart.innerHTML = `
        <div class="ss-articles-text">
            <div class="ssa-text-title ssa-text-title">Tu carrito está vacío</div>
            <div class="ssa-text-title ssa-text-sub_title">¡Los mejores productos tecnológicos te esperan! </div>          
        </div>
        `
        // sí es true se detiene la función
        return
    }
    // para obtener el total de los productos utilizamos reduce, pero como cart no es un array utilizamos Object.values, creamos una función flecha que le pasamos como parámetros un acumulador y los elementos de cart “amount y price”, sumamos los parámetros y lo devolvemos en un numero
    const tprice = Object.values(cart).reduce((acc,{amount, price}) => acc + amount * price,0)
    // pintamos el total del precio
    templateFooter.querySelector('span').textContent = tprice;
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footerCart.appendChild(fragment)

    // Limpiamos el carrito
    // seleccionamos el elemento
    const cleanCart = document.getElementById('shopping-clean')
    cleanCart.addEventListener('click',() =>{
        // sí se da click al elemento limpiamos cart
        cart = {}
        // llamamos a domCart para que lo contemple en el localStorage y se borre los artículos
        domCard()
    })
}
// Función para darle vida los botos de agregar o disminuir la cantidad de los productor en el carrito
const inDe = e => {
    // preguntamos si lo que seleccionamos contiene la clase “aggregate-more”
    if(e.target.classList.contains('aggregate-more')){
        // accedemos a nuestro objeto cart, pero le decimos que acceda al elemento que esta seleccionado por su id
        const product = cart[e.target.dataset.id]
        // En el cart le decimos que afecte a “amount” y sume 1 
        product.amount++
        // le decimos que sea una copia de “producto” así se guarda la cantidad aumentada y lo pasamos por spread operator como ya lo teníamos hecho
        cart[e.target.dataset.id] = {...product}
        // llamamos a domCart para que se pinte vuelva a pintar la cantidad
        domCard()
    }
    // preguntamos si lo que seleccionamos contiene la clase “aggregate-reduce”
    if(e.target.classList.contains('aggregate-reduce')){
        const product = cart[e.target.dataset.id]
        product.amount--
        // preguntamos si amount es igual a 0 para eliminarlo del carrito
        if(product.amount === 0){
            // elimina solo al objeto que tiene el índice seleccionado
            delete cart[e.target.dataset.id]
        }
        domCard()
    }
    // detiene la propagacion de los elementos que no se necesitan (que no están dentro de los if's)
    e.stopPropagation()
}

