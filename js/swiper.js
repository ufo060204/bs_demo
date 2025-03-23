// 初始化表單頁影片輪播 Swiper
function initVideoSwiper() {
  const swiperElement = document.querySelector(".video-swiper");

  if (!swiperElement) return;

  const videoSwiper = new Swiper(swiperElement, {
    slidesPerView: 1, // 一次顯示幾個輪播
    spaceBetween: 10, // 輪播之間的間距(px)
    loop: false, // 循環滾動
    direction: "horizontal", // 水平滑動(默認)或垂直滑動 'vertical'
    speed: 300, // 默認300毫秒
    lazy: {
      loadPrevNext: true, // 提前加載前後輪播
    },
    // 滑鼠滾輪控制
    mousewheel: {
      enabled: false, // 啟用滑鼠滾輪控制
      invert: false, // 反向滾動
      sensitivity: 1, // 滾輪滾動速度
      releaseOnEdges: true, // 滑到邊緣時釋放滾動事件
    },
    // 鍵盤控制
    keyboard: {
      enabled: false, // 啟用鍵盤控制
      onlyInViewport: true, // 只有當 Swiper 在視口中時才能控制
    },
    // 分頁器
    pagination: {
      el: ".video-swiper-pagination",
      type: "bullets",
      clickable: true, // 可點擊
      dynamicBullets: true, // 動態顯示分頁器
    },
    // 導航按鈕
    navigation: {
      nextEl: ".video-swiper-button-next",
      prevEl: ".video-swiper-button-prev",
    },
    // 滾動條
    // scrollbar: {
    //   el: '.video-swiper-scrollbar',
    //   draggable: true, // 可拖動
    // },

    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 20,
        mousewheel: {
          enabled: true, // 啟用滑鼠滾輪控制
        },
        // 鍵盤控制
        keyboard: {
          enabled: true, // 啟用鍵盤控制
        },
      },
    },
    on: {
      slideChange: function () {
        // 在滑動改變時暫停所有播放器
        pauseAllPlayers();
      },
      sliderMove: function () {
        // 在滑動過程中暫停所有播放器
        pauseAllPlayers();
      },
    },
  });
}

