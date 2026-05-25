$(function () {
  const products = [
    {
      id: 1,
      name: "Sencha Verde",
      price: 29.90,
      tag: "chá verde",
      image: "https://images.pexels.com/photos/17719788/pexels-photo-17719788.jpeg?auto=compress&cs=tinysrgb&w=1200",
      description: "Perfil leve, fresco e equilibrado. Ideal para começar o dia com suavidade e clareza."
    },
    {
      id: 2,
      name: "Bourbon Especial",
      price: 32.90,
      tag: "café especial",
      image: "https://images.pexels.com/photos/19825164/pexels-photo-19825164.jpeg?auto=compress&cs=tinysrgb&w=1200",
      description: "Café encorpado com aroma marcante e finalização aveludada para uma pausa mais intensa."
    },
    {
      id: 3,
      name: "Limão & Hortelã",
      price: 27.90,
      tag: "chá gelado",
      image: "https://images.pexels.com/photos/28948772/pexels-photo-28948772.jpeg?auto=compress&cs=tinysrgb&w=1200",
      description: "Refrescância equilibrada com acidez delicada, ideal para tardes quentes e dias leves."
    },
    {
      id: 4,
      name: "Assam Premium",
      price: 35.90,
      tag: "linha premium",
      image: "https://images.pexels.com/photos/20013054/pexels-photo-20013054.jpeg?auto=compress&cs=tinysrgb&w=1200",
      description: "Chá preto de presença elegante, sabor profundo e aroma sofisticado para consumo diário."
    }
  ];

  const cart = new Map();

  const money = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const openCart = () => {
    $(".cart-drawer").addClass("is-open").attr("aria-hidden", "false");
    $(".cart-overlay").addClass("is-active");
  };

  const closeCart = () => {
    $(".cart-drawer").removeClass("is-open").attr("aria-hidden", "true");
    $(".cart-overlay").removeClass("is-active");
  };

  const findProduct = (id) => products.find((product) => product.id === Number(id));

  const cartCount = () => {
    let count = 0;
    cart.forEach((item) => {
      count += item.qty;
    });
    return count;
  };

  const subtotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.qty;
    });
    return total;
  };

  const renderProducts = () => {
    const html = products
      .map(
        (product) => `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
              <strong>${money(product.price)}</strong>
              <button class="add-btn js-add-to-cart" type="button" data-id="${product.id}">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join("");

    $(".products-grid").html(html);
  };

  const renderCart = () => {
    const items = Array.from(cart.values());

    if (!items.length) {
      $(".js-cart-items").html(`
        <div class="cart-empty">
          Seu carrinho está vazio.
          Adicione um produto para montar seu pedido.
        </div>
      `);
    } else {
      $(".js-cart-items").html(
        items
          .map(
            (item) => `
            <article class="cart-item" data-id="${item.id}">
              <img src="${item.image}" alt="${item.name}" />
              <div>
                <h4>${item.name}</h4>
                <p>${money(item.price)} cada</p>

                <div class="cart-item-bottom">
                  <div class="qty-controls">
                    <button type="button" class="js-decrease" aria-label="Diminuir">−</button>
                    <span>${item.qty}</span>
                    <button type="button" class="js-increase" aria-label="Aumentar">+</button>
                  </div>

                  <button type="button" class="remove-link js-remove-item">Remover</button>
                </div>
              </div>
            </article>
          `
          )
          .join("")
      );
    }

    const total = subtotal();
    $(".js-subtotal").text(money(total));
    $(".js-total").text(money(total));

    const count = cartCount();
    $(".js-cart-count").text(count);
    $(".js-cart-count-mobile").text(count);
  };

  const addToCart = (id) => {
    const product = findProduct(id);
    if (!product) return;

    if (cart.has(product.id)) {
      const current = cart.get(product.id);
      current.qty += 1;
      cart.set(product.id, current);
    } else {
      cart.set(product.id, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }

    renderCart();
    openCart();
  };

  const changeQty = (id, delta) => {
    const item = cart.get(Number(id));
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
      cart.delete(Number(id));
    } else {
      cart.set(Number(id), item);
    }

    renderCart();
  };

  const clearCart = () => {
    cart.clear();
    renderCart();
  };

  renderProducts();
  renderCart();

  $(".js-open-cart").on("click", openCart);
  $(".js-close-cart, .cart-overlay").on("click", closeCart);

  $(document).on("click", ".js-add-to-cart", function () {
    addToCart($(this).data("id"));
  });

  $(document).on("click", ".js-increase", function () {
    const id = $(this).closest(".cart-item").data("id");
    changeQty(id, 1);
  });

  $(document).on("click", ".js-decrease", function () {
    const id = $(this).closest(".cart-item").data("id");
    changeQty(id, -1);
  });

  $(document).on("click", ".js-remove-item", function () {
    const id = $(this).closest(".cart-item").data("id");
    cart.delete(Number(id));
    renderCart();
  });

  $(".js-clear-cart").on("click", clearCart);

  $("#phone").mask("(00) 00000-0000");
  $("#zip").mask("00000-000");

  $("#checkoutForm").validate({
    rules: {
      name: {
        required: true,
        minlength: 3
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true,
        minlength: 14
      },
      zip: {
        required: true,
        minlength: 9
      },
      address: {
        required: true,
        minlength: 6
      },
      payment: {
        required: true
      }
    },
    messages: {
      name: {
        required: "Informe seu nome completo.",
        minlength: "Digite pelo menos 3 caracteres."
      },
      email: {
        required: "Informe seu e-mail.",
        email: "Use um e-mail válido."
      },
      phone: {
        required: "Informe seu telefone.",
        minlength: "Use o formato (11) 99999-9999."
      },
      zip: {
        required: "Informe o CEP.",
        minlength: "Use o formato 00000-000."
      },
      address: {
        required: "Informe o endereço de entrega.",
        minlength: "Digite um endereço completo."
      },
      payment: {
        required: "Escolha uma forma de pagamento."
      }
    },
    submitHandler: function (form) {
      if (!cart.size) {
        $(".js-form-feedback")
          .text("Adicione pelo menos um produto ao carrinho antes de finalizar.")
          .css("color", "#9c4f42");
        openCart();
        return false;
      }

      const total = money(subtotal());

      $(".js-form-feedback")
        .text(`Pedido validado com sucesso. Total do carrinho: ${total}.`)
        .css("color", "#4f6754");

      clearCart();
      form.reset();
      $("#checkoutForm").validate().resetForm();

      return false;
    }
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeCart();
  });
});