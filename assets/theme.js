$(document).ready(function () {
  $('.product__quantity-btn').on('click', function (e) {
    e.preventDefault();

    if ($(this).hasClass('product__quantity-plus')) {
      $(this)
        .siblings('.product__quantity-input')
        .val(parseInt($(this).siblings('.product__quantity-input').val()) + 1);
    } else {
      if (
        $(this).closest('.product').length &&
        parseInt($(this).siblings('.product__quantity-input').val()) == 1
      ) {
        return;
      }
      $(this)
        .siblings('.product__quantity-input')
        .val(parseInt($(this).siblings('.product__quantity-input').val()) - 1);
    }

    if ($(this).closest('.basket__side').length) {
      var product = $(this).closest('.basket__product');

      var data = {
        id: $(this).closest('.basket__product').data('variant-id'),
        quantity: parseInt($(this).siblings('input').val()),
      };

      if (parseInt($(this).siblings('.product__quantity-input').val())) {
        updateBasket('change', data, function (response) {
          $('.basket__subtotal-price').text(
            Shopify.formatMoney(response.total_price, '₴{{amount}}')
          );
          var productUpdated = response.items.find(function ({ id }) {
            return id == data.id;
          });
          product
            .find('.basket__product-price')
            .text(
              Shopify.formatMoney(
                productUpdated.final_line_price,
                '₴{{amount}}'
              )
            );
        });
      } else {
        updateBasket('change', data, function (response) {
          $('.basket__subtotal-price').text(
            Shopify.formatMoney(response.total_price, '₴{{amount}}')
          );
          product.remove();
        });
      }
    }
  });

  function updateBasket(method, data, cb) {
    console.log(method, 'item in the cart, id:', data.id);
    $.ajax({
      url: '/cart/' + method + '.js',
      type: 'post',
      dataType: 'json',
      data,
    }).done(function (response) {
      cb(response);
    });
  }

  $('.basket').on('click', function (e) {
    e.preventDefault();
    $(this).addClass('basket_active');
  });

  $(document).on('click', function (e) {
    if (
      $(e.target).hasClass('basket_active') ||
      $(e.target).hasClass('basket__header-close')
    ) {
      $('.basket_active').removeClass('basket_active');
    }
  });

  $('.basket__header-close').on('click', function () {
    $('.basket_active').removeClass('basket_active');
  });

  $('.burger').on('click', function () {
    $('.nav').addClass('nav_active');
  });

  $('.nav__close').on('click', function () {
    $('.nav').removeClass('nav_active');
  });

  $('.single-option-selector').addClass('product__option-select');

  $('.product__slider-main').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: '.product__slider-sub',
  });
  $('.product__slider-sub').slick({
    slidesToShow: 8,
    slidesToScroll: 8,
    asNavFor: '.product__slider-main',
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  });
});
