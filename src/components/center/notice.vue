<template>
  <div class="hor-center">
    <div class="notice-component flex-row ver-center">
      <div class="icon"></div>
      <span>最新公告</span>
      <span>:</span>
      <div class="content flex-row" v-for="item in notices">
        <div>[{{item.effectDate|formatDate(item.effectDate)}}]</div>
        <router-link :to="{path:'/noticesDetail', query:{name: 'notice', id:item.id }}">{{item.title}}</router-link>
      </div>
      <router-link class="hor-end" to="/noticesList">查看更多公告></router-link>
    </div>


  </div>
</template>

<style>
  @import "center.css";
</style>
<script>
  import { getNotices } from '../../api/api';
  export default{
    data () {
      return {
        user: {},
        notices: null
      }
    },
    methods: {
//      获取公告详情
      getNotices() {
        let param = {
          vendorId: 1,
          userId: null,
          isIndexPage: 'N',
          distributorId: 1,
          pageNum: 1
        }
        getNotices(param).then((res) => {
          if(res.status == 200){
            if(res.data && res.data.length > 0) {
              this.notices = res.data
            }
          }

        })
      },
    },
    created () {
      var sessionUser = sessionStorage.getItem('user')
      if(sessionUser) {
        sessionUser = JSON.parse(sessionUser)
        this.$set(this.user, 'userId', 1)
        this.$set(this.user, 'distributorId', 1)
      }
      this.getNotices()

    }

  }

</script>
