<template>
  <div class="address-list" >
    <div class="flex-row">
      <div>您已经设置了</div>
      <div class="third-font-color">{{addressList.length}}</div>
      <div>个收货地址，最多可以创建：</div>
      <div class="third-font-color">5</div>
      <div>个</div>
    </div>
    <div class="flex-row-col">
      <template v-for="(item, index) in addressList">
        <div :class="{'address': true, 'flex-col': true, 'hor-ver-center':true, 'address-margin': index%4!=0 } ">
          <div class="flex-row option">
            <el-radio v-if="item.id === defaultAddress" v-model="defaultAddress" :label="item.id">默认地址</el-radio>
            <el-radio v-else  v-model="defaultAddress" :label="item.id">设为默认</el-radio>
            <div class="flex-row hor-end flex-normal">
              <el-button type="text" @click="openDialog(address)">
                <i class="el-icon-edit" ></i>
              </el-button>
              <el-button type="text">
                <i class="el-icon-delete" @click="handleDeleteAddress(item)"></i>
              </el-button>
            </div>

          </div>

          <div class="flex-row">
            <div class="icon">
              <img src="../../imgs/center/name.png" height="15" width="14"/>
            </div>
            {{item.receiveName}}
          </div>
          <div class="separator"></div>
          <div class="flex-row long-title">
            <div class="icon">
              <img src="../../imgs/center/address.png" height="17" width="11"/>
            </div>
            {{item.provinceDesc+" "+item.cityDesc+" "+item.areaDesc+" "+item.detailAddress}}
          </div>
          <div class="separator"></div>
          <div class="flex-row">
            <div class="icon">
              <img src="../../imgs/center/phone.png" height="17" width="11"/>
            </div>
            {{item.phone}}
          </div>
          <div class="separator"></div>
        </div>
      </template>
      <template v-if="addressList.length<5">
        <div :class="{address: true, 'flex-col': true, 'ver-center': true, 'address-margin': addressList.length%4!=0 }">
          <el-button class="add hor-start" @click="openDialog('')">
            <span>+</span>
            <div>新增地址</div>
          </el-button>

        </div>
      </template>
    </div>
    <el-dialog :title=title :visible.sync="dialogVisible" @close="resetDialog('addressDialogForm')" class="dialog">
      <el-form :model="add_addressForm" ref="addressDialogForm" :rules="form_rules" class="form" labelWidth="100px">
        <el-form-item label="收件人：" prop="receiveName">
          <el-input v-model="add_addressForm.receiveName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：">
          <el-select v-model="add_addressForm.province" placeholder="省">
            <el-option
              v-for="province in provinceList"
              :key="province.regionCode"
              :label="province.regionName"
              :value="province.regionCode">
            </el-option>
          </el-select>
          <el-select v-model="add_addressForm.city" :disabled="city_disabled" placeholder="市">
            <el-option
              v-for="city in cityList"
              :key="city.regionCode"
              :label="city.regionName"
              :value="city.regionCode">
            </el-option>
          </el-select>
          <el-select v-model="add_addressForm.area" :disabled="area_disabled" placeholder="区">
            <el-option
              v-for="area in areaList"
              :key="area.regionCode"
              :label="area.regionName"
              :value="area.regionCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input v-model="add_addressForm.detailAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="add_addressForm.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="center-dialog-bottom">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddress('addressDialogForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style >
  @import "../../css/center/addressList.css";

