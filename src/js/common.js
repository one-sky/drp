import {
    getProvinceList,
    getCityListByProvince,
    getAreaListByCity,
    getChannelOptionList,
} from '../api/api';

// 获取省列表
function GetProvinceList (callback) {
    getProvinceList().then((res) => {
      if (res.status == 200) {
        callback(res.data);
      }
      return false;
    });
};

// 根据省获取市列表
function GetCityListByProvince (value, callback) {
    if (value) {
      const param = {
        provinceId: value
      };
      getCityListByProvince(param).then((res) => {
        callback(res.data);
      });
    }
    return false;
};

// 根据市获取地区列表
function GetAreaListByCity (value, callback) {
  if (value) {
    const param = {
      cityId: value
    };
    getAreaListByCity(param).then((res) => {
      callback(res.data);
    });
  }
  return false;
};

// 获取渠道列表
function GetChannelOptionList (callback) {
  const param = {
    userType: 1
  };
  getChannelOptionList(param).then((res) => {
    if (res.status == 200) {
      callback(res.data);
    }
  });
  return false;
};

export {
  GetProvinceList,
  GetCityListByProvince,
  GetAreaListByCity,
  GetChannelOptionList
};
