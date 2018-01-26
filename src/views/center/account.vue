<template>
  <div class="account">
    <el-tabs v-loading="loading" class="center-tab" v-model="activeTab">
      <!--基础信息-->
      <el-tab-pane label="基础信息" class="info" name="account" >
        <div class="top hor-center ver-center">
          <el-col :span="2">
            <img v-bind:src="user.headUrl" width="80" height="80" />
          </el-col>
          <el-col :span="20">
            <el-row justify="space-between">
              <el-col :span="8">
                <div>
                  会员账号：{{user.nickname}}
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  会员等级：{{user.vipName}}
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  账户积分：{{user.points}}
                </div>
              </el-col>

            </el-row>

            <el-row justify="space-between">
              <el-col :span="8">
                <div>
                  电子邮箱：{{user.email}}
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  注册时间：{{user.createTime|formatDate}}
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  联系电话：{{user.phone}}
                </div>
              </el-col>
            </el-row>
          </el-col>
        </div>

        <!--详细信息-->
        <div class="middle">
          <el-row>
            <el-col :span="8" :offset="1" class="flex-row ver-center">
              <div>
                详细信息
                <img src="../../imgs/center/triangle_down.png" width="11" height="6" />
              </div>
            </el-col>
          </el-row>
          <el-form :model="user" :rules="form_rules" ref="accountForm" label-width="100px" status-icon=true>
                  <el-form-item label="公司名称："  prop="name">
                    <el-input type="text" v-model="user.name" :disabled="isDisable.name && isDisable.name!=''?true:false"></el-input>
                  </el-form-item>
                  <el-form-item label="联系人：" prop="contractor">
                    <el-input type="text" v-model="user.contractor" :disabled="isDisable.contractor && isDisable.contractor!=''?true:false"></el-input>
                  </el-form-item>

                  <el-form-item label="性别：" prop="sexual">
                    <el-radio v-model="user.sexual" label="1" :disabled="isDisable.sexual && isDisable.sexual!=''?true:false">男</el-radio>
                    <el-radio v-model="user.sexual" label="2" :disabled="isDisable.sexual && isDisable.sexual!=''?true:false" style="margin-left:14px;">女</el-radio>
                  </el-form-item>

                  <el-form-item label="在线QQ：" prop="qq">
                    <el-input v-model="user.qq" :disabled="isDisable.qq && isDisable.qq!=''?true:false"></el-input>
                  </el-form-item>

                  <el-form-item label="旺旺号：" prop="wwId">
                    <el-input type="text" v-model="user.wwId" :disabled="isDisable.wwId && isDisable.wwId!=''?true:false"></el-input>
                  </el-form-item>

                  <el-form-item label="所在地区：" class="area">

                    <el-select class="province_select" v-model="user.province" placeholder="省"
                               :disabled="isDisable.province && isDisable.province!=''?true:false" >
                      <el-option
                        v-for="province in provinceList"
                        :key="province.regionCode"
                        :label="province.regionName"
                        :value="province.regionCode">
                      </el-option>
                    </el-select>
                    <el-select class="city_select" v-model="user.city" :disabled="isDisable.city && isDisable.city!=''?true:false" placeholder="市" >
                      <el-option
                        v-for="city in cityList"
                        :key="city.regionCode"
                        :label="city.regionName"
                        :value="city.regionCode">
                      </el-option>
                    </el-select>
                    <el-select class="county_select" v-model="user.area" :disabled="isDisable.area && isDisable.area!=''?true:false" placeholder="区">
                      <el-option
                        v-for="area in areaList"
                        :key="area.regionCode"
                        :label="area.regionName"
                        :value="area.regionCode">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="详细地址："prop="contractAddress">
                    <el-input type="text" v-model="user.contractAddress" :disabled="isDisable.contractAddress && isDisable.contractAddress!=''?true:false"></el-input>
                  </el-form-item>
                </el-form>
        </div>


        <!--店铺信息-->
        <div class="bottom">
          <el-row>
            <el-col :span="8" :offset="1" class="flex-row ver-center">
              <div>
                店铺信息
                <img src="../../imgs/center/triangle_down.png" width="11" height="6" />
              </div>
            </el-col>
          </el-row>
          <el-form :inline="true" v-model="storeDataList" label-width="100px">
            <template v-for="storeData in storeDataList">
              <el-form-item label="分销渠道：">
                <el-select v-model="storeData.channelId" :disabled="true">
                  <el-option v-for="item in channelOption" :key="item.id" :label="item.channelName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="店铺名：">
                <el-input type="text" :disabled="true" v-model="storeData.storeName" />
              </el-form-item>
              <el-form-item label="线下地址：" v-if="storeData.channelId===1">
                <div class="flex-row ver-center">
                  <el-input type="text" :disabled="true" v-model="storeData.storePath" />
                  <el-button v-on:click="fileDownload(storeData.storePic)" type="primary">下载文件</el-button>
                </div>

              </el-form-item>
              <el-form-item label="店铺链接：" v-else >
                <el-input type="text" :disabled="true" v-model="storeData.storePath" />
              </el-form-item>
            </template>
          </el-form>
          <div class="flex-row hor-center addBtn">
            <el-button @click="storeDialog = true">+ 添加渠道</el-button>
          </div>


        </div>

        <el-col :offset="2">
          <el-button v-if="!isAllDisable" type="primary" class="submitBtn" v-on:click="submitUserInfo('accountForm')">提交修改申请</el-button>
        </el-col>
      </el-tab-pane>

      <!--账号密码-->
      <el-tab-pane label="账号密码" class="password" name="password">
        <div class="middle">
          <el-row>
            <el-col :span="8" :offset="1" class="flex-row ver-center">
              <div>
                登录密码修改
                <img src="../../imgs/center/triangle_down.png" width="11" height="6" />
              </div>
            </el-col>
          </el-row>
          <el-form :model="resetUser" :rules="form_rules" ref="accountPassForm" labelWidth="120px" status-icon=true>
            <el-form-item label="会员账号：" >
              <el-input type="text" v-model="user.phone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="登录旧密码：" >
              <el-input type="password" v-model="resetUser.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="登录新密码：">
              <div class="flex-row ver-center">
                <el-input type="password" placeholder="建议密码使用字母+数字类型组合，长度6-16位" v-model="resetUser.password" @change="validatePassSafety" @blur="validatePass"></el-input>
                <img v-if="acpassMsgFlag>0" v-bind:src="inputMsg[acpassMsgFlag]" height="22" width="22"/>
              </div>

            </el-form-item>
            <div class="flex-row password-safety">
              <span>密码强度：</span>
              <div :style="{'margin-left':'10px', 'background-color':(1<=sec)?'#1ee251':'#b0b0b0'}">弱</div>
              <div :style="{'margin-left':'1px', 'background-color':(2<=sec)?'#1ee251':'#b0b0b0'}">中</div>
              <div :style="{'margin-left':'1px', 'background-color':(3<=sec)?'#1ee251':'#b0b0b0'}">强</div>
            </div>
            <el-form-item label="确认新密码：">
              <div class="flex-row ver-center">
                <el-input type="password" v-model="resetUser.rePassword" placeholder="再次输入密码" @blur="validateRePass"></el-input>
                <img v-if="acrePassMsgFlag>0" v-bind:src="inputMsg[acrePassMsgFlag]" height="22" width="22"/>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <el-col :offset="3">
          <el-button type="primary" v-on:click="submitUserInfo('accountPassForm')">确认修改</el-button>
        </el-col>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<style>
  @import "../../css/center/account.css";

