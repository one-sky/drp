/**
 * Created by cyw on 2017/10/14.
 */
import axios from 'axios';

// let base = 'http://106.12.21.230:8484/inheater-distribution';

let base = 'http://localhost:8282/drp';

axios.defaults.headers.get['Content-Type'] = 'application/json';

// 用户登陆
export const login = params => {
    return axios.post(`${base}/user/login`, params).then(res => res.data);
};

// 用户注册
export const register = params => {
    return axios.post(`${base}/user/register`, params).then(res => res.data);
};

// 修改密码
export const updatePassword = params => {
    return axios.post(`${base}/user/updatePassword`, params).then(res => res.data);
};

// 完善用户信息
export const completeDistributor = params => {
    return axios.post(`${base}/user/completeDistributor`, params).then(res => res.data);
};

// 获取分销商详细信息
export const getDistributorDetail = params => {
    return axios.post(`${base}/distributor/getDistributorDetail`, params).then(res => res.data);
};

// 获取分销商代理渠道列表
export const getChannelList = params => {
    return axios.post(`${base}/distributor/getChannelList`, params).then(res => res.data);
};

// 保存分销商代理渠道
export const saveChannel = params => {
    return axios.post(`${base}/distributor/saveChannel`, params).then(res => res.data);
};

// 获取地址列表
export const getAddressList = params => {
    return axios.post(`${base}/distributor/getAddressList`, params).then(res => res.data);
};

// 获取地址详情
export const getAddress = params => {
    return axios.post(`${base}/distributor/getAddress`, params).then(res => res.data);
};

// 修改或新增地址
export const saveAddress = params => {
    return axios.post(`${base}/distributor/saveAddress`, params).then(res => res.data);
};

// 设置默认地址
export const setAddressDefault = params => {
    return axios.post(`${base}/distributor/setAddressDefault`, params).then(res => res.data);
};

// 删除地址
export const deleteAddress = params => {
    return axios.post(`${base}/distributor/deleteAddress`, params).then(res => res.data);
};

// 查询分销商品牌代理情况
export const getBrandListByAgentBrand = params => {
    return axios.post(`${base}/distributor/getBrandListByAgentBrand`, params).then(res => res.data);
};

// 获取已代理品牌
export const getAgentBrand = params => {
    return axios.post(`${base}/distributor/getAgentBrand`, params).then(res => res.data);
};

// 申请代理
export const insertAgentBrand = params => {
    return axios.post(`${base}/distributor/insertAgentBrand`, params).then(res => res.data);
};

// 获取已关注商品列表
export const getCollectionProductList = params => {
    return axios.post(`${base}/distributor/getCollectionProductList`, params).then(res => res.data);
};

// 批量取消已关注商品
export const cancelCollectionProduct = params => {
    return axios.post(`${base}/distributor/cancelCollectionProduct`, params).then(res => res.data);
};

// 批量关注商品
export const addCollectionProduct = params => {
    return axios.post(`${base}/distributor/addCollectionProduct`, params).then(res => res.data);
};

// 加入或购物车中减少删除等
export const updateShoppingCartList = params => {
    return axios.post(`${base}/distributor/updateShoppingCartList`, params).then(res => res.data);
};

// 获取购物车列表
export const getShoppingCartList = params => {
    return axios.post(`${base}/distributor/getShoppingCartList`, params).then(res => res.data);
};

// 获取banner列表
export const getBannerList = params => {
    return axios.post(`${base}/resource/getBannerList`, params).then(res => res.data);
};

// 获取评测、行业资讯
export const getArticleList = params => {
    return axios.post(`${base}/resource/getArticleList`, params).then(res => res.data);
};

// 获取公告列表
export const getNoticeList = params => {
    return axios.post(`${base}/resource/getNoticeList`, params).then(res => res.data);
};

// 促销列表
export const getPromotionList = params => {
    return axios.post(`${base}/resource/getPromotionList`, params).then(res => res.data);
};

// 获取渠道列表
export const getChannelOptionList = params => {
    return axios.post(`${base}/resource/getChannelOptionList`, params).then(res => res.data);
};

// 获取省列表
export const getProvinceList = params => {
    return axios.get(`${base}/resource/getProvinceList`, params).then(res => res.data);
};

// 根据省获取市列表
export const getCityListByProvince = params => {
    return axios.post(`${base}/resource/getCityByProvince`, params).then(res => res.data);
};

// 根据市获取区列表
export const getAreaListByCity = params => {
    return axios.post(`${base}/resource/getAreaByCity`, params).then(res => res.data);
};

// 获取类目
export const getCategoryList = params => {
    return axios.post(`${base}/category/getCategoryList`, params).then(res => res.data);
};

// 获取类目详情by parentId
export const getCategoryByParentId = params => {
    return axios.post(`${base}/category/getCategoryByParentId`, params).then(res => res.data);
};

// 获取属性列表
export const getAttributeList = params => {
    return axios.post(`${base}/category/getAttributeList`, params).then(res => res.data);
};

// 获取最新品牌
export const getNewBrandList = params => {
    return axios.post(`${base}/brand/getNewBrandList`, params).then(res => res.data);
};

// 根据一级类目获取品牌列表
export const getBrandListByCategoryId = params => {
    return axios.post(`${base}/brand/getBrandListByCategoryId`, params).then(res => res.data);
};

// 获取品牌详情
export const getBrandById = params => {
    return axios.post(`${base}/brand/getBrandById`, params).then(res => res.data);
};

