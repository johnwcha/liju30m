import dayjs from 'dayjs'

export async function logSearchByDate (keyword) {
  const sdate = dayjs().format('MM-DD-YYYY')
  const stime = dayjs().format('HH-mm-ss.SSS')
  const obj = { uid: this.$store.state.uid, time: stime, search: keyword }
  const res = await this.$fire.firestore.collection('-video_search_by_date').doc(sdate).set(obj, { merge: true })
  console.log(res)
}
