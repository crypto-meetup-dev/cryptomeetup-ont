<template>
  <div id="app">
    <div class="mylangd" v-if="isShowMylangd">
      <div class="close-mylangd" @click="closeMylangd"><img src="./assets/icons/close.png" /></div>
      <div 
        v-if="myLangdArr.length" 
        v-for="(item, index) in myLangdArr" 
        :key="index" 
        class="mylangd-item"
      >
        <p>{{$t('my_portal_name')}}: {{getCountryName(item[3])}}</p>
        <p>{{$t('my_portal_price')}}: {{`${item[1]} ONT`}}</p>
      </div>
      <div v-if="!myLangdArr.length" class="no-langd">
        {{$t('my_portal_no_time')}}
      </div>
    </div>
    <div class="app-nav is-hidden-mobile">
      <b-modal :active.sync="isInviteDialogActive" has-modal-card>
        <invite-modal></invite-modal>
      </b-modal>
      <a class="nav-item" @click="aboutShow=!aboutShow">{{$t('about_view')}}</a>
      <a class="nav-item" @click="toogleLangd">{{$t('land_view')}}</a>
    </div>
    <Aboutview
      :aboutShow="aboutShow"
      :mobileAboutShow="mobileAboutShow"
      @CloseAboutView="CloseAboutView"
      @CloseMobileAboutView="CloseMobileAboutView"
    />
    <div class="app-footer">
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://twitter.com/Cryptomeetupio"><b-icon icon="twitter" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://t.me/Cryptomeetup_Official"><b-icon icon="telegram" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile"><a target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /></a></div>
      <div class="footer-item is-hidden-mobile">{{$t('cmu_creator')}}</div>
      <div class="footer-item is-hidden-mobile">{{$t('powered_by')}} <a target="_blank" href="https://chrome.google.com/webstore/search/Cyano%20Wallet?hl=zh-CN">Cyano Wallet</a></div>
      <div class="footer-item" v-if="nowGlobal">{{$t('count_down')}}: <b>{{ globalCountdown }}</b> </div>
      <div class="footer-item" v-if="nowGlobal">
        {{$t('prize_pool')}}: <b>{{`${nowGlobal[2]} ONT`}}</b>
      </div>
      <div class="footer-item is-hidden-mobile">
        <b-select class="is-inverted" v-model="$i18n.locale" :placeholder="$t('switch_lang')" size="is-small" rounded>
          <option value="en">English</option>
          <option value="zh">简体中文</option>
        </b-select>
      </div>
    </div>
    <div class="app-footer last-buyer">
      <div class="footer-item" v-if="nowGlobal">{{$t('last_buyer')}}: <b>{{ nowGlobal[1] }}</b> </div>
    </div>
    <a
      :class="['app-nav-burger', 'is-hidden-tablet', { 'is-active': mobileNavExpanded }]"
      v-show="navBurgerVisible"
    >
      <a @click="mobileNavExpanded = !mobileNavExpanded">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </a>
    <slide-y-up-transition>
      <div class="app-nav-expand is-hidden-tablet" v-show="navBurgerVisible && mobileNavExpanded" @click="mobileNavExpanded=false"><!-- Nav Items on mobile -->
        <a class="app-nav-expand-item" @click="mobileAboutShow=!mobileAboutShow;"><b-icon class="question-icon" pack="fas" icon="question-circle" size="is-small"></b-icon>
{{' '+$t('about_view')}}</a>
        <a class="app-nav-expand-item" @click="toogleLangd"><b-icon class="question-icon" pack="fas" icon="question-circle" size="is-small"></b-icon>
{{' '+$t('land_view')}}</a>
        <a class="app-nav-expand-item" target="_blank" href="https://twitter.com/Cryptomeetupio"><b-icon icon="twitter" size="is-small" /> Twitter</a>
        <a class="app-nav-expand-item" target="_blank" href="https://t.me/Cryptomeetup_Official"><b-icon icon="telegram" size="is-small" /> Telegram</a>
        <a class="app-nav-expand-item" target="_blank" href="https://discordapp.com/invite/Ws3ENJf"><b-icon icon="discord" size="is-small" /> Discord</a>
        <a class="app-nav-expand-item" target="_blank" href="https://medium.com/@cryptomeetup"><b-icon icon="medium" size="is-small" /> Medium</a>
        <a class="app-nav-expand-item" target="_blank" href="https://www.reddit.com/user/cryptomeetup"><b-icon icon="reddit" size="is-small" /> Reddit</a>
        <a class="app-nav-expand-item" target="_blank" href="https://github.com/crypto-meetup-dev"><b-icon icon="github-circle" size="is-small" /> GitHub</a>
        <div class="app-nav-expand-item" @click.stop>
          <b-select class="is-inverted" v-model="$i18n.locale" icon="translate" :placeholder="$t('switch_lang')" size="is-small" rounded expanded>
            <option value="en">English</option>
            <option value="zh">简体中文</option>
          </b-select>
        </div>
      </div>
    </slide-y-up-transition>
    <keep-alive include="globe-view"><router-view/></keep-alive>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { client, ParameterType } from 'ontology-dapi';
