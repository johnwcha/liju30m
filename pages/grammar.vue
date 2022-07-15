<template>
<v-row>
  <v-col cols="7">
    <v-select
      solo
      :items="videoCollection"
      item-text="index"
      item-value="id"
      label="Video"
      @change="getSub($event)"
    ></v-select>
    <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left" width="90px"> Time </th>
          <th class="text-left" width="90px"> tag </th>
          <th class="text-left"> Sub </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in videoSub" :key="i">
          <td style="font-weight: bold"> {{ item.id }}
            <div v-if="item.gra" style="color: red"> {{ item.gra}} </div>
          </td>
          <td>
            <!-- <span class="pink--text" v-if="item.tag"> {{ item.tag.join('】') }} </span> </td> -->
            <span v-if="item.tagging">
              <v-chip
                class="ma-1"
                close
                outlined
                small
                v-for="(tag, index) in item.tagging"
                :color="tag.color"
                @click:close="removeTag(item, i, tag.code)"
                :key="index"
              >
                <!-- <v-avatar left>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-avatar> -->
                {{tag.code}}
              </v-chip>
            </span> </td>
          <td v-html="item.html" class="subtitle-1" @click="addTag(item, i)">
          </td>
        </tr>
        </tbody>
    </template>
    </v-simple-table>
  </v-col>
  <v-col cols="5">
      <!--  from gtag yufadian  -->
      <!--  from gtag yufadian  -->
    <v-card class="gpanel" :max-height="height">
    <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th width="20"> KW </th>
          <th width="120"> Code </th>
          <th> Grammar </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in yufadian" :key="i">
          <td> <v-btn v-if="item.ci != ''" text width="20" color="primary" @click="filter(item.ci)"> {{ item.ci }} </v-btn> </td>
          <td> <v-checkbox :value="item.code" :label="'【' + item.code + '】'" v-model="selected" @change="getCode(item.code, item.color)"></v-checkbox> </td>
          <td class="subtitle-1">
            {{item.eng}}：<span v-html="item.chn">  </span>
          </td>
        </tr>
        </tbody>
    </template>
    </v-simple-table>
    </v-card>
  </v-col>
  <v-snackbar
    v-model="snackbar"
    color="success"
    top
    outlined
  >
    {{ snackbarMsg }}
    <template v-slot:action="{ attrs }">
    <v-btn
      color="green"
      text
      v-bind="attrs"
      @click="snackbar = false"
    >
      Close
    </v-btn>
    </template>
  </v-snackbar>
</v-row>
</template>

<script>
import { yufadian } from '../util/gtag'