</style>

<script>
  import md5 from '../../../node_modules/md5.js';
  import { getCenter, saveInformation, getProvinceList, getCityListByProvince, getAreaListByCity, getChannelList, getChannelOption, saveChannel, modifyPassword } from '../../api/api';
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  export default{
    components: {ElFormItem},
    data() {
      var validateQQ = (rule, value, callback) => {
        if(!value||value.length<=0){
          return callback(new Error('请输入在线qq号'));
        }else{
          if (!(/^\d{5,10}$/.test(value))) {
            return callback(new Error('请输入正确格式的在线qq号'));
          }else{
            callback();
          }
        }

      };
      var validatePic = (rule, value, callback) => {
        if (!value.length) {
          return callback(new Error('请上传文件'));
        }else{
          callback();
        }
      };
      return {

        activeTab: 'account',
        user: {
          id: 1,
          userId: 13,
          headUrl:null,
          nickname:null,
          email:null,
          totalAmount:null,
          vipId:null,
          vipName:null,
          points:null,
          nextvipName:null,
          nextLevelPoints:null,
          name:null, // companyName
          contractor:null,
          phone:null,
          sexual:null, // 1-男 2-女
          qq:null,
          wwId:null,
          province:null,
          city:null,
          area:null,
          contractAddress:null

        },
        resetUser:{
          vendorId: 1,
          target:null,
          oldPassword:null,
          password:null,
          rePassWord:null,
          sendType:null,
        },
        // 记录每一个formItem的填写状态
        isDisable:{},
        // 记录form是否都填写完整
        isAllDisable: false,

        storeDataList: [],
        provinceList: [{
          regionCode: null,
          regionName : null
        }],
        cityList: [
          {
            regionCode: null,
            regionName: null,
          }
        ],
        areaList: [],

        channelOption: [{
          id: '',
          channelName: null
        }],
        dialogStoreData: {
          channelId: null,
          storeName: null,
          storePath: null,
          storePic: [],
        },
        // 上传图片返回的URL
        storePic: null,
        // 修改账号密码提示信息icon
        inputMsg: [require('@/imgs/login/success_icon.png'), require('@/imgs/login/fail_icon.png')],
        acpassMsgFlag: -1,
        acrePassMsgFlag: -1,
        loading: false,
        storeDialog: false,


        // rules
        form_rules: {
          name: [
            {required: true, message:'请输入公司名称', trigger: 'blur'}
          ],
          contractor: [
            {required: true, message:'请输入联系人', trigger: 'blur'}
          ],
          sexual: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          qq: [
            { validator: validateQQ, trigger: 'blur'},
          ],
          wwId: [
            { required: true, message:'请输入旺旺账号', trigger: 'blur'}
          ],
          province: [
            {required: true, message:'请输入所在地区', trigger: 'change'}
          ],
          contractAddress: [
            {required: true, message:'请输入详细地址', trigger: 'blur'}
          ],
        },

        dialog_rules: {
          channelId: [
            {type: "number", required: true, message:'请选择分销渠道', trigger: 'change'}
          ],
          storeName: [
            {required: true, message:'请输入店铺名', trigger: 'blur'}
          ],
          storePath: [
            {required: true, message:'线上渠道请输入店铺链接；线下渠道请输入店铺地址并上传文件', trigger: 'blur'}
          ],
          storePic: [
            { validator: validatePic, trigger: 'change' }
          ]
        },

        onlyOne: false,

        regxs: [/[^a-zA-Z0-9_]/g,/[a-zA-Z]/g,/[0-9]/g],
        //密码强度级数
        sec:0

      }
    },
    methods: {

      //密码验证
      //密码强度验证
      validatePassSafety(){
        this.sec = 0;
        for (var i = 0; i < this.regxs.length; i++) {
          if (this.resetUser.password.match(this.regxs[i])) {
            this.sec++;
          }
        }
      },
      validatePass() {
        if (this.resetUser.password === '') {
          this.acpassMsgFlag = 1;
        } else {
          if (this.resetUser.password .length>=6 && this.resetUser.password.length<=16) {
            this.acpassMsgFlag = 0;
          }else{
            this.acpassMsgFlag = 1;
          }
          return;
        }
      },

      validateRePass() {
        if (this.resetUser.rePassword === '') {
          this.acrePassMsgFlag = 1;
        } else if (this.resetUser.rePassword !== this.resetUser.password) {
          this.acrePassMsgFlag = 1;
        } else {
          this.acrePassMsgFlag = 0;
        }
      },
      getUser: function() {
        this.loading = true;
        let param = {
          userId: 13
        };
        getCenter(param).then((res) => {
          this.loading = false;
          this.user = res.data;
          this.$set(this.user, 'distributorId', 1);
          for ( var p in this.user ){
            this.isDisable[ p ]=  this.user[ p ];
          }
          if(this.isDisable["name"]&&this.isDisable["contractor"]&&this.isDisable["sexual"]&&this.isDisable["qq"]&&this.isDisable["wwId"]&&this.isDisable["province"]&&this.isDisable["contractAddress"]){

            this.isAllDisable = true;
          }else{
            this.isAllDisable = false;
          }
          console.log(this.isAllDisable);
          console.log(this.user);
          this.getStoreData();
        });

      },

      // 获取店铺信息
      getStoreData(){
        let param = {
          distributorId: 1
        };
        getChannelList(param).then((res) => {
          this.storeDataList = res.data;
        })
      },

      // 获取省列表
      getProvince() {
        let param = {};
        getProvinceList(param).then((res) => {
          this.provinceList = res.data;
        });


      },

      // 获取市列表
      handleChangeProvince(value) {
        if(value && value!='') {
          let param = {
            parentCode: value
          };
          getCityListByProvince(param).then((res) => {
            this.cityList = res.data;
            if(this.cityList.length>0){
              this.user.city = this.cityList[0].regionCode;
            }
          });
        }

      },

      // 获取地区列表
      handleChangeCity(value) {
        console.log('city:'+value);
        if(value!=''&&value) {
          let param = {
            parentCode: value
          };
          getAreaListByCity(param).then((res) => {
            this.areaList = res.data;
            if(this.areaList.length>0){
              this.user.area = this.areaList[0].regionCode;
            }
          });

        }
      },

      // 获取渠道列表
      getChannelOption() {
        let param = {};
        this.channelOption = new Array();
        getChannelOption(param).then((res) => {
          if(res.status ==200) {
            var channelOption = res.data;
            for(var i in channelOption){
              if(channelOption[i].status==1){
                this.channelOption.push(channelOption[i]);
              }
            }
            console.log(this.channelOption)
          }
        });
      },


      // 提交修改申请
      submitUserInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.activeTab=='account'){
              this.loading = true;
              let param = Object.assign({}, this.user);
              saveInformation(param).then((res) => {
                if(res.status ==200) {
                  this.loading = false;
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.getUser();
                }

              });
            }else{
              if(!(this.acrePassMsgFlag==0 && this.acrePassMsgFlag==0)){
                this.$message({
                  message: '请填写正确的信息',
                  type: 'warning'
                });
                return;
              }
              let param = {
                vendorId: 1,
                userId: 13,
                phone: this.user.phone,
                oldPassword: this.resetUser.oldPassword,
                newPassword: this.resetUser.password,
              };
              param.oldPassword = md5(param.oldPassword).toUpperCase();
              param.newPassword = md5(param.newPassword).toUpperCase();
              modifyPassword(param).then((res) => {
                if(res.status ==300) {
                  this.$message({
                    message: '原密码错误，请重新输入原密码',
                    type: 'warning'
                  });
                  return;
                }
                if(res.status ==200) {
                  sessionStorage.removeItem("user");
                  this.$message({
                    message: '您的密码已经修改，请重新登录',
                    type: 'success'
                  });
                  this.$router.push({path: '/login'});
                }

              });
            }

          }else {
            console.log('error');
            return false;
          }

        });

      },

      // 提交新增渠道
      submitShopInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.storeDialog = false;
            this.dialogStoreData.distributorId = 1;
            let param = Object.assign({}, this.dialogStoreData);
            if(this.dialogStoreData.channelId==1){
              this.$set(param, 'storePic', this.storePic);
            }
            saveChannel(param).then((res) => {
              if(res.status ==200) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });

              }
            });

          }else {
            console.log("unsubmit   "+this.dialogStoreData.storePic);
            return false;

          }

        });
      },



      //file download
      fileDownload(file){
        console.log(file);
        window.open(file,"_blank")
      },

      //file upload
      handleRemove(file, fileList) {
        this.dialogStoreData.storePic = null;
        this.onlyOne = false;
      },

      handleFileSuccess(response, file, fileList) {
        this.dialogStoreData.storePic = fileList;
        this.storePic = fileList[0].response.data.filePath;
        console.log(this.dialogStoreData.storePic);
        this.onlyOne = true;
      },

      handlePreview(file) {
        console.log(file);
      },

      resetDialog(formName){
        this.dialogStoreData = {
          channelId: '',
          storeName: '',
          storePath: '',
          storePic: [],
        };
        this.$refs[formName].resetFields();

      },

    },
    created() {
      var sessionUser = sessionStorage.getItem('user');

      this.getUser();
      this.getProvince();
      this.getChannelOption();
    },
    watch: {
      'user.province': function(val,oldVal) {
        if(val){
          this.handleChangeProvince(val);

        }
      },
      'user.city': function(val,oldVal) {
        if(val!=oldVal){
          this.handleChangeCity(val);
        }

      }
    }
  };

</script>
