let valorDoCarrinho = 0;
const pegaOl = () => document.querySelector('.cart__items');

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

const updateStorage = () => {
  const lista = pegaOl();
  localStorage.setItem('lista', lista.innerHTML);
};

const appendCartItem = (item) => {
  const ol = pegaOl();
  ol.appendChild(item);
  updateStorage();
};

const appendValor = (valor) => {
  document.querySelector('.total-price')
    .innerText = valor;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  let valorDoClicado = event.target.id;
  valorDoClicado = parseFloat(valorDoClicado).toFixed(2);
  valorNoCarrin(valorDoClicado, '-')
    .then((subtraido) => appendValor(subtraido));
  updateStorage();
}

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

const jogaNoCarrin = (event) => {
  const clicado = event.target.parentElement;
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(clicado)}`)
    .then((retorno) => retorno.json())
    .then((produto) => createCartItemElement(produto))
    .then((lista) => {
      appendCartItem(lista);
    });
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

const forEacheProduct = (produtos) => produtos.forEach((produto) => {
  document.querySelector('.items').appendChild(createProductItemElement(produto));
});

const MimDeMercadoLivre = () => {
  const loading = '<img class="loading" src="image/loading.gif">';
  document.querySelector('.items').innerHTML = loading;
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((retorno) => retorno.json())
    .then(({ results }) => {
      document.querySelector('.items').innerHTML = '';
      return results;
    })
    .catch(() => alert('Consegui Não :('));
};

const limpaCarrin = () => {
  valorNoCarrin()
    .then((valor) => {
      appendValor(valor);
    });
    const ol = pegaOl();
    while (ol.firstChild) {
      ol.removeChild(ol.lastChild);
    }
    updateStorage();
};

const readLocalStorage = () => {
  const listaStorage = localStorage.getItem('lista');
  pegaOl().innerHTML = listaStorage;
};

window.onload = () => {
  MimDeMercadoLivre()
    .then((arrayProdutos) => forEacheProduct(arrayProdutos))
    .catch((erro) => alert(erro));
    document.querySelector('.empty-cart').addEventListener('click', limpaCarrin);
    document.querySelector('.total-price')
    .innerText = 0;
    readLocalStorage();
};
