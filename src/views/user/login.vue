<template>
  <div class="login flex-row hor-center">
    <div class="flex-col ver-end hor-center">
      <el-form ref="ruleForm" :model="user" :rules="form_rules">
        <el-form-item prop="phone">
          <div class="flex-row ver-center">
            <div class="flex-row hor-ver-center">
              <img src="../../imgs/login/user_icon.png" height="17" width="15"/>
            </div>
            <el-input type="text" v-model="user.phone"></el-input>
          </div>

        </el-form-item>
        <el-form-item prop="password">
          <div class="flex-row ver-center">
            <div class="flex-row hor-ver-center">
              <img src="../../imgs/login/password_icon.png" height="17" width="15"/>
            </div>
            <el-input type="password" v-model="user.password"></el-input>
          </div>
          <div class="error" v-show="submitMsg">
            输入密码错误
          </div>
        </el-form-item>
        <el-form-item class="code" prop="verfiyCode">
          <div class="flex-row ver-center">
            <el-input type="text" placeholder="验证码" v-model="user.verfiyCode"></el-input>
            <el-button id="v_container" class="vertify"></el-button>
            <div v-show="codeMsg">
              验证码错误，请重新输入
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="user.checked">记住用户名</el-checkbox>
          <router-link to="/forgetPassword">忘记密码</router-link>
        </el-form-item>
        <el-form-item>
          <el-button class="submit" type="primary" @click="submit('ruleForm')">登 录</el-button>
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
      var validatePhone = (rule, value, callback) => {
        if (value.length <= 0) {
          return callback(new Error('请输入账号'));
        } else {
          if (!(/^1\d{10}$/.test(value))) {
            return callback(new Error('请输入正确的账号'));
          } else {
            callback();
          }
        }

      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.password .length>=6 && this.user.password.length<=16) {
            callback();
          }else{
            callback(new Error('请输入6-16位密码'));
          }

        }
      };
      return{
        activeTab: 'distributor',
        codeMsg :false,
        submitMsg: false,
        duration:3000,  //显示时间
        user:{phone:'', password:'', verfiyCode:'', checked: ''},

        //rules
        form_rules: {
          phone: [
            {validator: validatePhone, trigger: 'blur'}
          ],
          verfiyCode: [
            {required: true, message:'请输入验证码', trigger: 'blur'}
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],

        },

        //图片验证码
        verifyCode: null,
      }
    },

    methods:{
      checkCode() {
        if(this.user.verfiyCode){
          var res = this.verifyCode.validate(this.user.verfiyCode);
          if(res) {
            this.codeMsg = false;
            return true;
          }else{
            this.codeMsg = true;
            return false;
          }
          this.submit('ruleForm');
        }else{
          return false;
        }

      },

      submit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(1){
              let param ={
                phone: this.user.phone,
                password: this.user.password,
              }
              login(param).then((res) =>{
                  console.log(res)
                if(res.status == 200){
                  const userData = res.data;
                  sessionStorage.setItem("user", JSON.stringify(userData));
                  //status==3， 跳转到完善页面
console.log(userData.status)
                  if(userData.status == 3){
                    this.$message({
                      message: '用户信息不完善，请完善信息',
                      type: 'warning'
                    });
                    this.$router.push({path:'/register',query:{ active: 1 }});
                  } else if(userData.status == 4){
                    
                    if(this.user.checked){
                      this.setCookie ( 'phone',this.user.phone,  15 ) ;
                      this.setCookie ( "password", md5(this.user.password).toUpperCase(), 15 ) ;
                    }else{
                      this.setCookie ( 'phone',null,  -1) ;
                      this.setCookie ( 'password',null,  -1) ;
                    }
                    this.$router.push({path: '/'});
                  }
                }else{
                  this.submitMsg = true;
                  this.user.password ='';


                }
              })
            }

          }
        });
      },

      setCookie(c_name,value,expiredays){
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
          ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
      },
      getCookie(c_name){
        if (document.cookie.length>0) {
          let c_start=document.cookie.indexOf(c_name + "=")
          if (c_start!=-1) {
            c_start=c_start + c_name.length+1
            let c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
          }
        }
        return ""
      }
    },
    mounted(){

      //获取验证码
      this.verifyCode = new GVerify("v_container");
      //从Cookie获取到用户名
      var phone = this.getCookie("phone") ;
      //如果用户名为空,则给表单元素赋空值
      if ( phone == "" ) {
        this.$set(this.user, 'phone', null);
        this.$set(this.user, 'password', null);
        this.$set(this.user, 'checked', null);
      }
      //获取对应的密码,并把用户名,密码赋值给表单
      else {
        var password = this.getCookie(password) ;
        this.$set(this.user, 'phone', phone);
        this.$set(this.user, 'password', password);
        this.$set(this.user, 'checked', true);
      }
    },
    watch:{
      submitMsg(val){
        if (this._timeout) clearTimeout(this._timeout)
        if (val && !!this.duration) {
          this._timeout = setTimeout(()=> this.submitMsg = false, this.duration)
        }
      },
      codeMsg(val){
        if (this._timeout) clearTimeout(this._timeout)
        if (val && !!this.duration) {
          this._timeout = setTimeout(()=> this.codeMsg = false, this.duration)
        }
      }
    }
  }
</script>
