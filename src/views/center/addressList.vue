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
            <el-radio v-if="item.id == defaultAddress" v-model="defaultAddress" :label="item.id">默认地址</el-radio>
            <el-radio v-else  v-model="defaultAddress" :label="item.id">设为默认</el-radio>
            <div class="flex-row hor-end flex-normal">
              <el-button type="text" @click="openDialog(item.id)">
                <i class="el-icon-edit" ></i>
              </el-button>
              <el-button type="text">
                <i class="el-icon-delete" @click="deleteAddress(item)"></i>
              </el-button>
            </div>

          </div>

          <div class="flex-row">
            <div class="icon">
              <img src="../../imgs/center/name.png" height="15" width="14"/>
            </div>
            {{item.receiverName}}
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
    <el-dialog :title=title :visible.sync="dialogVisible" @close="resetDialog('addressDialogForm')" class="dialog" custom-class="center-dialog-bottom">
      <el-form :model="updateAddress" ref="addressDialogForm" :rules="form_rules" class="form" labelWidth="100px">
        <el-form-item label="收件人：" prop="receiverName">
          <el-input v-model="updateAddress.receiverName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：">
          <el-select v-model="updateAddress.province" ref="province" placeholder="省" @change="getCityListByProvince">
            <el-option
              v-for="province in provinceList"
              :key="province.regionCode"
              :label="province.regionName"
              :value="province.regionCode">
            </el-option>
          </el-select>
          <el-select v-model="updateAddress.city" ref="city" placeholder="市" @change="getAreaListByCity">
            <el-option
              v-for="city in cityList"
              :key="city.regionCode"
              :label="city.regionName"
              :value="city.regionCode">
            </el-option>
          </el-select>
          <el-select v-model="updateAddress.area" ref="area" placeholder="区">
            <el-option
              v-for="area in areaList"
              :key="area.regionCode"
              :label="area.regionName"
              :value="area.regionCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input v-model="updateAddress.detailAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="updateAddress.phone" auto-complete="off"></el-input>
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
    saveAddress,
    setAddressDefault,
    deleteAddress,
  } from '../../api/api';

  import {
    GetProvinceList,
    GetCityListByProvince,
    GetAreaListByCity
  } from '../../js/common';

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
        user: {},
        addressList: [],
        updateAddress: {
          id: 0,
          distributorId: null,
          receiverName: null,
          province: null,
          city: null,
          area: null,
          detailAddress: null,
          phone: null,
        },
        title: '',
        provinceList: [],
        cityList: [],
        areaList: [],

        defaultAddress: '',
        dialogVisible: false,

        form_rules: {
          receiverName: [
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

      getAddressList: function () {
        const param = {
          id: this.user.id
        };
        getAddressList(param).then((res) => {
          if (res.status == 200) {
            this.addressList = res.data;
            this.defaultAddress = this.addressList.length > 0 ? this.addressList[0].id : '';
          }
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
          this.$set(this.updateAddress, 'city', this.cityList[0].regionCode);
        });
      },

      // 获取地区列表
      getAreaListByCity: function (value) {
        GetAreaListByCity(value, (areaList) => {
          this.$set(this, 'areaList', areaList);
          this.$set(this.updateAddress, 'area', this.areaList[0].regionCode);
          this.user.area = this.areaList[0].regionCode;
        });
      },

      // 提交地址
      submitAddress (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const param = {
              ...this.updateAddress,
              distributorId: this.user.id,
              provinceDesc: this.$refs.province.selectedLabel,
              cityDesc: this.$refs.city.selectedLabel,
              areaDesc: this.$refs.area.selectedLabel
            };
            saveAddress(param).then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 2000,
                  onClose: () => {
                    this.dialogVisible = false;
                    this.getAddressList();
                  }
                });
              }
            });
          }
        });
      },

      // 删除地址
      deleteAddress (val) {
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
        this.updateAddress = {
          id: null,
          receiverName: null,
          province: null,
          city: null,
          area: null,
          detailAddress: null,
          phone: null
        };
        this.$refs[formName].resetFields();
      },

      setAddressDefault: function (val) {
        let param = {
          id: val,
          distributorId: this.user.id,
        };
        setAddressDefault(param).then((res) => {
          if (res.status == 200 && res.data > 0) {
            this.defaultAddress = val;
          }
        });
      },

      openDialog: function (id) {
        this.dialogVisible = true;
        if (id) {
          getAddress({id}).then((res) => {
            this.$set(this, 'updateAddress', res.data);
            this.title = '修改地址';
          });
        } else {
          this.$set(this.updateAddress, 'id', 0);
          this.title = '新增地址';
        }
      },
    },
    created () {
      this.$set(this, 'user', JSON.parse(sessionStorage.getItem('user')));
      this.getAddressList();
      this.getProvinceList();
    },
    watch: {
      'defaultAddress': function (val, oldVal) {
          val && this.setAddressDefault(val);
      }
    }

  };
</script>