</style>
<script>
  import {
    getAddressList,
    getAddress,
    setIsDefault,
    modifyAddress,
    saveAddress,
    deleteAddress,
    getProvinceList,
    getCityListByProvince,
    getAreaListByCity
  } from '../../api/api';

  import Common from '../../js/common';

  export default {
    data () {
      const VALIDATEPHONE = (rule, value, callback) => {
        if (!value || value.length <= 0) {
          return callback(new Error('请输入手机号码'));
        } else {
          if (!(/^1\d{10}$/.test(value))) {
            return callback(new Error('请输入正确的手机号码'));
          } else {
            callback();
          }
        }
      };
      return {
        user: {
          id: 1,
          userId: 13,
          vendorId: 1
        },
        city_disabled: true,
        area_disabled: true,
        addressList: [],
        add_addressForm: {
          id: null,
          distributorId: null,
          receiveName: null,
          province: null,
          city: null,
          area: null,
          detailAddress: null,
          phone: null,
          isDefault: 'N'
        },
        title: '',
        provinceList: [],
        cityList: [],
        areaList: [],
        province: '',

        defaultAddress: '',
        dialogVisible: false,
        addressDivLoading: false,

        form_rules: {
          receiveName: [
            {required: true, message: '请输入收件人姓名', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请输入所在地区', trigger: 'change'}
          ],
          detailAddress: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
          phone: [
            {validator: VALIDATEPHONE, trigger: 'blur'}
          ],

        },
      };
    },
    methods: {

      getAddressList: () => {
        this.addressDivLoading = true;
        let param = {
          distributorId: this.user.id
        };
        getAddressList(param).then((res) => {
          if (res.status == 200) {
            this.addressList = res.data;
            this.defaultAddress = this.addressList.length > 0 ? this.addressList[0].id : '';
            this.addressDivLoading = false;
          }
        });
      },
      // 获取市列表
      handleChangeProvince: function (value) {
        this.cityList = Common.GetCityListByProvince(value);
        if (value && value != '') {
          this.city_disabled = false;
          let param = {
            parentCode: value
          };
          getCityListByProvince(param).then((res) => {
            this.cityList = res.data;
            if (this.cityList.length > 0) {
              this.add_addressForm.city = this.cityList[0].regionCode;
            }
          });
        } else {
          this.add_addressForm.city = null;
        }
      },

      // 获取地区列表
      handleChangeCity (value) {
        if (value != '' && value) {
          this.area_disabled = false;
          let param = {
            parentCode: value
          };
          getAreaListByCity(param).then((res) => {
            if (res.status == 200) {
              this.areaList = res.data;
              if (this.areaList.length > 0) {
                this.add_addressForm.area = this.areaList[0].regionCode;
              }
            }
          });
        } else {
          this.add_addressForm.area = null;
        }
      },

      // 提交地址
      submitAddress (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$set(this.add_addressForm,'distributorId', this.user.id);
            if (this.title === '新增地址') {
              let param = this.add_addressForm;
              saveAddress(param).then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.getAddressList();
                }
              });
            } else {
              let param = this.add_addressForm;
              modifyAddress(param).then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.getAddressList();
                }
              });
            }
          } else {
            return false;
          }
        });
      },

      // 删除地址
      handleDeleteAddress (val) {
        this.$confirm('确认删除该地址?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: val.id,
            distributorId: this.user.id
          };
          deleteAddress(param).then((res) => {
            if (res.status == 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.dialogVisible = false;
              this.getAddressList();
            } else {
              this.$message.error('提交失败');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      resetDialog (formName) {
        this.add_addressForm = {
          id: null,
          receiveName: null,
          province: null,
          city: null,
          area: null,
          detailAddress: null,
          phone: null
        };
        this.$refs[formName].resetFields();
      },

      handleChangeDefaultAddress (oldVal, val) {
        let param = {
          id: val,
          distributorId: this.user.id,
        };
        setIsDefault(param).then((res) => {
          this.defaultAddress = val;
        });
      },

      openDialog (val) {
        if (val !='' && val) {
          let param = {id: val.id};
          getAddress(param).then((res) => {
            this.add_addressForm = res.data;
            this.title = '修改地址';
          });
        } else {
          this.title = '新增地址';
        }
        this.dialogVisible = true;
      },

    },
    created () {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.getAddressList();
      this.provinceList =   Common.GetProvinceList();
    },
    watch: {
      defaultAddress: (val, oldVal) => {
        if (oldVal && oldVal != '') {
          this.handleChangeDefaultAddress(oldVal, val);
        }
      },
      'add_addressForm.province': (val, oldVal) => {
        if (val) {
          this.handleChangeProvince(val);
        }
      },
      'add_addressForm.city': (val, oldVal) => {
        if (val != oldVal) {
          this.handleChangeCity(val);
        }
      }
    }

  };
</script>
