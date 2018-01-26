<template>
  <div class="dashboard">
    <div class="top flex-row ver-center">
      <el-button>
        <el-upload
          action="http://106.12.21.230:8484/inheater-distribution/fileupload/UploadAvatarImg"
          :data="{distributorId:user.distributorId,userId:user.userId,originalPath:this.imageUrl}"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="!(imageUrl&&imageUrl!='')" width="80" height="80" :src="imageUrl">
          <div v-else  class="hor-ver-center avatar-uploader">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>

        </el-upload>
      </el-button>

      <div class="right flex-col hor-between">
        <div class="name flex-row ver-center">
          <div>
            您好，{{user.nickname}}
          </div>
          <div class="third-font-color">
            【已认证】
          </div>
          <img src="../../imgs/center/phone_exist.png" width="12" height="10">
          <img src="../../imgs/center/mail_exist.png" width="12" height="10">
        </div>

        <div class="flex-row">
          <div>
            积分：
          </div>
          <span class="third-font-color">
            {{user.points}}
          </span>
          <div>
            &nbsp;分
          </div>
          <div>
            &nbsp;|&nbsp;
          </div>
          <div>
            累计金额：
          </div>
          <div class="third-font-color">
            {{user.totalAmount|formatMoney(user.totalAmount)}}
          </div>
          <div>
            &nbsp;元
          </div>
        </div>

        <div class="flex-row">
          <div>
            您的等级：
          </div>

          <div class="flex-row ver-center">
            <img v-bind:src="require('@/imgs/center/vipLevel_'+user.vipId+'.png')" width="14" height="14">
            &nbsp;{{user.vipName}}
            <span v-show="user.nextvipName&&user.nextvipName!=''">（ 距下次升级为{{user.nextvipName}}仅需</span>
            <div v-show="user.nextvipName&&user.nextvipName!=''" class="third-font-color">
              {{user.nextLevelPoints}}
            </div>
            <div v-show="user.nextvipName&&user.nextvipName!=''">
              &nbsp;分）
            </div>
          </div>
          <div>
            &nbsp;|&nbsp;上次登录时间：
          </div>
          <div>
            {{user.lastUpdateTime|formatDate(user.lastUpdateTime)}}
          </div>

        </div>
      </div>
    </div>



    <div class="middle flex-col hor-center" v-model="statisticList">
      <div class="name ver-center">
        业务提醒
      </div>
      <div class="flex-row ver-center">
        <div>
          待付款单：
        </div>
        <span>
          {{statisticList.countNoPayment}}
        </span>
        <div>
          待发货单：
        </div>
        <span>
          {{statisticList.countNoShip}}
        </span>
        <div>
          待收货单：
        </div>
        <span>
          {{statisticList.countNoReceipt}}
        </span>
      </div>
      <div class="name ver-center">
        交易提醒
      </div>
      <div class="flex-row ver-center">
        <div>
          本月交易：
        </div>
        <span>
          {{statisticList.monthPaidAmount}}
        </span>
        <div>
          本月毛利：
        </div>
        <span>
          {{statisticList.monthGrossProfit}}
        </span>
        <div>
          本月订单：
        </div>
        <span>
          {{statisticList.monthOrderAmount}}
        </span>
      </div>
      <div class="name ver-center">
        业务统计
      </div>
      <div class="flex-row ver-center">
        <div>
          交易总额：
        </div>
        <span>
          {{statisticList.paidAmount}}
        </span>
        <div>
          累计毛利：
        </div>
        <span>
          {{statisticList.grossProfit}}
        </span>
        <div>
          累计订单：
        </div>
        <span>
          {{statisticList.orderAmount}}
        </span>
      </div>
    </div>

    <div class="bottom flex-col">
      <h1 class="name stress-size">
        品牌推荐
      </h1>
      <div class="flex-row-col">
        <template  v-for="brand in brandList">
          <router-link :to="{path: '/brandDetail', query:{ brand: brand.brandId }}">
            <img v-bind:src="brand.logo" width="138" height="80">
          </router-link>
        </template>
      </div>



    </div>
  </div>
</template>

<style>
  @import '../../css/center/dashboard.css';
</style>
<script>
  import { getCenter, orderAmount , getRecommendBrandList, getOrderStatistics} from '../../api/api';
  export default {
    data () {
      return {
        user: {
          vendorId: 1,
          userId: 13,
          image: null,
          nickname: '',
          phone: '',
          email: '',
          points: null,
          vipId: 1,
          vioName: '',
          nextvipName: '',
          nextLevelPoints: '',
          totalAmount: '',
          lastUpdateTime: '',
          distributorId: 1
        },
        statisticList: {},
        brandList: [{
        }],
        message: {},
        imageUrl: '',// 当前的头像
      }
    },
    methods: {
      getUser: function() {
        let param = {
          userId: 13
        };
        getCenter(param).then((res) => {
          if(res.status == 200) {
            this.user = res.data
            console.log( this.user)
            this.$set(this.user, 'distributorId', 1);
            this.imageUrl = res.data.headUrl;
          }
        })
      },
      getOrderStatistic() {
        let param = {
          distributorId: 1,
          vendorId: 1
        }
        orderAmount(param).then((res) => {
          if(res.status ==200) {
            this.statisticList = res.data
            param = {}
            var startDate = new Date()
            var year = startDate.getFullYear()
            var month = startDate.getMonth() + 1;
            var date1 = new Date(year + '-' + (parseInt(month + 1) + '-01' )).getTime() - 24 * 60 * 60 * 1000
            var yesterday = new Date()
            yesterday.setTime(date1)
            var endDate = yesterday.getDate();
            param = {
              distributorId: this.user.distributorId,
              startDate: '2015-01-01',
              endDate: year + '-' + month + '-' + endDate,
              type: 2
            }
            console.log(param)
            getOrderStatistics(param).then((res) => {
              if(res.status == 200) {
                var statistic = res.data;
                this.$set(this.statisticList, 'monthGrossProfit', 0)
                this.$set(this.statisticList, 'grossProfit', 0)
                if(statistic && statistic.length > 0) {
                  var profit = 0
                  for(var i = 0; i < statistic.length; i++) {
                    if(parseInt(statistic[i].dateStr.split[0]) == year && parseInt(statistic[i].dateStr.split[1]) == month) {
                      this.$set(this.statisticList,'monthGrossProfit', (statistic[i].orderProfit||statistic[i].orderProfit=='')?0:statistic[i].orderProfit);
                    }
                    profit += (statistic[i].orderProfit||statistic[i].orderProfit =='')?0:statistic[i].orderProfit
                  }
                  this.$set(this.statisticList, 'grossProfit', profit)
                }
              }
              console.log(profit)

            })
          }
        });


      },

      getRecommendBrandList() {
        let param = {
          vendorId: 1
        };
        getRecommendBrandList(param).then((res) => {
          if(res.status == 200){
            this.brandList = res.data;
          }

        })
      },


      handleAvatarSuccess(res, file) {
        this.imageUrl = res.data.filePath;//当前照片的路径
      }
    },



    created() {
      this.getUser();
      this.getOrderStatistic();
      this.getRecommendBrandList();
    },

  };
</script>


