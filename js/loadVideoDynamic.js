function initVideoSwiper() {
  var e = document.querySelector(".video-swiper");
  e &&
    new Swiper(e, {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: !1,
      direction: "horizontal",
      speed: 300,
      lazy: {
        loadPrevNext: !0,
      },
      mousewheel: {
        enabled: !1,
        invert: !1,
        sensitivity: 1,
        releaseOnEdges: !0,
      },
      keyboard: {
        enabled: !1,
        onlyInViewport: !0,
      },
      pagination: {
        el: ".video-swiper-pagination",
        type: "bullets",
        clickable: !0,
        dynamicBullets: !0,
      },
      navigation: {
        nextEl: ".video-swiper-button-next",
        prevEl: ".video-swiper-button-prev",
      },
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
            enabled: !0,
          },
          keyboard: {
            enabled: !0,
          },
        },
      },
      on: {
        slideChange: function () {
          pauseAllPlayers();
        },
      },
    });
}

// 播放器影片的物件，用來儲存所有創建的播放器
const players = {};

// 載入 YouTube IFrame API
function loadYouTubeAPI() {
  const videoSwiperSection = document.querySelector("#videoSwiperSection");
  if (!videoSwiperSection) return;

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// API 準備就緒時會自動調用
function onYouTubeIframeAPIReady() {
  console.log("YouTube API 已載入完成");
  // 初始化所有影片卡片
  initLoadVideo();
}

// 初始化所有影片卡片，添加點擊事件
function initLoadVideo() {
  const videoCards = document.querySelectorAll(".video-swiper__card");

  if (videoCards.length === 0) return;

  videoCards.forEach((card) => {
    const videoId = card.dataset.videoId;
    // 只添加點擊事件，不預先創建 iframe
    card.addEventListener("click", function () {
      // 隱藏遮罩並播放影片
      const videoImg = this.querySelector(".video-swiper__img");
      if (videoImg) videoImg.style.display = "none";

      const videoOverlay = this.querySelector(".video-swiper__overlay");
      if (videoOverlay) videoOverlay.style.display = "none";

      const videoBtn = this.querySelector(".video-swiper__btn");
      if (videoBtn) videoBtn.style.display = "none";

      // 檢查是否已經創建了播放器
      if (!this.querySelector(`[id="${videoId}"]`)) {
        // 創建播放器容器
        const playerContainer = document.createElement("div");
        playerContainer.id = videoId;

        // 將容器添加到卡片中
        this.appendChild(playerContainer);

        // 點擊時才創建播放器
        createPlayer(videoId, videoId);
      } else {
        // 如果播放器已經存在，則播放影片
        console.log("播放器已存在，準備播放影片", videoId);
        const player = players[videoId];

        if (player && typeof player.playVideo === "function") {
          player.playVideo();
        }
      }
    });
  });
}

// 創建 YouTube 播放器
function createPlayer(containerId, videoId) {
  // 暫停所有其他播放器
  pauseAllPlayers();

  // 創建播放器
  players[containerId] = new YT.Player(containerId, {
    height: "100%",
    width: "100%",
    videoId: videoId,
    playerVars: {
      autoplay: 1, // 自動播放
      controls: 1, // 顯示控制項
      rel: 0, // 不顯示相關影片
      playsinline: 1, // 在 iOS 設備上內嵌播放而非全屏
      fs: 1, // 顯示全屏
      mute: 1, // 預設靜音 (為了自動播放政策)
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 播放器準備就緒時的回調
function onPlayerReady(event) {
  // 播放器準備好後立即播放
  // event.target.mute().playVideo();
  event.target.playVideo();
  console.log("播放器準備就緒:", event.target.getVideoData());
}

// 播放器狀態改變時的回調
function onPlayerStateChange(event) {
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  const prev = document.querySelector(".video-swiper-button-prev");
  const next = document.querySelector(".video-swiper-button-next");
  const iframeGroup = document.querySelectorAll(".swiper-slide iframe");

  switch (event.data) {
    case YT.PlayerState.PLAYING:
      console.log("播放器播放中");
      iframeGroup.forEach((iframe) => {
        iframe.style.pointerEvents = "auto";
      });
      if (isSmallScreen) {
        if (prev) prev.style.display = "none";
        if (next) next.style.display = "none";
      }
      break;

    case YT.PlayerState.PAUSED:
      console.log("播放器暫停");
      pauseAllPlayers();
      iframeGroup.forEach((iframe) => {
        iframe.style.pointerEvents = "none";
      });
      if (isSmallScreen) {
        if (prev) prev.style.display = "block";
        if (next) next.style.display = "block";
      }
      break;

    // case YT.PlayerState.ENDED:
    //   console.log("播放結束");
    //   break;

    // case YT.PlayerState.BUFFERING:
    //   console.log("影片緩衝中");
    //   break;

    // case YT.PlayerState.CUED:
    //   console.log("影片已準備");
    //   break;

    default:
      console.log("未知狀態:", event.data);
      break;
  }
}

// 暫停所有播放器
function pauseAllPlayers() {
  Object.values(players).forEach((player) => {
    if (player && typeof player.pauseVideo === "function") {
      player.pauseVideo();
    }
  });
}

// 初始化 Swiper 和 YouTube API
document.addEventListener("DOMContentLoaded", function () {
  initVideoSwiper();
  loadYouTubeAPI();
});
