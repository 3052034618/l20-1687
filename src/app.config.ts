export default defineAppConfig({
  pages: [
    'pages/shelf/index',
    'pages/surge/index',
    'pages/message/index',
    'pages/mine/index',
    'pages/search/index',
    'pages/book-detail/index',
    'pages/urge-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF8C42',
    navigationBarTitleText: '书友催更',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF5F0'
  },
  tabBar: {
    color: '#A09A94',
    selectedColor: '#FF8C42',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/shelf/index',
        text: '书架'
      },
      {
        pagePath: 'pages/surge/index',
        text: '催更'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