// 商品列表
export const getProductList = params => {
    return axios.post(`${base}/product/getProductList`, params).then(res => res.data);
};

// 获取spu明细
export const getSpuDetail = params => {
    return axios.post(`${base}/product/getSpuDetail`, params).then(res => res.data);
};

// 获取订单列表
export const getOrderList = params => {
    return axios.post(`${base}/order/getOrderList`, params).then(res => res.data);
};

// 获取订单详情
export const getOrderDetail = params => {
    return axios.post(`${base}/order/getOrderDetail`, params).then(res => res.data);
};

// 取消订单
export const cancelOrder = params => {
    return axios.post(`${base}/order/cancelOrder`, params).then(res => res.data);
};

export const checkVerfiyCode = params => {
    return axios.post(`${base}/user/checkVerfiyCode`, params).then(res => res.data);
};

export const checkMobileRegister = params => {
    return axios.post(`${base}/user/checkMobileRegister`, params).then(res => res.data);
};

export const getUserByPhone = params => {
    return axios.post(`${base}/user/getUserByPhone`, params).then(res => res.data);
};

export const forgetPassword = params => {
    return axios.post(`${base}/user/forgetPassword`, params).then(res => res.data);
};

export const modifyPassword = params => {
    return axios.post(`${base}/user/modifyPassword`, params).then(res => res.data);
};

export const saveInformation = params => { return axios.post(`${base}/center/saveDistributorInfo`, params).then(res => res.data); };

// 获取用户公告
export const getMessageList = params => { return axios.post(`${base}/center/getMessageList`, params).then(res => res.data); };

// 获取用户公告详情
export const getMessagebyId = params => { return axios.post(`${base}/center/getMessagebyId`, params).then(res => res.data); };

export const getOrderStatus = params => { return axios.post(`${base}/common/getOrderStatus`, params).then(res => res.data); };

export const getChannelOption = params => { return axios.post(`${base}/channel/getChannelOption`, params).then(res => res.data); };

export const orderAmount = params => { return axios.post(`${base}/order/orderAmount`, params).then(res => res.data); };

export const getAftermarkets = params => { return axios.post(`${base}/order/getAftermarkets`, params).then(res => res.data); };

export const generateOrder = params => { return axios.post(`${base}/order/generateOrder`, params).then(res => res.data); };

export const getOrderStatistics = params => { return axios.post(`${base}/order/getOrderStatistics`, params).then(res => res.data); };

export const getStatisticOrderList = params => { return axios.post(`${base}/order/getStatisticOrderList`, params).then(res => res.data); };

// 订单明细统计
export const getOrderDetailByOrderCode = params => { return axios.post(`${base}/order/getOrderDetailByOrderCode`, params).then(res => res.data); };

// brand

// 获取公告详情
export const getNoticebyId = params => { return axios.post(`${base}/brand/getNoticebyId`, params).then(res => res.data); };

// 获取一级类目下的商品
export const getCategorySpuList = params => { return axios.post(`${base}/brand/getCategorySpuList`, params).then(res => res.data); };
// 获取erp中的资料包
export const getBrandDetail = params => { return axios.post(`${base}/brand/getBrandDetail`, params).then(res => res.data); };

// product

// 获取一些特殊的商品列表，比如推荐商品，相关商品，最近浏览
export const getProductSpecialList = params => { return axios.post(`${base}/product/getProductSpecialList`, params).then(res => res.data); };

// 批量置顶商品
export const stickyProduct = params => { return axios.post(`${base}/product/stickyProduct`, params).then(res => res.data); };
// 从购物车中收藏商品
export const collectionProductToShoppingCart = params => { return axios.post(`${base}/shoppingCart/collectionProductToShoppingCart`, params).then(res => res.data); };

// 移至收藏夹
export const batchMoveCollection = params => { return axios.post(`${base}/shoppingCart/batchMoveCollection`, params).then(res => res.data); };

// pay
export const getCharge = params => { return axios.post(`${base}/distributionPay/getCharge`, params).then(res => res.data); };

export const searchCharge = params => { return axios.post(`${base}/distributionPay/searchCharge`, params).then(res => res.data); };

// refund
export const getRefundList = params => { return axios.post(`${base}/refund/getRefundList`, params).then(res => res.data); };

// 获取一个orderItem的已退货个数
export const getRefundNum = params => { return axios.post(`${base}/refund/getRefundNum`, params).then(res => res.data); };

export const getRefundReasons = params => { return axios.post(`${base}/refund/getRefundReasons`, params).then(res => res.data); };

export const saveRefund = params => { return axios.post(`${base}/refund/saveRefund`, params).then(res => res.data); };

// 显示区域：1:banner下方；2:讨论区-评测；3:讨论区-行业资讯
export const getArticleDetail = params => { return axios.post(`${base}/manageArticle/getArticleDetail`, params).then(res => res.data); };
// 显示区域：1:banner下方；2:讨论区-评测；3:讨论区-行业资讯
export const getArticleDetailById = params => { return axios.post(`${base}/manageArticle/getArticleDetailById`, params).then(res => res.data); };

// 促销详情
export const getPromotionDetail = params => { return axios.post(`${base}/managePromotion/getPromotionDetail`, params).then(res => res.data); };

export const getAuthorFile = params => { return axios.get(`${base}/file/list`, { params: params }); };

export const getDelivery = params => { return axios.get(`${base}/order/delivery`, { params: params }); };

export const getInvoiceList = params => { return axios.get(`${base}/invoice/list`, { params: params }); };
