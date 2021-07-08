function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  //
}

function createCartItemElement({ id: sku, title: name, base_price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const jogaNoCarrin = (event) => {
  const clicado = event.target.parentElement;
  console.log(clicado);
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(clicado)}`)
    .then((retorno) => retorno.json())
    .then((produto) => createCartItemElement(produto))
    .then((lista) => document.querySelector('.cart__items').appendChild(lista));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', jogaNoCarrin);

  return section;
}
// add itens no site.
const forecheProduct = (produtos) => produtos.forEach((produto) => {
  document.querySelector('.items').appendChild(createProductItemElement(produto));
});

const MimDeMercadoLivre = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((retorno) => retorno.json())
  .then(({ results }) => results)
  .catch(() => alert('Consegui Não :('));

window.onload = () => {
  MimDeMercadoLivre()
    .then((arrayProdutos) => forecheProduct(arrayProdutos))
    .catch((erro) => alert(erro));
};
