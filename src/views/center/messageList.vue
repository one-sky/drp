<template>
  <div class="message message-list">
    <!--title-->
    <div class="top flex-col hor-center">
      <h1 class="fz_font stress-size">
        <img draggable="true" id="grag" ondragstart="drag(event)" src="../../imgs/center/message_not_read.png" height="17" width="18"/>
        消息列表
      </h1>
      <h4 class="fz_font">共112条</h4>
      <el-button type="primary">标记为已读</el-button>
    </div>
    <el-table class="table" ref="message_table" :data="messageList" border tooltip-effect="dark" @row-click="click">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="消息状态" width="104" align="center">
        <template scope="scope" >
          <img v-if="scope.row.haveRead=='Y'" src="../../imgs/center/message_read.png" height="17" width="18"/>
          <img v-else src="../../imgs/center/message_not_read.png" height="17" width="18"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="messageType" width="104" align="center" style="cursor: pointer">
        <template scope="scope">
          {{scope.row.receiverType|formateReceiverType}}
        </template>
      </el-table-column>
      <el-table-column label="主题" width="602">
        <template scope="scope">
          <div class="message-title flex-row">
            <div class="title" style="width:120px;">{{ scope.row.title }}</div>
            <div class="title" v-html="scope.row.detail"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="time" width="150" align="center">
        <template scope="scope">
          {{scope.row.effectDate|formatDate}}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="totalCount"
                     :current-page="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>
<style>
  @import "../../css/center/message.css";
</style>

<script>
  import { getNoticeList } from '../../api/api';
  export default{
    data () {
      return {
        user: {
          userId: 1,
          vendorId: 1,
          distributorId: 13
        },
        messageList: [],
        pageSize: null,
        totalCount: null,
        currentPage: 1
      };
    },
    methods: {
      // 获取消息详情
      getNoticeList: () => {
        let param = {
          vendorId: this.user.vendorId,
          userId: '',
          isIndexPage: 'Y',
          distributorId: '',
          pageNum: this.currentPage
        };
       getNoticeList(param).then((res) => {
         if (res.status == 200) {
           if (res.data && res.data.length > 0) {
             this.messageList = res.data;
             this.pageSize = res.page.pageSize;
             this.totalCount = res.page.totalNum;
           }
         }
       });
      },

      // 页码变更
      handleCurrentChange: (val) => {
        this.currentPage = val;
        this.getMessageList();
      },

      click: (row) => {
        this.$router.push({ path: '/center/messageDetail', query: {message: row.id} });
      }

    },
    created () {
      this.getNoticeList();
    },
    filters: {
      formateReceiverType: (value) => {
        if (!value || value == '' || value == 1) {
          return '平台公告';
        } else {
          return '用户公告';
        }
      }
    }
  };
</script>
