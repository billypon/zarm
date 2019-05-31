(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{659:function(n,e){n.exports="# Pull 上拉加载下拉刷新\n\n\n\n## 基本用法\n```jsx\nimport { Pull, Cell } from 'zarm';\n\nconst REFRESH_STATE = {\n  normal: 0,  // 普通\n  pull: 1,    // 下拉刷新（未满足刷新条件）\n  drop: 2,    // 释放立即刷新（满足刷新条件）\n  loading: 3, // 加载中\n  success: 4, // 加载成功\n  failure: 5, // 加载失败\n};\n\nconst LOAD_STATE = {\n  normal: 0,   // 普通\n  abort: 1,    // 中止\n  loading: 2,  // 加载中\n  success: 3,  // 加载成功\n  failure: 4,  // 加载失败\n  complete: 5, // 加载完成（无新数据）\n};\n\nfunction getRandomNum(min, max) {\n  const Range = max - min;\n  const Rand = Math.random();\n  return (min + Math.round(Rand * Range));\n}\n\nclass Demo extends React.Component {\n  constructor(props) {\n    super(props);\n    this.mounted = true;\n    this.state = {\n      refreshing: REFRESH_STATE.normal,\n      loading: LOAD_STATE.normal,\n      dataSource: [],\n    };\n  }\n\n  componentDidMount() {\n    this.appendData(20);\n  }\n\n  componentWillUnmount() {\n    this.mounted = false;\n  }\n\n  // 模拟请求数据\n  refreshData() {\n    this.setState({ refreshing: REFRESH_STATE.loading });\n    setTimeout(() => {\n      if (!this.mounted) return;\n\n      this.appendData(20, []);\n      this.setState({\n        refreshing: REFRESH_STATE.success,\n      });\n    }, 2000);\n  }\n\n  // 模拟加载更多数据\n  loadData() {\n    this.setState({ loading: LOAD_STATE.loading });\n    setTimeout(() => {\n      if (!this.mounted) return;\n\n      const randomNum = getRandomNum(0, 5);\n      const { dataSource } = this.state;\n      let loading = LOAD_STATE.success;\n\n      console.log(`状态: ${randomNum === 0 ? '失败' : (randomNum === 1 ? '完成' : '成功')}`);\n\n      if (randomNum === 0) {\n        loading = LOAD_STATE.failure;\n      } else if (randomNum === 1) {\n        loading = LOAD_STATE.complete;\n      } else {\n        this.appendData(20);\n      }\n\n      this.setState({\n        loading,\n      });\n    }, 2000);\n  }\n\n  appendData(length, dataSource) {\n    dataSource = dataSource || this.state.dataSource;\n    const startIndex = dataSource.length;\n    for (let i = startIndex; i < startIndex + length; i++) {\n      dataSource.push(<Cell key={+i}>第 {i + 1} 行</Cell>);\n    }\n    this.setState({\n      dataSource,\n    });\n  }\n\n  render() {\n    const { refreshing, loading, dataSource } = this.state;\n    return (\n      <div>\n        <Pull\n          refresh={{\n            state: refreshing,\n            handler: () => this.refreshData(),\n            // render: (refreshState, percent) => {\n            //   const cls = 'custom-control';\n            //   switch (refreshState) {\n            //     case REFRESH_STATE.pull:\n            //       return (\n            //         <div className={cls}>\n            //           <ActivityIndicator loading={false} percent={percent} />\n            //           <span>下拉刷新</span>\n            //         </div>\n            //       );\n\n            //     case REFRESH_STATE.drop:\n            //       return (\n            //         <div className={cls}>\n            //           <ActivityIndicator loading={false} percent={100} />\n            //           <span>释放立即刷新</span>\n            //         </div>\n            //       );\n\n            //     case REFRESH_STATE.loading:\n            //       return (\n            //         <div className={cls}>\n            //           <ActivityIndicator type=\"spinner\" />\n            //           <span>加载中</span>\n            //         </div>\n            //       );\n\n            //     case REFRESH_STATE.success:\n            //       return (\n            //         <div className={cls}>\n            //           <Icon type=\"right-round\" theme=\"success\" />\n            //           <span>加载成功</span>\n            //         </div>\n            //       );\n\n            //     case REFRESH_STATE.failure:\n            //       return (\n            //         <div className={cls}>\n            //           <Icon type=\"wrong-round\" theme=\"danger\" />\n            //           <span>加载失败</span>\n            //         </div>\n            //       );\n\n            //     default:\n            //   }\n            // },\n          }}\n          load={{\n            state: loading,\n            distance: 200,\n            handler: () => this.loadData(),\n            // render: (loadState) => {\n            //   const cls = 'custom-control';\n            //   switch (loadState) {\n            //     case LOAD_STATE.loading:\n            //       return <div className={cls}><ActivityIndicator type=\"spinner\" /></div>;\n\n            //     case LOAD_STATE.failure:\n            //       return <div className={cls}>加载失败</div>;\n\n            //     case LOAD_STATE.complete:\n            //       return <div className={cls}>我是有底线的</div>;\n            //   }\n            // },\n          }}\n        >\n          {dataSource}\n        </Pull>\n      </div>\n    )\n  }\n}\n\nReactDOM.render(<Demo />, mountNode);\n```\n\n\n\n## API\n\n| 属性 | 类型 | 默认值 | 说明 |\n| :--- | :--- | :--- | :--- |\n| refresh | Action | - | 下拉刷新的参数配置 |\n| load | Action | - | 上拉加载的参数配置 |\n| animationDuration | number | 400 | 动画执行时间，单位：毫秒 |\n| stayTime | number | 1000 | 加载成功停留时间 |\n\n### Action 类型定义\n| 属性 | 类型 | 默认值 | 说明 |\n| :--- | :--- | :--- | :--- |\n| state | REFRESH_STATE &#124; LOAD_STATE | 0 | 状态枚举 |\n| startDistance | number | 20 | 下拉时的助跑距离，单位：px |\n| distance | number | 50 | 触发距离阀值，单位：px |\n| render | (refreshState: REFRESH_STATE &#124; LOAD_STATE, percent: number) => ReactNode | - | 各状态渲染的回调函数 |\n| handler | () => void | - | 达到阀值后释放触发的回调函数 |\n\n### REFRESH_STATE 枚举定义\n| 枚举值 | 说明 |\n| :--- | :--- |\n| normal | 普通状态 |\n| pull | 下拉状态（未满足刷新条件） |\n| drop | 释放立即刷新（满足刷新条件） |\n| loading | 加载中 |\n| success | 加载成功 |\n| failure | 加载失败 |\n\n### LOAD_STATE 枚举定义\n| 枚举值 | 说明 |\n| :--- | :--- |\n| normal | 普通状态 |\n| abort | 终止状态 |\n| loading | 加载中 |\n| success | 加载成功 |\n| failure | 加载失败 |\n| complete | 加载完成 |"}}]);