<template>
  <div class="message message-detail">
    <div class="top flex-col hor-center">
        <h1 class="fz_font stress-size">消息详情</h1>
        <el-button  type="primary" @click="returnMessageList">返回列表</el-button>
    </div>
    <!--title-->
    <div class="middle">
        <h2 class="title">{{message.title}}</h2>
        <p>{{message.effectDate|formatDate}}</p>
    </div>

    <!--content-->
    <div class="content">
      <div>致 :</div>
      <p v-html="message.detail"></p>
    </div>
<div class="test">1</div>
    </div>
    
  </div>
</template>

<style>
  @import "../../css/center/message.css";
</style>

<script>
  import { getNoticebyId } from '../../api/api';
  export default{
    data() {
      return {
        message:{},
      }
    },
    methods: {
      //获取消息详情
      getMessageById(){
        let param ={
          id: 1
        };
        getNoticebyId(param).then((res) => {
          if(res.status ==200){
            this.message=res.data;
          }

        })
      },
      returnMessageList(){
        this.$router.push({ path: '/center/messageList' });
      },

    },

    created () {
      this.getMessageById();
    }
  }
</script>
