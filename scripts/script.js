const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footerCart = document.getElementById('shopping-footer');

const templateCard = document.getElementById('template-card').content;
const templateCart = document.getElementById('template-cart').content;
const templateFooter = document.getElementById('template-fcart').content;

const fragment = document.createDocumentFragment();
let cart = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
        domCard()
    }
});
cards.addEventListener('click', e =>{
    addCart(e)
})
items.addEventListener('click', e => {
    inDe(e)
})


const fetchData = async () => {
    try {
        const res = await fetch('./json/datos.json');
        const data = await res.json();
        paintCard(data);
    } catch (error) {
        console.log(error);
    };
};

const paintCard = data => {
    data.forEach(product =>{
        templateCard.querySelector('.scat-price-js').textContent = product.price;
        templateCard.querySelector('p').textContent = product.model;
        templateCard.querySelector('.button').dataset.id = product.id;
        templateCard.querySelector('.sca-img-data').setAttribute('src', product.img);
        templateCard.querySelector('.sca-img').setAttribute('src', product.img);
        const cloneCards = templateCard.cloneNode(true);
        fragment.appendChild(cloneCards);
    })  
    cards.appendChild(fragment);

};

const addCart = e =>{
    // console.log(e.target)
    // console.log(e.target.classList.contains('button'))
    if(e.target.classList.contains('button')){
        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCart = objet =>{
    const article = {
        id: objet.querySelector('.button').dataset.id,
        img: objet.querySelector('.sca-img-data').getAttribute('src'),
        model: objet.querySelector('p').textContent,
        price: objet.querySelector('.scat-price-js').textContent,
        amount: 1
    }
    if(cart.hasOwnProperty(article.id)){
        article.amount = cart[article.id].amount + 1
    }
    cart[article.id] = {...article}
    // console.log(cart)
    domCard()

}

const domCard = () =>{
    // console.log(cart)
    items.innerHTML = ''
    Object.values(cart).forEach(product => {
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

    paintCardFooter()

    localStorage.setItem('cart', JSON.stringify(cart))
}

const paintCardFooter = () => {
    footerCart.innerHTML = ``;
    if (Object.keys(cart).length === 0) {
        footerCart.innerHTML = `
        <div class="ss-articles-text">
            <div class="ssa-text-title ssa-text-title">Tu carrito está vacío</div>
            <div class="ssa-text-title ssa-text-sub_title">¡Los mejores productos tecnológicos te esperan! </div>          
        </div>
        `
        return
    }

    const tprice = Object.values(cart).reduce((acc,{amount, price}) => acc + amount * price,0)
    // console.log(tprice)
    templateFooter.querySelector('span').textContent = tprice;
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footerCart.appendChild(fragment)

    const cleanCart = document.getElementById('shopping-clean')
    cleanCart.addEventListener('click',() =>{
        cart = {}
        domCard()
    })


}

const inDe = e => {
    if(e.target.classList.contains('aggregate-more')){
        console.log(cart[e.target.dataset.id])
        const product = cart[e.target.dataset.id]
        product.amount++
        cart[e.target.dataset.id] = {...product}
        domCard()
    }
    if(e.target.classList.contains('aggregate-reduce')){
        const product = cart[e.target.dataset.id]
        product.amount--
        if(product.amount === 0){
            delete cart[e.target.dataset.id]
        }
        domCard()
    }
    e.stopPropagation()
}

