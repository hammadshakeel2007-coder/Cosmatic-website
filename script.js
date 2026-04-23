 (function(){
      "use strict";

      // ---------- PRODUCT DATA (9 products, all free images from Pexels, all unique) ----------
      const products = [
        {
          id: 1,
          name: "Velvet Matte Lipstick",
          desc: "Creamy, long-lasting color",
          price: 24.99,
          img: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
        {
          id: 2,
          name: "Dewy Skin Tint",
          desc: "Lightweight foundation serum",
          price: 32.50,
          img: "https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
        {
          id: 3,
          name: "Rose Quartz Roller",
          desc: "Facial massage & de-puff",
          price: 19.99,
          img: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
        {
          id: 4,
          name: "Nourishing Mascara",
          desc: "Volume + lash care",
          price: 22.00,
          img: "https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
        {
          id: 5,
          name: "Hydrating Face Mist",
          desc: "With aloe & rose water",
          price: 18.50,
          img: "https://images.pexels.com/photos/7262958/pexels-photo-7262958.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
        {
          id: 6,
          name: "Silk Eyeshadow Palette",
          desc: "9 buttery matte & shimmer",
          price: 42.00,
          img: "https://images.pexels.com/photos/1749452/pexels-photo-1749452.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
        // ---- THREE NEW PRODUCTS (free accurate images) ----
        {
          id: 7,
          name: "Midnight Serum",
          desc: "Hyaluronic + vitamin C glow",
          price: 38.99,
          img: "https://images.pexels.com/photos/4612160/pexels-photo-4612160.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
        },
  
      ];

      // ---------- CART STATE ----------
      let cart = [];

      // DOM elements
      const productsContainer = document.getElementById('productsContainer');
      const cartCountSpan = document.getElementById('cart-count');
      const cartItemsList = document.getElementById('cartItemsList');
      const cartTotalSpan = document.getElementById('cartTotal');
      const cartToggle = document.getElementById('cartToggle');
      const cartOverlay = document.getElementById('cartOverlay');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const checkoutBtn = document.getElementById('checkoutBtn');
      const shopNowBtn = document.getElementById('shopNowBtn');

      // Helper: update UI
      function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;

        if (cart.length === 0) {
          cartItemsList.innerHTML = `<div style="text-align:center; padding:2rem; color:#b7a29b;"><i class="fas fa-spa" style="font-size:2.5rem; opacity:0.6;"></i><p style="margin-top:1rem;">Your bag is empty</p></div>`;
        } else {
          let html = '';
          cart.forEach(item => {
            html += `
              <div class="cart-item" data-id="${item.id}">
                <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                  <div class="cart-item-title">${item.name}</div>
                  <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                  <button class="qty-btn decrease-qty" data-id="${item.id}">−</button>
                  <span style="min-width:20px; text-align:center;">${item.quantity}</span>
                  <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
                  <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            `;
          });
          cartItemsList.innerHTML = html;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
      }

      function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        document.body.classList.add('cart-open');
      }

      function removeCartItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
      }

      function updateQuantity(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
          removeCartItem(id);
        } else {
          item.quantity = newQty;
          updateCartUI();
        }
      }

      function renderProducts() {
        let productsHtml = '';
        products.forEach(prod => {
          productsHtml += `
            <div class="product-card">
              <img class="product-img" src="${prod.img}" alt="${prod.name}" loading="lazy">
              <div class="product-name">${prod.name}</div>
              <div class="product-desc">${prod.desc}</div>
              <div class="product-footer">
                <span class="price">$${prod.price.toFixed(2)}</span>
                <button class="add-btn" data-id="${prod.id}" data-name="${prod.name}" data-price="${prod.price}" data-img="${prod.img}" data-desc="${prod.desc}">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          `;
        });
        productsContainer.innerHTML = productsHtml;

        document.querySelectorAll('.add-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = Number(btn.dataset.id);
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const img = btn.dataset.img;
            const desc = btn.dataset.desc;
            addToCart({ id, name, price, img, desc });
          });
        });
      }

      cartItemsList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = target.dataset.id ? Number(target.dataset.id) : null;
        if (!id) return;

        if (target.classList.contains('increase-qty')) {
          updateQuantity(id, 1);
        } else if (target.classList.contains('decrease-qty')) {
          updateQuantity(id, -1);
        } else if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
          removeCartItem(id);
        }
      });

      function openCart() { document.body.classList.add('cart-open'); }
      function closeCart() { document.body.classList.remove('cart-open'); }

      cartToggle.addEventListener('click', openCart);
      closeCartBtn.addEventListener('click', closeCart);
      cartOverlay.addEventListener('click', closeCart);

      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          alert('✨ Your bag is empty. Add some midnight magic!');
        } else {
          alert('🌙 Thank you for shopping! Demo by Hammad Developer · Dark theme');
        }
      });

      shopNowBtn.addEventListener('click', () => {
        document.querySelector('.section-title').scrollIntoView({ behavior: 'smooth' });
      });

      // Initialize
      renderProducts();
      updateCartUI();

      // body scroll lock
      const observer = new MutationObserver(() => {
        document.body.style.overflow = document.body.classList.contains('cart-open') ? 'hidden' : '';
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    })();