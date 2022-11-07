const productContainer = document.getElementById('productContainer');
const pageContainer = document.getElementById('pageContainer');
const toPrevious = document.getElementById('toPrevious');
const toNext = document.getElementById('toNext');
const previousPage = document.getElementById('previousPage');
const nextPage = document.getElementById('nextPage');

async function renderProducts() {
  try {
    let data;
    if (location.href.split('?')[1]) {
      const query = location.href
        .split('?')[1]
        .split('&')
        .map((query) => query.split('='));
      let page = query.filter((q) => q[0] === 'page')[0];
      if (page) page = page[1];
      const category = query.filter((q) => q[0] === 'q')[0][1];
      console.log(page, category);
      if (category || page) {
        if (category && page) {
          data = await (
            await fetch(`/api/products?q=${category}&page=${page}`)
          ).json();
        } else if (category) {
          data = await (await fetch(`/api/products?q=${category}`)).json();
        } else if (page) {
          data = await (await fetch(`/api/products?page=${page}`)).json();
        }
      }
    } else {
      data = await (await fetch(`/api/products`)).json();
    }
    const {
      products,
      totalPage,
      currentPage,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
    } = data;
    products.forEach(renderProduct);
    if (totalPage === 1) return;
    if (hasNextPage) {
      if (location.search) {
        nextPage.href = `${location.href}&page=${nextPage}`;
      } else {
        nextPage.href = `${location.href}?page=${nextPage}`;
      }
      console.log(location);
      nextPage.href = location.pathname;
      toNext.classList.toggle('d-none');
    }
    if (hasPreviousPage) toPrevious.classList.toggle('d-none');
  } catch (err) {
    console.log(err);
  }
}

function renderProduct(product) {
  const productCard = `<div class="card mb-4 shadow-lg ms-5" style="width: 27%"><a href="/products/${
    product._id
  }" class="card-link">
    <img src="${
      product.imageUrl
    }" class="card-img-top thumbnail mt-2 rounded shadow-sm"/>
    <div class="card-body p-2">
      <h5 class="card-title mt-0 mb-2">${product.title}</h5>
      <div class="overflow-hidden" id="product-description">${
        product.description
      }</div>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item p-0 pb-2">${product.price.toLocaleString()}원</li>
    </ul>
    </a></div>`;
  productContainer.insertAdjacentHTML('beforeend', productCard);
}

renderProducts();