export default {
  data () {
    return {
      curTag: [],
      allTags: [],
      videoCollection: [],
      videoSub: [],
      videoSubJSON: '',
      height: 0,
      selected: [],
      vidID: '',
      snackbar: false,
      snackbarMsg: 'Success',
      yufadian: [],
      gcode: '',
      // playerVars: {
      //   enablejsapi: 1,
      //   playsinline: 1,
      //   start: 0,
      //   disablekb: 0
      // },
      chipcolorObj: { b_010: 'red', b_011: 'red', b_012: 'red', c_020: 'green', c_021: 'green', c_022: 'green', c_023: 'green', c_024: 'green', d_220: 'orange', d_221: 'orange', d_030: 'blue', d_031: 'blue', d_040: 'cyan', d_041: 'cyan', d_042: 'cyan', g_010: 'teal', h_050: 'purple', h_051: 'purple', h_052: 'purple', j_110: 'pink', j_111: 'pink', j_112: 'pink', sh_120: 'primary', sh_121: 'primary', w_130: 'warning', w_131: 'warning' }
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.myEventHandler)
    // console.log('desdroyed')
  },
  methods: {
    myEventHandler (e) {
      // console.log(e)
      this.height = e.currentTarget.innerHeight - 75
    },
    saveTagging () {
      const tmp = JSON.parse(JSON.stringify(this.videoSub))
      tmp.forEach((item) => {
        delete item.html
        if (item.tagging) {
          delete item.tagging
          delete item.tag
        }
      })
      // 3) either update the originall subtitle collection => tagged: true
      this.$fire.firestore.collection('-video_coll').doc(this.vidID).set({
        sub: tmp
      }).then(() => {
        this.snackbar = true
        this.snackbarMsg = 'Success'
      })
    },
    getCode (code, color) {
      // console.log(this.selected)
      this.selected = []
      this.gcode = code
      this.selected.push(code)
    },
    removeTag (item, i, code) {
      // console.log(item, i, code)
      // console.log(this.videoSub)
      // update UI
      item.tagging.forEach((tag, i) => {
        if (tag.code === code) {
          item.tagging.splice(i, 1)
        }
      })
      item.tagging = [...new Set(item.tagging)]
      if (item.tagging.length === 0) { delete item.tagged }
      this.videoSub.splice(i, 1, JSON.parse(JSON.stringify(item)))
      // console.log(this.videoSub)
      // remove filed value: the grammar tag
      // delete document
      // console.log(this.vidID, item.id)
      const obj = {}
      // obj[00:10:50.400] = this.$fireModule.firestore.FieldValue.delete()
      const id = item.id.split(':').join('-').split('.').join('--')
      // console.log(id)
      // 1) delete from grammar code collection
      obj[`${id}`] = this.$fireModule.firestore.FieldValue.delete()
      this.$fire.firestore.collection(code).doc(this.vidID).update(obj).then(() => {
        console.log('removed tag from code collection')
      }).catch((error) => { console.log(error.message) })
      // 2) update entry from -video_tagging
      if (item.tagging.length === 0) {
        this.$fire.firestore.collection('-video_tagging').doc(this.vidID).update(obj).then(() => {
          // console.log('removed tag from -video_tagging')
          this.saveTagging()
        }).catch((error) => { console.log(error.message) })
      } else {
        const obj1 = { [`${id}`]: item.tagging }
        this.$fire.firestore.collection('-video_tagging').doc(this.vidID).set(obj1, { merge: true }).then(() => {
          // console.log('removed tag from -video_tagging')
          this.saveTagging()
        }).catch((error) => { console.log(error.message) })
      }
    },
    filter (str) {
      // console.log(str)
      // this.videoSub = []
      this.videoSub.forEach((item) => {
        if (item.sub.split('').includes(str) !== -1) {
          item.html = item.sub.split(str).join(`<span class="display-1 pink--text">${str}</span>`)
        }
      })
      // console.log(this.videoSub)
      this.videoSub = JSON.parse(JSON.stringify(this.videoSub))
    },
    addTag (item, i) {
      console.log(item, this.gcode, this.vidID)
      if (this.selected.length === 0) { return }
      // const tmp = JSON.parse(JSON.stringify(this.videoSubOrig[i])) // single out one row of data
      // add tag & make a copy
      // console.log('item tag before', item.tag)
      item.tag = item.tag ? item.tag.concat(this.selected) : this.selected
      // console.log('item tag after', item.tag)
      // item.color = this.chipcolor
      item.tag = JSON.parse(JSON.stringify(item.tag))
      item.tagged = true
      // update cell tagging
      item.tagging = []
      item.tag.forEach((code) => {
        // console.log(code)
        const obj = {}
        obj.code = code
        obj.color = this.getChipColor(code)
        item.tagging.push(obj)
      })
      // console.log(item)
      this.videoSub.splice(i, 1, JSON.parse(JSON.stringify(item))) // force UI update
      // this.updateTagging('+', item.id, item.tagging)
      // console.log('index ', i)
      // console.log(this.videoSub, tmp) // html, id, start(Number), sub, tag []
      // array slice() to force update
      this.videoSub.splice(i, 1, item)
      // this.videoSubOrig.splice(i, 1, item)
      // save the firestore
      const id = item.id.split(':').join('-').split('.').join('--')
      const noTag = {}
      for (const key in item) {
        if (key !== 'tag' && key !== 'tagged' && key !== 'tagging') {
          // console.log(key)
          noTag[key] = item[key]
        }
      }
      // console.log(noTag)
      // 1) update grammar code collection
      const obj = { [`${id}`]: noTag }
      this.$fire.firestore.collection(this.gcode).doc(this.vidID).set(obj, { merge: true }).then(() => {
        console.log('tag added success')
      })
      // 2) update -video_tagging collection
      const key = item.id.split('.').join('--').split(':').join('-')
      this.$fire.firestore.collection('-video_tagging').doc(this.vidID).set({ [`${key}`]: item.tagging }, { merge: true }).then(() => {
        this.saveTagging()
      }).catch((error) => {
        console.error(error.message)
      })
    },
    tag (items) {
      console.log(items)
    },
    getSub (id) {
      console.log(id)
      this.vidID = id
      this.videoSub = []
      // this.videoSubOrig = []
      this.$fire.firestore.collection('-video_coll').doc(id).get().then((snapshot) => {
        // console.log(snapshot)
        // console.log('video tagged:', snapshot.data().tagged)
        snapshot.data().sub.forEach((item) => {
          this.videoSub.push({ id: snapshot.id, html: item.sub, ...item })
          // console.log(item)
        })
        this.videoSubJSON = JSON.stringify(this.videoSub)
        // this.videoSubOrig = JSON.parse(JSON.stringify(this.videoSub)) // make a copy
        // console.log(this.videoSub)
        this.$fire.firestore.collection('-video_tagging').doc(snapshot.id).get().then((res) => {
          // console.log(res.data())
          if (res.data()) {
            this.markTagging(res.data())
          }
        })
      }).catch((error) => { console.log(error.message) })
    },
    markTagging (taggingObj) {
      // console.log('mark tagging')
      this.videoSub.forEach((item, i) => {
        if (item.tagged) {
          item.tagging = taggingObj[item.id.split('.').join('--').split(':').join('-')]
          console.log(item.tagging)
          const tags = []
          item.tagging.forEach((obj) => {
            console.log(obj)
            tags.push(obj.code)
          })
          item.tag = tags
          this.videoSub.splice(i, 1, item)
          // this.videoSubOrig.splice(i, 1, item)
        }
      })
      // console.log(this.videoSub)
    },
    getChipColor (code) {
      // console.log(code)
      const tmp = code.split('-').join('_')
      return this.chipcolorObj[tmp]
      // const color = code.split('-').join('_')
      // return this.chipcolorObj[color]
    }
  },
  mounted () {
    // this.$store.dispatch('getAllVideos')
    this.yufadian = yufadian
    window.addEventListener('resize', this.myEventHandler)
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight - 75
    // console.log(this.$store.state.userObj)
    if (this.$store.state.userObj.isAnonymous) {
      alert('Please log in to continue')
    } else {
      this.$fire.firestore.collection('-video_user').doc(this.$store.state.userObj.email).get().then((res) => {
        // console.log(res)
        if (res.data()) {
          if (res.data().access > 0) {
            this.$fire.firestore.collection('-video_meta').where('access', '==', 1).get().then((snapshot) => {
              let i = 0
              snapshot.forEach((doc) => {
                i += 1
                this.videoCollection.push({ id: doc.id, index: String(i) + ') ' + doc.data().title, ...doc.data() })
              })
            }).catch((error) => { console.log(error.message) })
          } else {
            alert('Need authorization to continue. Contact johnwcha@gmail.com for help.')
          }
        } else {
          alert('Need authorization to continue')
        }
      })
    }
    // console.log(this.$store.state.membership)
  }
}
</script>

<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  padding: 0 2px;
  min-width: 32px;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  padding: 0 4px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 2px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td > .tightPadding {
    padding: 0 4px;
}
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
}
.v-input__control {
  width: 20px;
}
.v-input--selection-controls {
  height: 30px;
}
.highlightText {
  color: red;
}
.withBorder {
  width: 40px;
  font-size:18px;
  font-weight: bold;
  border: 1px solid black;
}
.noBorder {
  width: 40px;
}
.gpanel {
  overflow: auto;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 64px;
  background-color: white;
  z-index: 1;
}
</style>
