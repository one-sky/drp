import {
    getChannelList,
    getAgentBrand,
    insertAgentBrand
} from '../api/api';

const USER = JSON.parse(sessionStorage.getItem('user'));
const distributorId = USER && USER.distributorId || 0;

// 获取分销商代理的渠道
function GetChannelList (callback) {
    const param = {
      distributorId: parseInt(distributorId)
    };
    getChannelList(param).then((res) => {
        if (res.status == 200) {
            callback(res.data);
        }
        return false;
    });
};

// 获取代理品牌
function GetAgentBrand (brandId, callback) {
    const param = {
      distributorId: parseInt(distributorId),
      brandId: parseInt(brandId)
    };
    getAgentBrand(param).then((res) => {
      if (res.status == 200) {
        callback(res.data);
      }
      return false;
    });
  };
  
  // 申请代理
  function InsertAgentBrand (brandId, channelId, callback) {
    const param = {
      distributorId: parseInt(distributorId),
      brandId: parseInt(brandId),
      channelId: parseInt(channelId)
    };
    console.log(param);
    insertAgentBrand(param).then((res) => {
      if (res.status == 200 && res.data > 0) {
        callback(res.data);
      }
      return false;
    });
  };

export {
    GetChannelList,
    GetAgentBrand,
    InsertAgentBrand
  };
