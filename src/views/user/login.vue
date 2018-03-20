<template>
  <div class="login flex-row hor-center">
    <div class="flex-col ver-end hor-center">
      <el-form ref="ruleForm" :model="user" :rules="form_rules">
        <el-form-item prop="phone">
          <div class="flex-row ver-center">
            <div class="flex-row hor-ver-center">
              <img src="../../imgs/login/user_icon.png" height="17" width="15"/>
            </div>
            <el-input type="text" v-model="user.phone" :class="{'input-error': phoneMsg}"></el-input>
          </div>

        </el-form-item>
        <el-form-item prop="password">
          <div class="flex-row ver-center">
            <div class="flex-row hor-ver-center">
              <img src="../../imgs/login/password_icon.png" height="17" width="15"/>
            </div>
            <el-input type="password" v-model="user.password" :class="{'input-error': passMsg}"></el-input>
          </div>
        </el-form-item>
        <el-form-item class="code" prop="verfiyCode">
          <div class="flex-row ver-center">
            <el-input type="text" placeholder="验证码" v-model="user.verfiyCode" :class="{'input-error': codeMsg}"></el-input>
            <el-button id="v_container" class="verify"></el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="user.checked">记住用户名</el-checkbox>
          <router-link to="/forgetPassword">忘记密码</router-link>
        </el-form-item>
        <el-form-item>
          <el-button class="submit" type="primary" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
  

<style >
  @import "../../css/user/login.css";
</style>


<script>
  import md5 from 'md5';
  import { login } from '../../api/api';
  export default {
    data () {
      const VALIDATEPHONE = (rule, value, callback) => {
        if (!value || !(/^1\d{10}$/.test(value))) {
          this.phoneMsg = true;
        } else {
          this.phoneMsg = false;
        }
        callback();
      };
      const VALIDATEPASS = (rule, value, callback) => {
        if (!value || value.length < 6 || value.length > 16) {
          this.passMsg = true;
        } else {
          this.passMsg = false;
        }
        callback();
      };
      const VALIDATECODE = (rule, value, callback) => {
        if (value && this.verifyCode.validate(value)) {
          this.codeMsg = false;
        } else {
          this.codeMsg = true;
        }
        callback();
      };
      return {
        activeTab: 'distributor',
        codeMsg: false,
        phoneMsg: false,
        passMsg: false,
        duration: 3000,  // 显示时间
        user: {
          phone: '',
          password: '',
          verfiyCode: '',
          checked: ''
        },
        // rules
        form_rules: {
          phone: [
            {validator: VALIDATEPHONE, trigger: 'blur'}
          ],
          verfiyCode: [
            {validator: VALIDATECODE, trigger: 'blur'}
          ],
          password: [
            { validator: VALIDATEPASS, trigger: 'blur' }
          ],

        },

        // 图片验证码
        verifyCode: null,
      };
    },

    methods: {

      login: function () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            const {
              phone
            } = this.user;
            // const password = this.user.password;
            const password = md5(this.user.password).toUpperCase();
            login({phone, password}).then((res) => {
              if (res.status == 200) {
                const userData = res.data;
                if (userData) {
                  userData.distributorId = userData.id;
                  // 存在用户但不存在分销商， 跳转到完善页面
                  if (userData.userId == 0) {
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    this.$message({
                      message: '用户信息不完善，请完善信息',
                      duration: 2000,
                      type: 'warning',
                      onClose: () => {
                        this.$router.push({path: '/register', query: { active: 1 }});
                      }
                    });
                    return;
                  } else {
                    sessionStorage.setItem('user', JSON.stringify(userData));
                    if (this.user.checked) {
                      this.setCookie('phone', this.user.phone, 15);
                      this.setCookie('password', md5(this.user.password).toUpperCase(), 15);
                    } else {
                      this.setCookie('phone', null, -1);
                      this.setCookie('password', null, -1);
                    }
                    this.$router.push({path: '/'});
                  }
                }
              }
              this.phoneMsg = true;
              this.passMsg = true;
              this.user.password = '';
            });
          }
        });
      },

      setCookie (cName, value, expiredays) {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
      },

      getCookie (cName) {
        if (document.cookie.length > 0) {
          let cStart = document.cookie.indexOf(cName + '=');
          if (cStart != -1) {
            cStart = cStart + cName.length + 1;
            let cEnd = document.cookie.indexOf(';', cStart);
            if (cEnd == -1) cEnd = document.cookie.length;
            return unescape(document.cookie.substring(cStart, cEnd));
          }
        }
        return '';
      }
    },
    mounted () {
      // 获取验证码
      this.verifyCode = new GVerify('v_container');
      // 从Cookie获取到用户名
      const phone = this.getCookie('phone');
      // 如果用户名为空,则给表单元素赋空值
      if (!phone) {
        this.$set(this.user, 'phone', null);
        this.$set(this.user, 'password', null);
        this.$set(this.user, 'checked', null);
      } else { // 获取对应的密码,并把用户名,密码赋值给表单
        const password = this.getCookie('password');
        this.$set(this.user, 'phone', phone);
        this.$set(this.user, 'password', password);
        this.$set(this.user, 'checked', true);
      }
    }
  };
</script>
