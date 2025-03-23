/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}", // 指定所有應該被掃描的文件
  ],
  theme: {
    extend: {
      // 這裡可以擴展 Tailwind 的默認主題
      colors: {
        // 你的自定義顏色
      },
      // 其他主題擴展...
    },
  },
  plugins: [
    // 這裡可以添加 Tailwind 插件
  ],
};
