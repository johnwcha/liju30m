// import { db } from '../plugins/firebase'
// const db = firebase.firestore()
// for production
// export const getAllVideos = () => {
//   const temp = []
//   db.collection('-video_meta').where('access', '==', 0).get().then((snapshot) => {
//     // let temp = []
//     snapshot.forEach((doc) => {
//       console.log(doc.data())
//       temp.push({ id: doc.id, ...doc.data() })
//     })
//   }).catch((error) => { console.log(error.message) })
//   return temp
// }

// update here & also the var: chipcolorObj in grammar.vue
export const yufadian = [
  {
    ci: '把',
    eng: 'measure word',
    chn: '一<span style="color: red">把</span>槍',
    code: 'b-010',
    color: 'red'
  },
  {
    ci: '',
    eng: 'noun',
    chn: '<span style="color: red">把</span>戲、<span style="color: red">把</span>手，掃<span style="color: red">把</span>',
    code: 'b-011',
    color: 'red'
  },
  {
    ci: '',
    eng: 'verb',
    chn: '派人<span style="color: red">把</span>守',
    code: 'b-012',
    color: 'red'
  },
  {
    ci: '才',
    eng: 'not until',
    chn: '八點<span style="color: red">才</span>來',
    code: 'c-020',
    color: 'green'
  },
  {
    ci: '',
    eng: 'emphasis',
    chn: '我<span style="color: red">才</span>不要呢',
    code: 'c-021',
    color: 'green'
  },
  {
    ci: '',
    eng: 'conditional',
    chn: '你去我<span style="color: red">才</span>去',
    code: 'c-022',
    color: 'green'
  },
  {
    ci: '',
    eng: 'only',
    chn: '他<span style="color: red">才</span>12歲',
    code: 'c-023',
    color: 'green'
  },
  {
    ci: '',
    eng: 'just now',
    chn: '他們剛剛<span style="color: red">才</span>到家',
    code: 'c-024',
    color: 'green'
  },
  {
    ci: '的',
    eng: 'category',
    chn: '這本書是新<span style="color: red">的</span> / 這是有可能<span style="color: red">的</span>',
    code: 'd-220',
    color: 'orange'
  },
  {
    ci: '',
    eng: 'past event',
    chn: '<span style="color: red">是</span>跟誰去<span style="color: red">的</span>',
    code: 'd-221',
    color: 'orange'
  },
  {
    ci: '得',
    eng: 'have to',
    chn: '我們<span style="color: red">得</span>',
    code: 'd-030',
    color: 'blue'
  },
  {
    ci: '',
    eng: 'verb - DE',
    chn: '打球打<span style="color: red">得</span>很好',
    code: 'd-031',
    color: 'blue'
  },
  {
    ci: '多',
    eng: 'a little more',
    chn: '十<span style="color: red">多</span>個',
    code: 'd-040',
    color: 'cyan'
  },
  {
    ci: '',
    eng: 'question',
    chn: '今年<span style="color: red">多</span>大',
    code: 'd-041',
    color: 'cyan'
  },
  {
    ci: '',
    eng: 'comparison',
    chn: '年輕<span style="color: red">多</span>了',
    code: 'd-042',
    color: 'cyan'
  },
  {
    ci: '過',
    eng: 'verb + 過',
    chn: '看<span style="color: red">過</span> / 去<span style="color: red">過</span>',
    code: 'g-010',
    color: 'teal'
  },
  {
    ci: '還是',
    eng: 'or',
    chn: '學生<span style="color: red">還是</span>老師？',
    code: 'h-050',
    color: 'purple'
  },
  {
    ci: '',
    eng: 'still',
    chn: '他<span style="color: red">還是</span>不舒服',
    code: 'h-051',
    color: 'purple'
  },
  {
    ci: '',
    eng: 'selection / choice',
    chn: '我們<span style="color: red">還是</span>吃中餐好了',
    code: 'h-052',
    color: 'purple'
  },
  {
    ci: '就',
    eng: 'about to',
    chn: '很快<span style="color: red">就</span>到 / <span style="color: red">就</span>要起飛了',
    code: 'j-110',
    color: 'pink'
  },
  {
    ci: '',
    eng: 'conditional',
    chn: '你去我<span style="color: red">就</span>去',
    code: 'j-111',
    color: 'pink'
  },
  {
    ci: '',
    eng: 'immediacy',
    chn: '一看完<span style="color: red">就</span>還你',
    code: 'j-112',
    color: 'pink'
  },
  {
    ci: '是',
    eng: 'verb 是 verb',
    chn: '好看<span style="color: red">是</span>好看',
    code: 'sh-120',
    color: 'primary'
  },
  {
    ci: '',
    eng: 'emphasis',
    chn: '這幾年變化<span style="color: red">是</span>很大',
    code: 'sh-121',
    color: 'primary'
  },
  {
    ci: '為',
    eng: 'to be',
    chn: '成<span style="color: red">為</span> / 登記<span style="color: red">為',
    code: 'w-130',
    color: 'warning'
  },
  {
    ci: '',
    eng: 'for',
    chn: '<span style="color: red">為</span>您帶來 / <span style="color: red">為</span>我們準備',
    code: 'w-131',
    color: 'warning'
  }
]
export const grammarcode = [
  { header: '✮ 【把】 ✮' },
  {
    ci: '把',
    eng: 'measure word',
    chn: '一<span style="color: red">把</span>槍',
    code: 'b-010',
    color: 'red'
  },
  {
    ci: '把',
    eng: 'noun',
    chn: '<span style="color: red">把</span>戲、<span style="color: red">把</span>手，掃<span style="color: red">把</span>',
    code: 'b-011',
    color: 'red'
  },
  {
    ci: '把',
    eng: 'verb',
    chn: '派人<span style="color: red">把</span>守',
    code: 'b-012',
    color: 'red'
  },
  { divider: true },
  { header: '✮ 【才】 ✮' },
  {
    ci: '才',
    eng: 'not until',
    chn: '八點<span style="color: red">才</span>來',
    code: 'c-020',
    color: 'green'
  },
  {
    ci: '才',
    eng: 'emphasis',
    chn: '我<span style="color: red">才</span>不要呢',
    code: 'c-021',
    color: 'green'
  },
  {
    ci: '才',
    eng: 'conditional',
    chn: '你去我<span style="color: red">才</span>去',
    code: 'c-022',
    color: 'green'
  },
  {
    ci: '才',
    eng: 'only',
    chn: '他<span style="color: red">才</span>12歲',
    code: 'c-023',
    color: 'green'
  },
  {
    ci: '才',
    eng: 'just now',
    chn: '他們剛剛<span style="color: red">才</span>到家',
    code: 'c-024',
    color: 'green'
  },
  { divider: true },
  { header: '✮ 【的】 ✮' },
  {
    ci: '的',
    eng: 'category',
    chn: '這本書是新<span style="color: red">的</span> / 這是有可能<span style="color: red">的</span>',
    code: 'd-220',
    color: 'orange'
  },
  {
    ci: '的',
    eng: 'past event',
    chn: '<span style="color: red">是</span>跟誰去<span style="color: red">的</span>',
    code: 'd-221',
    color: 'orange'
  },
  { divider: true },
  { header: '✮ 【得】 ✮' },
  {
    ci: '得',
    eng: 'have to',
    chn: '我們<span style="color: red">得</span>',
    code: 'd-030',
    color: 'blue'
  },
  {
    ci: '得',
    eng: 'verb - DE',
    chn: '打球打<span style="color: red">得</span>很好',
    code: 'd-031',
    color: 'blue'
  },
  { divider: true },
  { header: '✮ 【多】 ✮' },
  {
    ci: '多',
    eng: 'a little more',
    chn: '十<span style="color: red">多</span>個',
    code: 'd-040',
    color: 'cyan'
  },
  {
    ci: '多',
    eng: 'question',
    chn: '今年<span style="color: red">多</span>大',
    code: 'd-041',
    color: 'cyan'
  },
  {
    ci: '多',
    eng: 'comparison',
    chn: '年輕<span style="color: red">多</span>了',
    code: 'd-042',
    color: 'cyan'
  },
  { divider: true },
  { header: '✮ 【過】 ✮' },
  {
    ci: '過',
    eng: 'verb + 過',
    chn: '看<span style="color: red">過</span> / 去<span style="color: red">過</span>',
    code: 'g-010',
    color: 'teal'
  },
  { divider: true },
  { header: '✮ 【還是】 ✮' },
  {
    ci: '還是',
    eng: 'or',
    chn: '學生<span style="color: red">還是</span>老師？',
    code: 'h-050',
    color: 'purple'
  },
  {
    ci: '還是',
    eng: 'still',
    chn: '他<span style="color: red">還是</span>不舒服',
    code: 'h-051',
    color: 'purple'
  },
  {
    ci: '還是',
    eng: 'selection / choice',
    chn: '我們<span style="color: red">還是</span>吃中餐好了',
    code: 'h-052',
    color: 'purple'
  },
  { divider: true },
  { header: '✮ 【就】 ✮' },
  {
    ci: '就',
    eng: 'about to',
    chn: '很快<span style="color: red">就</span>到 / <span style="color: red">就</span>要起飛了',
    code: 'j-110',
    color: 'pink'
  },
  {
    ci: '就',
    eng: 'conditional',
    chn: '你去我<span style="color: red">就</span>去',
    code: 'j-111',
    color: 'pink'
  },
  {
    ci: '就',
    eng: 'immediacy',
    chn: '一看完<span style="color: red">就</span>還你',
    code: 'j-112',
    color: 'pink'
  },
  { divider: true },
  { header: '✮ 【是】 ✮' },
  {
    ci: '是',
    eng: 'verb 是 verb',
    chn: '好看<span style="color: red">是</span>好看',
    code: 'sh-120',
    color: 'primary'
  },
  {
    ci: '是',
    eng: 'emphasis',
    chn: '這幾年變化<span style="color: red">是</span>很大',
    code: 'sh-121',
    color: 'primary'
  },
  { divider: true },
  { header: '✮ 【為】 ✮' },
  {
    ci: '為',
    eng: 'to be',
    chn: '成<span style="color: red">為</span> / 登記<span style="color: red">為',
    code: 'w-130',
    color: 'warning'
  },
  {
    ci: '為',
    eng: 'for',
    chn: '<span style="color: red">為</span>您帶來 / <span style="color: red">為</span>我們準備',
    code: 'w-131',
    color: 'warning'
  }
]
export const iclessons = [
  {
    title: 'Lesson 1',
    subtitle: 'Greetings',
    img: 'L01.png',
    btn: [{ name: 'Dialogue 1', docid: 'ic_01_01' }, { name: 'Dialogue 2', docid: 'ic_01_02' }]
  },
  {
    title: 'Lesson 2',
    subtitle: 'Family',
    img: 'L02.png',
    btn: [{ name: 'Dialogue 1', docid: 'ic_02_01' }, { name: 'Dialogue 2', docid: 'ic_02_02' }]
  },
  {
    title: 'Lesson 3',
    subtitle: 'Dates and Time',
    img: 'L03.png',
    btn: [{ name: 'Dialogue 1', docid: 'ic_03_01' }, { name: 'Dialogue 2', docid: 'ic_03_02' }]
  }
  // {
  //   title: 'Lesson 4',
  //   subtitle: 'Hobbies',
  //   img: 'L04.png',
  //   btn: [{ name: 'Dialogue 1', docid: 'ic_04_01' }, { name: 'Dialogue 2', docid: 'ic_04_02' }]
  // },
  // {
  //   title: 'Lesson 5',
  //   subtitle: 'Visiting Friends',
  //   img: 'L05.png',
  //   btn: [{ name: 'Dialogue', docid: 'ic_05_01' }, { name: 'Narrative', docid: 'ic_05_02' }]
  // },
  // {
  //   title: 'Lesson 6',
  //   subtitle: 'Making Appointments',
  //   img: 'L06.png',
  //   btn: [{ name: 'Dialogue 1', docid: 'ic_06_01' }, { name: 'Dialogue 2', docid: 'ic_06_02' }]
  // },
  // {
  //   title: 'Lesson 7',
  //   subtitle: 'Studying Chinese',
  //   img: 'L07.png',
  //   btn: [{ name: 'Dialogue 1', docid: 'ic_07_01' }, { name: 'Dialogue 2', docid: 'ic_07_02' }]
  // },
  // {
  //   title: 'Lesson 8',
  //   subtitle: 'School Life',
  //   img: 'L08.png',
  //   btn: [{ name: 'A diary', docid: 'ic_08_01' }, { name: 'A letter', docid: 'ic_08_02' }]
  // },
  // {
  //   title: 'Lesson 9',
  //   subtitle: 'Shopping',
  //   img: 'L09.png',
  //   btn: [{ name: 'Dialogue 1', docid: 'ic_09_01' }, { name: 'Dialogue 2', docid: 'ic_09_02' }]
  // },
  // {
  //   title: 'Lesson 10',
  //   subtitle: 'Transportation',
  //   img: 'L10.png',
  //   btn: [{ name: 'Dialogue 1', docid: 'ic_10_01' }, { name: 'Dialogue 2', docid: 'ic_10_02' }]
  // }
]
