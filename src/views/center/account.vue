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
                  会员账号：{{user.nickName}}
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
                    <el-input type="text" v-model="user.name" :disabled="!!disableList.name"></el-input>
                  </el-form-item>
                  <el-form-item label="联系人：" prop="contractor">
                    <el-input type="text" v-model="user.contractor" :disabled="!!disableList.contractor"></el-input>
                  </el-form-item>

                  <el-form-item label="性别：" prop="sexual">
                    <el-radio v-model="user.sexual" label="1" :disabled="!!disableList.sexual">男</el-radio>
                    <el-radio v-model="user.sexual" label="2" :disabled="!!disableList.sexual" style="margin-left:14px;">女</el-radio>
                  </el-form-item>

                  <el-form-item label="在线QQ：" prop="qq">
                    <el-input v-model="user.qq" :disabled="!!disableList.qq"></el-input>
                  </el-form-item>

                  <el-form-item label="旺旺号：" prop="wwId">
                    <el-input type="text" v-model="user.wwId" :disabled="!!disableList.wwId"></el-input>
                  </el-form-item>

                  <el-form-item label="所在地区：" class="area">

                    <el-select class="province_select" ref="province" v-model="user.province" placeholder="省" @change="getCityListByProvince"
                               :disabled="!!disableList.province" >
                      <el-option
                        v-for="province in provinceList"
                        :key="province.regionCode"
                        :label="province.regionName"
                        :value="province.regionCode">
                      </el-option>
                    </el-select>
                    <el-select class="city_select" ref="city" v-model="user.city" :disabled="!!disableList.city" placeholder="市" @change="getAreaListByCity">
                      <el-option
                        v-for="city in cityList"
                        :key="city.regionCode"
                        :label="city.regionName"
                        :value="city.regionCode">
                      </el-option>
                    </el-select>
                    <el-select class="county_select" ref="area" v-model="user.area" :disabled="!!disableList.area" placeholder="区" >
                      <el-option
                        v-for="area in areaList"
                        :key="area.regionCode"
                        :label="area.regionName"
                        :value="area.regionCode">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="详细地址："prop="contractAddress">
                    <el-input
                      type="text"
                      v-model="user.contractAddress"
                      :disabled="!!disableList.contractAddress"
                    ></el-input>
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
                <el-select v-model="storeData.channelId" disabled="disabled">
                  <el-option v-for="item in channelOptionList" :key="item.id" :label="item.channelName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="店铺名：">
                <el-input type="text" disabled="disabled" v-model="storeData.storeName" />
              </el-form-item>
              <el-form-item label="线下地址：" v-if="storeData.channelId == 4">
                <div class="flex-row ver-center">
                  <el-input type="text" disabled="disabled" v-model="storeData.storePath" />
                  <el-button v-on:click="fileDownload(storeData.storePic)" type="primary">下载文件</el-button>
                </div>

              </el-form-item>
              <el-form-item label="店铺链接：" v-else >
                <el-input type="text" disabled="disabled" v-model="storeData.storePath" />
              </el-form-item>
            </template>
          </el-form>
          <div class="flex-row hor-center addBtn">
            <el-button @click="storeDialog = true">+ 添加渠道</el-button>
          </div>


        </div>

        <el-col :offset="2">
          <el-button v-if="!isAllDisable" type="primary" class="submitBtn" @click="submitUserInfo('accountForm')">提交修改申请</el-button>
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
              <el-input type="text" v-model="user.phone" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="登录旧密码：" >
              <el-input type="password" v-model="resetUser.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="登录新密码：">
              <div class="flex-row ver-center">
                <el-input type="password" placeholder="建议密码使用字母+数字类型组合，长度6-16位" v-model="resetUser.password" @change="validatePassSafety" @blur="validatePass"></el-input>
                <img v-if="acpassMsgFlag>0" v-bind:src="INPUT_MSG[acpassMsgFlag]" height="22" width="22"/>
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
                <img v-if="acrePassMsgFlag>0" v-bind:src="INPUT_MSG[acrePassMsgFlag]" height="22" width="22"/>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <el-col :offset="3">
          <el-button class="submitBtn" type="primary" @click="submitUserInfo('accountPassForm')">确认修改</el-button>
        </el-col>

      </el-tab-pane>
    </el-tabs>

     <el-dialog title="添加渠道" :visible.sync="storeDialog" v-loading="loading" @close="resetDialog('storeForm')" class="dialog">
      <el-form :model="addStore" :rules="dialog_rules" ref="storeForm" class="form" label-width="100px">
        <el-form-item label="分销渠道：" prop="channelId" >
            <el-select v-model="addStore.channelId" ref="channel">
              <el-option
                v-for="channel in channelOptionList"
                :key="channel.id"
                :label="channel.channelName"
                :value="channel.id"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="店铺名：" prop="storeName">
          <el-input type="text" v-model="addStore.storeName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="线下地址：" v-if="addStore.channelId == 4" prop="storePath">
            <el-input type="text" v-model="addStore.storePath" auto-complete="off" />
        </el-form-item>
        <el-form-item  v-else label="店铺链接：" prop="storePath">
            <el-input type="text" v-model="addStore.storePath" auto-complete="off" />
        </el-form-item>
        <el-form-item v-if="addStore.channelId == 4" prop="storePic" >
          <el-upload
            class="upload"
            ref="upload"
            action= "https://jsonplaceholder.typicode.com/posts/"
            :on-remove="handleRemove"
            :on-success="handleFileSuccess"
            :file-list="addStore.storePic"
            :multiple="false"
            :limit="1">
            <el-button size="small" type="primary" >选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
       <div slot="footer" class="center-dialog-bottom">
        <el-button @click="storeDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitShopInfo('storeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<style>
  @import "../../css/center/account.css";

