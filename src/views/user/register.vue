<template>
  <div class="register flex-row hor-center">
    <div class="step-one flex-col hor-ver-center" v-if="active===0" :key="active">
      <el-form :model="user" ref="ruleForm" :rules="form_rules" label-width="100px" >
        <el-form-item label="手机号码：" prop="phone">
          <div class="register_input">
            <el-input type="text" v-model="user.phone" ></el-input>
          </div>
          <div v-show="phoneMsg">
            该手机号码已被注册
          </div>
        </el-form-item>
        <el-form-item class="code" label="验证码：" prop="code">
          <div class="flex-row">
            <el-input type="text" v-model="user.code" ></el-input>
            <el-button type="primary" ref="codeBtn" :disabled="isAllowGetCode" @click="getCode">{{codeBtnText}}</el-button>
            <div v-show="codeMsg">
              验证码错误，请重新获取
            </div>
            <div v-show="codeFailMsg">
              验证码发送失败，请重新获取
            </div>
          </div>

        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" placeholder="请输入6-16位密码" v-model="user.password" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="rePassword">
          <el-input type="password" v-model="user.rePassword" ></el-input>
        </el-form-item>
      </el-form>
      <el-button class="next" type="primary" @click="submitRegister('ruleForm')">下一步</el-button>
    </div>

    <div class="step-two flex-col hor-ver-center" v-if="active===1" :key="active">
      <h1 class="stress-size fz-font">基本信息</h1>
      <el-form :model="user" ref="ruleForm" :rules="form_rules" :inline="true" label-width="100px" >
        <el-row>
          <el-form-item label="昵称：" prop="nickName">
            <el-input type="text" v-model="user.nickName" ></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contractor">
            <el-input type="text" v-model="user.contractor" ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="联系地址：">
            <el-input type="text" v-model="user.contractAddress" ></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱：" prop="email">
            <el-input type="email" v-model="user.email" ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="channel" label="主营渠道：">
            <el-checkbox-group v-model="user.saleChannel">
              <el-checkbox v-for="channel in channelList" :label="channel.id" :key="channel.id" :value="channel.id">{{channel.channelName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="partner" label="合作方式：">
            <el-radio class="radio" v-model="user.cooperateMode" label="2">一件代发</el-radio>
            <el-radio class="radio" v-model="user.cooperateMode" label="1">批发</el-radio>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button  type="primary" @click="submitRegister('ruleForm')">提 交</el-button>
    </div>

    <div class="step-three flex-col hor-ver-center" v-if="active===2" :key="active">
      <img src="../../imgs/login/register_success.png" height="56" width="56"/>
      <div>恭喜您{{user.nickName}}，成功注册成为智黑分销铜牌会员！</div>
      <div>您已经是智黑的会员啦，从现在起，你可以享受更多的会员服务，还等什么呢？</div>
      <div>赶快点击这里返回<router-link class="third-font-color" to="/">首页</router-link>或
        <router-link class="third-font-color" to="/login">登录</router-link>会员中心吧！
      </div>
    </div>
  </div>

</template>

<style >
  @import "../../css/user/register.css";
</style>

<script>
  import md5 from 'md5';
  import {
    getChannelOptionList,
    register,
    completeDistributor
  } from '../../api/api';
  const DURATION = 3000;
  export default {
    data () {
      const VALIDATEPHONE = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号码'));
        } else {
          if (!(/^1\d{10}$/.test(value))) {
            return callback(new Error('请输入正确的手机号码'));
          } else {
            this.$refs.ruleForm.isAllowGetCode = false;
            callback();
          }
        }
      };
      const VALIDATEPASS = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if (value.length >= 6 && value.length <= 16) {
            this.$refs.ruleForm.validateField('rePassword');
          } else {
            callback(new Error('请输入6-16位密码'));
          }
          callback();
        }
      };
      const VALIDATEREPASS = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认密码'));
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        active: 0,
        isAllowGetCode: false,
        second: 0,
        phoneMsg: false,
        codeMsg: false,
        codeFailMsg: false,
        user: {
          userId: '',
          phone: '',
          code: '',
          password: '',
          rePassword: '',
          nickName: '',
          contractor: '',
          contractAddress: '',
          email: '',
          saleChannel: [],
          cooperateMode: '',
        },
        channelList: '',
        // rules
        form_rules: {
          phone: [
            {validator: VALIDATEPHONE, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'change'}
          ],
          password: [
            { validator: VALIDATEPASS, trigger: 'blur' }
          ],
          rePassword: [
            { validator: VALIDATEREPASS, trigger: 'blur' }
          ],
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ],
          contractor: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],

        },
      };
    },
    methods: {
      run: function () {
        if (this.second > 0) {
          this.second = this.second - 1;
          setTimeout(this.run, 1000);
        } else {
          this.isAllowGetCode = false;
        }
      },

      // 获取渠道列表
      getChannelOptionList: function () {
        const param = {
          userType: 1
        };
        getChannelOptionList(param).then((res) => {
          this.channelList = res.data;
        });
      },

      getCode: function () {
        if (!this.user.phone || !(/^1\d{10}$/.test(this.user.phone))) {
          return;
        }
        this.second = 60;
        this.isAllowGetCode = true;
        this.run();
      },

      submitRegister (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.active == 0) { // first step
              const param = {
                phone: this.user.phone,
                password: md5(this.user.password).toUpperCase(),
              };
              this.$set(this, 'active', 1);
              this.$set(this.$store.state, 'step', 1);
              register(param).then((res) => {
                if (res.status == 200) {
                  this.active = 1;
                  this.$set(this.$store.state, 'step', 1);
                  
                  this.$set(this.user, 'userId', parseInt(res.data));
                  this.$set(this.user, 'phone', this.user.phone);
                } else if (res.status == 300) {
                  this.codeMsg = true;
                }
              });
            } else if (this.active == 1) { // second  step
              this.user.saleChannel = this.user.saleChannel.toString();
              completeDistributor(this.user).then((res) => {
                if (res.status == 200 && res.data == 1) {
                  this.active = 2;
                }
              });
            }
          }
        });
      }
    },
    computed: {
      codeBtnText: function () {
        return this.second > 0 ? `${this.second}后重新获取` : '获取验证码';
      }
    },
    created () {
      this.$store.commit('updateStepType', 'register');
      this.$store.commit('updateStep', '0');
      this.user = {...JSON.parse(sessionStorage.getItem('user'))};
      if (this.active != 1 && this.active != 0) {
        this.$router.push({ path: '/register' });
        return;
      }
      this.getChannelOptionList();
    },
    watch: {
      
      phoneMsg (val) {
        if (this._timeout) clearTimeout(this._timeout);
        if (val && !!DURATION) {
          this._timeout = setTimeout(
            () => {
              this.phoneMsg = false;
            },
            DURATION
          );
        }
      },
      codeMsg (val) {
        if (this._timeout) clearTimeout(this._timeout);
        if (val && !!DURATION) {
          this._timeout = setTimeout(
            () => {
              this.codeMsg = false;
            },
            DURATION);
        }
      },
      codeFailMsg (val) {
        if (this._timeout) clearTimeout(this._timeout);
        if (val && !!DURATION) {
          this._timeout = setTimeout(
            () => {
              this.codeFailMsg = false;
            },
            DURATION
          );
        }
      }
    }
  };
</script>
