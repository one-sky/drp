<template>
  <div class="hor-center">
    <div class="notice-component flex-row ver-center">
      <div class="icon"></div>
      <span>最新公告</span>
      <span>:</span>
      <div class="content flex-row" v-for="item in noticeList">
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
  import { getNoticeList } from '../../api/api';
  export default{
    data () {
      return {
        user: {},
        noticeList: {}
      };
    },
    methods: {
//      获取公告详情
      getNoticeList: function () {
        let param = {
          isIndex: false,
          userType: 1,
          pageNum: 1,
          pageSize: 10
        };
        getNoticeList(param).then((res) => {
          if (res.status == 200) {
            this.noticeList = res.data;
          }
        });
      },
    },
    created () {
      this.$set(this, 'user', this.$store.state.user);
      this.getNoticeList();
    }
  };
</script>
