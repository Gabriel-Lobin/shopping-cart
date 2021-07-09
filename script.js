let valorDoCarrinho = 0;
const valorNoCarrin = (price, operador) => new Promise((resolve, reject) => {
  if (!price) {
    valorDoCarrinho = 0;
  } if (operador === '+') {
    valorDoCarrinho += price;
  } if (operador === '-') {
    valorDoCarrinho -= price;
  }
  resolve(valorDoCarrinho);
  reject();
});

const appendCartItem = (item) => {
  document.querySelector('.cart__items').appendChild(item);
};

const appendValor = (valor) => {
  document.querySelector('.total-price')
    .innerText = valor;
};

// pega o id do produto clicado
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// função para o escutador do item no carrinho
function cartItemClickListener(event) {
  event.target.remove();
  let valorDoClicado = event.target.id;
  valorDoClicado = parseFloat(valorDoClicado).toFixed(2);
  valorNoCarrin(valorDoClicado, '-')
  .then((subtraido) => appendValor(subtraido));
}
// cria os elementos para o carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  valorNoCarrin(salePrice, '+')
    .then((valor) => {
      appendValor(valor);
    }).catch((erro) => {
      console.log(erro);
    });
  li.id = salePrice;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// coloca o item no carrinho de compras.
const jogaNoCarrin = (event) => {
  const clicado = event.target.parentElement;
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(clicado)}`)
    .then((retorno) => retorno.json())
    .then((produto) => createCartItemElement(produto))
    .then((lista) => {
      appendCartItem(lista);
    });
};
// cria os elementos para o produto
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
// pedindo array para o api mercado livre
const MimDeMercadoLivre = () => {
  const loading = '<div class="loading">Loading</div>';
  document.querySelector('.items').innerHTML = loading;
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((retorno) => retorno.json())
    .then(({ results }) => {
      document.querySelector('.items').innerHTML = '';
      return results;
    })
    .catch(() => alert('Consegui Não :('));
};
// limpar o carrinho de compras
const limpaCarrin = () => {
  valorNoCarrin()
    .then((valor) => {
      appendValor(valor);
    });
  const ol = document.querySelector('.cart__items');
  while (ol.firstChild) {
    ol.removeChild(ol.lastChild);
  }
};

const confirmStorage = () => {
  const localStorageCarrin = localStorage.getItem('listaCarrinho');
  if (localStorageCarrin) {
    localStorage.forEach((item) => createCartItemElement(item)
      .then((lista) => appendCartItem(lista)));
  }
};

window.onload = () => {
  MimDeMercadoLivre()
    .then((arrayProdutos) => forecheProduct(arrayProdutos))
    .catch((erro) => alert(erro));
  confirmStorage();
  document.querySelector('.empty-cart').addEventListener('click', limpaCarrin);
  document.querySelector('.total-price')
    .innerText = `Preço Total:${0}`;
};
