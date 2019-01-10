<template>
  <div class="modal-card autowidth">
    <header class="modal-card-head">
      <p class="modal-card-title">{{$t('tron_have_name').replace('{countryName}', countryName)}}</p>
    </header>
    <section class="modal-card-body">
      <div class="columns">
        <div class="column">
          <p>{{$t('tron_buy_text').replace('{countryName}', countryName).replace('{price}', `${country[1]} ONT`)}}</p>
        </div>
      </div>
      <div class="columns">
        <div class="column content is-hidden-mobile">
          <h4>{{$t('tron_desktop')}}</h4>
          <p>{{$t('tron_desktop_text')}}</p>
          <button
            :class="[isScatterPaying ? 'button is-white is-rounded is-outlined is-loading' : 'button is-white is-rounded is-outlined']"
            @click="payWithScatterAsync"
          >
            {{$t('tron_tronpay')}}
          </button>
        </div>
        <div class="column content is-hidden-tablet">
          <h4>{{$t('tron_wallet_app')}}</h4>
          <button
            :class="[isScatterPaying ? 'button is-white is-rounded is-outlined is-loading' : 'button is-white is-rounded is-outlined']"
            @click="payWithScatterAsync"
          >
            {{$t('tron_app')}}
          </button>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-rounded is-white is-outlined" type="button" @click="$parent.close()">{{$t('tron_close')}}</button>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Api from '@/util/api';

export default {
  name: 'SponsorPaymentModal',
  props: ['countryName', 'country', 'address'],
  data: () => ({
    isScatterPaying: false,
  }),
  methods: {
    ...mapActions(['getLangArr']),
    async payWithScatterAsync() {
      this.isScatterPaying = true;
      const buymessage = await Api.buy(this.country[0], this.address)
      this.isScatterPaying = false;
      if (buymessage.indexOf('success')) {
        this.$toast.open({
          message: this.$t('buy_land_withApp_success'),
          type: 'is-success',
          duration: 3000,
          queue: false,
        });
        this.$parent.close();
        this.getLangArr()
      }
    },
  },
};
</script>
<style scoped>
.autowidth {
  width: auto;
}
</style>
