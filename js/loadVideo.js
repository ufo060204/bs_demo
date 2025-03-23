// 播放器影片實例的物件，用來儲存所有創建的播放器
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
    // 為卡片添加點擊事件
    card.addEventListener("click", function () {
      const videoId = this.dataset.videoId;
      const videoTitle = this.dataset.title;
      const videoImg = this.querySelector(".video-swiper__img");
      const videoButton = this.querySelector(".video-swiper__btn");

      const playerContainer = document.createElement("div");
      playerContainer.id = videoId;
      playerContainer.dataset.title = videoTitle;
      const containerId = playerContainer.id;
      playerContainer.classList.add("aspect-video", "w-full", "h-auto");

      // 將容器添加到卡片中
      this.appendChild(playerContainer);

      // 如果播放器已經存在，直接播放；否則創建新播放器
      if (players[containerId]) {
        // players[containerId].loadVideoById(videoId);
        // players[containerId].playVideo();
      } else {
        // 創建新播放器
        createPlayer(containerId, videoId);
        // 隱藏影片圖片和播放按鈕
        if (videoImg) videoImg.style.display = "none";
        if (videoButton) videoButton.style.display = "none";
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
      modestbranding: 1, // 隱藏 YouTube 標誌
      fs: 1, // 顯示全屏按鈕
      iv_load_policy: 3, // 不顯示影片註釋
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 5. 播放器準備就緒時的回調
function onPlayerReady(event) {
  // 播放器準備好後立即播放
  event.target.playVideo();
}

// 6. 播放器狀態改變時的回調
function onPlayerStateChange(event) {
  // 可以根據需要處理不同的播放器狀態
  // YT.PlayerState.ENDED       0
  // YT.PlayerState.PLAYING     1

  if (
    event.data === YT.PlayerState.PLAYING &&
    window.matchMedia("(max-width: 768px)").matches
  ) {
    console.log("播放器播放中");
    const prev = document.querySelector(".video-swiper-button-prev");
    const next = document.querySelector(".video-swiper-button-next");
    if (prev) prev.style.opacity = "0";
    if (next) next.style.opacity = "0";
  }

  // YT.PlayerState.PAUSED      2

  /* 暫停時顯示導覽指標 */
  if (
    event.data === YT.PlayerState.PAUSED &&
    window.matchMedia("(max-width: 768px)").matches
  ) {
    console.log("播放器暫停");
    const prev = document.querySelector(".video-swiper-button-prev");
    const next = document.querySelector(".video-swiper-button-next");
    if (prev) prev.style.opacity = "1";
    if (next) next.style.opacity = "1";
  }

  // YT.PlayerState.BUFFERING   3
  // YT.PlayerState.CUED        5
}

// 8. 暫停所有播放器
function pauseAllPlayers() {
  Object.values(players).forEach((player) => {
    if (player && typeof player.pauseVideo === "function") {
      player.pauseVideo();
    }
  });
}

// 載入 YouTube IFrame API
// document.addEventListener("DOMContentLoaded", loadYouTubeAPI);