</style>

<script>
  import md5 from 'md5';
  import {
    getDistributorDetail,
    saveInformation,
    getChannelList,
    getChannelOptionList,
    saveChannel,
    updatePassword
  } from '../../api/api';
  import {
    GetProvinceList,
    GetCityListByProvince,
    GetAreaListByCity
  } from '../../js/common';

  export default{
    data () {
      const VALIDATE_QQ = (rule, value, callback) => {
        if (!value || value.length <= 0) {
          return callback(new Error('请输入在线qq号'));
        } else {
          if (!(/^\d{5,10}$/.test(value))) {
            return callback(new Error('请输入正确格式的在线qq号'));
          } else {
            callback();
          }
        }
      };
      const VALIDATE_PIC = (rule, value, callback) => {
        if (!value.length) {
          return callback(new Error('请上传文件'));
        } else {
          callback();
        }
      };
      return {
        activeTab: 'account',
        user: {
          id: null,
          distributorId: null,
          headUrl: null,
          nickname: null,
          email: null,
          totalAmount: null,
          vipId: null,
          vipName: null,
          points: null,
          nextvipName: null,
          nextLevelPoints: null,
          name: null, // companyName
          contractor: null,
          phone: null,
          sexual: null, // 1-男 2-女
          qq: null,
          wwId: null,
          province: null,
          city: null,
          area: null,
          contractAddress: null

        },
        resetUser: {
          oldPassword: '',
          password: '',
          rePassword: '',
        },
        // 记录每一个formItem的填写状态
        disableList: {},
        // 记录form是否都填写完整
        isAllDisable: false,

        storeDataList: [],
        provinceList: [{
          regionCode: null,
          regionName: null
        }],
        cityList: [],
        areaList: [],

        channelOptionList: [{
          id: '',
          channelName: null
        }],
        addStore: {
          channelId: null,
          storeName: null,
          storePath: null,
          storePic: [],
        },
        // 修改账号密码提示信息icon
        INPUT_MSG: [
          require('@/imgs/login/success_icon.png'),
          require('@/imgs/login/fail_icon.png')
        ],
        acpassMsgFlag: -1,
        acrePassMsgFlag: -1,
        loading: false,
        storeDialog: false,
        // rules
        form_rules: {
          name: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          contractor: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          sexual: [
            { required: true, message: ' ', trigger: 'change' }
          ],
          qq: [
            {validator: VALIDATE_QQ, trigger: 'blur'},
          ],
          wwId: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请输入所在地区', trigger: 'change'}
          ],
          contractAddress: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
        },

        dialog_rules: {
          channelId: [
            {type: 'number', required: true, message: '请选择分销渠道', trigger: 'change'}
          ],
          storeName: [
            {required: true, message: '请输入店铺名', trigger: 'blur'}
          ],
          storePath: [
            {required: true, message: '线上渠道请输入店铺链接；线下渠道请输入店铺地址并上传文件', trigger: 'blur'}
          ],
          storePic: [
            { validator: VALIDATE_PIC, trigger: 'change' }
          ]
        },

        REGXS: [/[^a-zA-Z0-9_]/g, /[a-zA-Z]/g, /[0-9]/g],
        // 密码强度级数
        sec: 0
      };
    },
    methods: {

      // 密码验证
      // 密码强度验证
      validatePassSafety: function () {
        this.sec = 0;
        this.REGXS.map(item => {
          this.sec = this.resetUser.password.match(item) ? this.sec + 1 : this.sec;
        });
      },

      validatePass: function () {
        this.acpassMsgFlag = this.resetUser.password &&
          this.resetUser.password.length >= 6 &&
          this.resetUser.password.length <= 16 ? 0 : 1;
      },

      validateRePass: function () {
        this.acrePassMsgFlag = (this.resetUser.rePassword &&
          this.resetUser.rePassword === this.resetUser.password) ? 0 : 1;
      },
      getDistributorDetail: function () {
        this.loading = true;
        const param = {
          id: this.user.distributorId
        };
        getDistributorDetail(param).then((res) => {
          this.loading = false;
          this.$set(this, 'user', {...res.data});
          this.$set(this.user, 'distributorId', res.data.id);
          this.$set(this, 'disableList', {...res.data});
          if (this.disableList['name'] && this.disableList['contractor'] &&
            this.disableList['sexual'] && this.disableList['qq'] && this.disableList['wwId'] &&
            this.disableList['province'] && this.disableList['contractAddress']) {
            this.isAllDisable = true;
          } else {
            this.isAllDisable = false;
          }
          this.getChannelList();
        });
      },

      // 获取店铺信息
      getChannelList: function () {
        const param = {
          distributorId: this.user.distributorId
        };
        getChannelList(param).then((res) => {
          this.$set(this, 'storeDataList', res.data);
        });
      },

      // 获取省列表
      getProvinceList: function () {
        GetProvinceList((provinceList) => this.$set(this, 'provinceList', provinceList));
      },

      // 获取市列表
      getCityListByProvince: function (value) {
        GetCityListByProvince(value, (cityList) => {
          this.$set(this, 'cityList', cityList);
          this.user.city = this.cityList[0].regionCode;
        });
      },

      // 获取地区列表
      getAreaListByCity: function (value) {
        GetAreaListByCity(value, (areaList) => {
          this.$set(this, 'areaList', areaList);
          this.user.area = this.areaList[0].regionCode;
        });
      },

      // 获取渠道列表
      getChannelOptionList: function () {
        const param = {
          userType: 1
        };
        getChannelOptionList(param).then((res) => {
          if (res.status == 200) {
            this.channelOptionList = res.data;
          }
        });
      },
      // 提交修改申请
      submitUserInfo: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.activeTab == 'account') {
              this.loading = true;
              this.$set(this.user, 'provinceDesc', this.$refs.province.selectedLabel);
              this.$set(this.user, 'cityDesc', this.$refs.city.selectedLabel);
              this.$set(this.user, 'areaDesc', this.$refs.area.selectedLabel);
              saveInformation(this.user).then((res) => {
                if (res.status == 200) {
                  this.loading = false;
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 2000,
                    onClose: () => {
                      this.getDistributorDetail();
                    }
                  });
                }
              });
            } else {
              if (!(this.acrePassMsgFlag == 0 && this.acpassMsgFlag == 0)) {
                this.$message({
                  message: '请填写正确的信息',
                  type: 'warning',
                  duration: 2000,
                });
                return false;
              }
              const param = {
                phone: this.user.phone,
                oldPassword: md5(this.resetUser.oldPassword).toUpperCase(),
                newPassword: md5(this.resetUser.password).toUpperCase()
              };
              updatePassword(param).then((res) => {
                if (res.status == 200) {
                  if (res.data <= 0) {
                    this.$message({
                      message: '原密码错误，请重新输入原密码',
                      type: 'warning',
                      duration: 2000,
                    });
                  } else {
                    sessionStorage.removeItem('user');
                    this.$message({
                      message: '您的密码已经修改，请重新登录',
                      type: 'success',
                      duration: 2000,
                      onClose: () => {
                        this.$router.push({path: '/login'});
                      }
                    });
                  }
                }
              });
            }
          }
        });
      },

      // 提交新增渠道
      submitShopInfo: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const param = {
              ...this.addStore,
              distributorId: this.user.distributorId,
              name: this.$refs.channel.selectedLabel
            };
            saveChannel(param).then((res) => {
              if (res.status == 200 && res.data > 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 2000,
                  onClose: () => {
                    this.storeDialog = false;
                    this.getChannelList();
                  }
                });
              }
            });
          } else {
            return false;
          }
        });
      },

      // file download
      fileDownload: function (file) {
        window.open(file, '_blank');
      },

      // file upload
      handleRemove: function (file, fileList) {
        this.addStore.storePic = null;
      },

      handleFileSuccess: function (response, file, fileList) {
        this.addStore.storePic = fileList[0].response.data.filePath;
      },

      resetDialog: function (formName) {
        this.$refs[formName].resetFields();
      },

    },
    created () {
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getProvinceList();
      this.getDistributorDetail();
      this.getChannelList();
      this.getChannelOptionList();
    }
  };
</script>
