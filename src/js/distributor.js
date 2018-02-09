import {
    getChannelList,
    getAgentBrand,
    insertAgentBrand,
    getCollectionProductList,
    addCollectionProduct,
    cancelCollectionProduct
} from '../api/api';

const USER = JSON.parse(sessionStorage.getItem('user'));
const distributorId = USER && parseInt(USER.distributorId) || 0;

// 获取分销商代理的渠道
function GetChannelList (callback) {
    const param = {
      distributorId
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
    distributorId,
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
    distributorId,
    brandId: parseInt(brandId),
    channelId: parseInt(channelId)
  };
  insertAgentBrand(param).then((res) => {
    if (res.status == 200 && res.data > 0) {
      callback(res.data);
    }
    return false;
  });
};

// 获取关注商品列表
function GetCollectionProductList (pageNum, pageSize, callback) {
  const param = {
    distributorId,
    pageNum: parseInt(pageNum),
    pageSize: parseInt(pageSize)
  };
  getCollectionProductList(param).then((res) => {
    if (res.status == 200) {
      callback(res);
    }
  });
};

// 批量收藏
function AddCollectionProduct (spuIds, callback) {
  const param = {
    distributorId,
    spuIds
  };
  addCollectionProduct(param).then((res) => {
    if (res.status == 200) {
      callback(res.data);
    }
  });
};

// 批量取消收藏
function CancelCollectionProduct (ids, callback) {
  const param = {
    distributorId,
    ids
  };
  cancelCollectionProduct(param).then((res) => {
    if (res.status == 200) {
      callback(res.data);
    }
  });
};

export {
    GetChannelList,
    GetAgentBrand,
    InsertAgentBrand,
    GetCollectionProductList,
    AddCollectionProduct,
    CancelCollectionProduct
  };