import Global from './Global.js';
import Aboutview from '@/views/About.vue';
import Loading from '@/components/Loading.vue';
import * as CountryCode from 'i18n-iso-countries';
CountryCode.registerLocale(require('i18n-iso-countries/langs/en.json'));
CountryCode.registerLocale(require('i18n-iso-countries/langs/zh.json'));

export default {
  name: 'App',
  components: {
    Loading,
    Aboutview,
  },
  data: () => ({
    mobileNavExpanded: false,
    tokenShow: false,
    aboutMylangd: false,
    isShowMylangd: false,
    aboutShow: false,
    globalCountdown: '00:00:00',
    mobileTokenShow: false,
    mobileAboutShow: false,
    isRedeeming: false,
    isInviteDialogActive : false,
    appLogin: false,
    portalShow: false,
    portalList: [],
    myLangdArr: []
  }),
  async created() {
    let provider;
    try {
      provider = await client.api.provider.getProvider()
      console.log('onGetProvider: ' + JSON.stringify(provider))
    } catch (e) {
      this.$toast.open({
        message: 'No dAPI provider istalled.',
        type: 'is-danger',
        duration: 5000,
        position: 'is-bottom',
        queue: false,
      });
    }

    this.getAddress()
    this.getLangArr()
    this.countdownUpdater = setInterval(() => {
      if (this.nowGlobal != null) {
        clearInterval(this.countdownUpdater)
        this.times = this.nowGlobal[0] * 1000 - Date.now()
        this.countdown()
      }
    }, 1000);

  },
  methods: {
    ...mapActions(['getLangArr', 'getAddress']),
    CloseAboutView() {
      this.aboutShow = !this.aboutShow;
    },
    getCountryName(countryCode) {
      const locale = CountryCode.langs().includes(this.$i18n.locale) ? this.$i18n.locale : 'en';
      return CountryCode.getName(countryCode, locale);
    },
    CloseTokenView() {
      this.tokenShow = !this.tokenShow;
    },
    CloseMobileAboutView() {
      this.mobileAboutShow = !this.mobileAboutShow;
    },
    CloseMobileTokenView() {
      this.mobileTokenShow = !this.mobileTokenShow;
    },
    changeInviteStatus() {
      this.isInviteDialogActive = true;
    },
    countdown (cb) {
      this.timmer = setInterval(() => {
        this.times = this.times - 1000
        if (this.times <= 0) {
          clearInterval(this.timmer)
          this.globalCountdown = '00:00:00'
          cb && cb()
        } else {
          this.changeTime(this.times)
        }
      }, 1000)
    },
    changeTime (time) {
      let days = Math.floor(time / (24 * 3600 * 1000))
      let leave1 = time % (24 * 3600 * 1000)
      let hours = Math.floor(leave1 / (3600 * 1000))
      let leave2 = leave1 % (3600 * 1000)
      let minutes = Math.floor(leave2 / (60 * 1000))
      let leave3 = leave2 % (60 * 1000)
      let seconds = Math.round(leave3 / 1000)
      let htime = (days * 24) + hours
      this.globalCountdown = `${this.checkTime(days)}days ${this.checkTime(hours)}:${this.checkTime(minutes)}:${this.checkTime(seconds)}`
    },
    checkTime (i) {
      if (i < 10) {
        i = `0${i}`
      }
      return i
    },
    getMylang () {
      console.log(this.landArr, this.address)
      if (this.address && this.landArr.length) {
        this.myLangdArr = this.landArr.filter(item => item[2] === this.address)
      }
    },
    toogleLangd () {
      if (this.isShowMylangd) {
        this.isShowMylangd = false
      } else {
        this.isShowMylangd = true
      }
    },
    closeMylangd () {
      this.isShowMylangd = false
    }
  },
  watch: {
    landArr (landArr) {
      this.getMylang()
    }
  },
  computed: {
    ...mapState(['nowGlobal', 'landArr', 'address']),
    ...mapState('ui', ['navBurgerVisible', 'globalProgressVisible']),
  },
  beforeDestroy () {
    Global.$off('onLoadMap')
    Global.$off('portalList')
  },
};
</script>

<style lang="sass">
@import "~mapbox-gl/dist/mapbox-gl.css";
@import "~bulma";
@import "~buefy/src/scss/buefy";
a:hover
  text-decoration: underline
.is-inverted > .select
  & select
    background: rgba(#000, 0.7)
    border-color: transparent
    color: #FFF
    &:hover
      border-color: rgba(#FFF, 0.4)
  &:not(.is-multiple):not(.is-loading):hover::after
    border-color: #FFF
.select select option
  color: #FFF
.modal-card
  box-shadow: 0 0 30px $primary
</style>

<style lang="sass" scoped>
.mylangd 
  position: absolute
  left: 20px
  top: 100px
  bottom: 100px
  right: 20px
  z-index: 999
  background: rgb(25, 25, 25)
  overflow-y: scroll
  padding-top: 20px

.no-langd
  text-align: center
  font-size: 12px
  padding: 50px 0
  color: #fff

.mylangd-item
  font-size: 12px
  color: #fff
  padding-left: 20px
  margin-bottom: 20px

.close-mylangd
  position: absolute
  right: 20px
  top: 20px
  cursor: pointer
  width: 24px
  height: 24px

  img
    display: block
    width: 24px
    height: 24px

#app
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  overflow: hidden
.app-nav
  position: absolute
  left: 2rem
  top: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: flex-start
.nav-item
  margin-right: 1rem
  color: rgba(#FFF, 0.8)
  user-select: none
  text-shadow: 1px 1px 2px rgba(#000, 0.5)
  &:hover
    color: #FFF
  &.router-link-exact-active
    color: $primary
.app-footer
  position: absolute
  left: 2rem
  right: 2rem
  bottom: 2rem
  z-index: 1
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center
  text-shadow: 1px 1px 2px rgba(#000, 0.5)
  a:hover
    text-decoration: none
.last-buyer
  bottom: 4rem
.footer-item
  margin: 0 0.5rem
  font-size: $size-7
.app-nav-burger
  position: relative
  left: 0
  top: 0
  z-index: 5
  color: #FFF
  +hamburger($app-nav-height)
  cursor:auto
  a
    display: block
    color: #FFF
    width: 3rem
    height: 3rem
    cursor: pointer
.app-nav-expand
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 4
  background: rgba(#000, 0.9)
  padding-top: $app-nav-height
  &-item
    display: block
    width: 100%
    padding: 1rem
    border-top: 1px solid rgba(#FFF, 0.2)
    color: #FFF
    font-size: $size-7
    &:hover
      text-decoration: none
      background: rgba(#FFF, 0.1)
.country-detail
  position: absolute
  left: 0
  top: 0
  height: 100%
  z-index: 2
  pointer-events: none
  transition: background .5s ease-out
  width: 550px
  display: flex
  flex-direction: column
  &.is-active
    pointer-events: auto
    background: rgba(#000, 0.8)
  +mobile
    width: 100%
.mobile-back-button
  width: $app-nav-height
  height: $app-nav-height
  margin: 0
  display: flex
  justify-content: center
  align-items: center
.country-select
  +mobile
    margin: 0 0.5rem 0 0
    width: calc(100vw - #{$app-nav-height} - 0.5rem)
  .back-button
     position: absolute !important
     top: 2px  !important
     left: 10px  !important
.badgeList
  margin: 1rem 0
.app-map-login
    position: absolute
    left: 5rem
    top: .6rem
</style>
