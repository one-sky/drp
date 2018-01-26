/**
 * Created by cyw on 2017/10/14.
 */
import axios from 'axios';

let base = 'http://106.12.21.230:8484/inheater-distribution';

// let base = 'http://localhost:8282/drp';

axios.defaults.headers.get['Content-Type'] = 'application/json';

export const login = params => { return axios.post(`${base}/user/login`, params).then(res => res.data); };

export const sendsms = params => { return axios.post(`${base}/user/sendsms`, params).then(res => res.data); };

export const checkVerfiyCode = params => { return axios.post(`${base}/user/checkVerfiyCode`, params).then(res => res.data); };

export const register = params => { return axios.post(`${base}/user/register`, params).then(res => res.data); };

export const completeDistributor = params => { return axios.post(`${base}/user/completeDistributor`, params).then(res => res.data); };

export const checkMobileRegister = params => { return axios.post(`${base}/user/checkMobileRegister`, params).then(res => res.data); };

export const getUserByPhone = params => { return axios.post(`${base}/user/getUserByPhone`, params).then(res => res.data); };

export const forgetPassword = params => { return axios.post(`${base}/user/forgetPassword`, params).then(res => res.data); };

export const modifyPassword = params => { return axios.post(`${base}/user/modifyPassword`, params).then(res => res.data); };

export const getCenter = params => { return axios.post(`${base}/center/getCenter`, params).then(res => res.data); };

export const getAddressList = params => { return axios.post(`${base}/center/getAddressList`, params).then(res => res.data); };

export const getAddress = params => { return axios.post(`${base}/center/getAddress`, params).then(res => res.data); };

export const setIsDefault = params => { return axios.post(`${base}/center/setIdDefault`, params).then(res => res.data); };

export const saveAddress = params => { return axios.post(`${base}/center/saveAddress`, params).then(res => res.data); };

export const modifyAddress = params => { return axios.post(`${base}/center/modifyAddress`, params).then(res => res.data); };

export const deleteAddress = params => { return axios.post(`${base}/center/deteleAddress`, params).then(res => res.data); };

export const saveInformation = params => { return axios.post(`${base}/center/saveDistributorInfo`, params).then(res => res.data); };

// 获取用户公告
export const getMessageList = params => { return axios.post(`${base}/center/getMessageList`, params).then(res => res.data); };

// 获取用户公告详情
export const getMessagebyId = params => { return axios.post(`${base}/center/getMessagebyId`, params).then(res => res.data); };

export const getOrderStatus = params => { return axios.post(`${base}/common/getOrderStatus`, params).then(res => res.data); };

export const getProvinceList = params => { return axios.post(`${base}/common/getProviceList`, params).then(res => res.data); };

export const getCityListByProvince = params => { return axios.post(`${base}/common/getCityByProvice`, params).then(res => res.data); };

export const getAreaListByCity = params => { return axios.post(`${base}/common/getAreaByCity`, params).then(res => res.data); };

export const getChannelList = params => { return axios.post(`${base}/channel/getChannel`, params).then(res => res.data); };

export const getChannelOption = params => { return axios.post(`${base}/channel/getChannelOption`, params).then(res => res.data); };

export const saveChannel = params => { return axios.post(`${base}/channel/saveChannel`, params).then(res => res.data); };

// order
export const getPoints = params => { return axios.post(`${base}/order/getPoints`, params).then(res => res.data); };

export const getOrderList = params => { return axios.post(`${base}/order/getOrderList`, params).then(res => res.data); };

export const getOrderDetail = params => { return axios.post(`${base}/order/getOrderDetail`, params).then(res => res.data); };

export const orderAmount = params => { return axios.post(`${base}/order/orderAmount`, params).then(res => res.data); };

export const getAftermarkets = params => { return axios.post(`${base}/order/getAftermarkets`, params).then(res => res.data); };

export const generateOrder = params => { return axios.post(`${base}/order/generateOrder`, params).then(res => res.data); };

export const cancelOrder = params => { return axios.post(`${base}/order/cancelOrder`, params).then(res => res.data); };

export const getOrderStatistics = params => { return axios.post(`${base}/order/getOrderStatistics`, params).then(res => res.data); };

export const getStatisticOrderList = params => { return axios.post(`${base}/order/getStatisticOrderList`, params).then(res => res.data); };

// 订单明细统计
export const getOrderDetailByOrderCode = params => { return axios.post(`${base}/order/getOrderDetailByOrderCode`, params).then(res => res.data); };

// brand
// 获取类目
export const getCategoryList = params => { return axios.post(`${base}/brand/getCategoryList`, params).then(res => res.data); };
// 根据一级类目获取品牌列表
export const getBrandListByCategoryId = params => { return axios.post(`${base}/brand/getBrandListByCategoryId`, params).then(res => res.data); };
// 获取最新品牌
export const getNewstBrand = params => { return axios.post(`${base}/brand/getNewstBrand`, params).then(res => res.data); };
// 获取热门品牌
export const getRecommendBrandList = params => { return axios.post(`${base}/brand/getRecommendBrandList`, params).then(res => res.data); };
// 获取品牌详情(增加一个根据erpBrandId查询)
export const getBrandByBrandId = params => { return axios.post(`${base}/brand/getBrandByBrandId`, params).then(res => res.data); };
// 是否已代理
export const getDAgentBrand = params => { return axios.post(`${base}/brand/getDAgentBrand`, params).then(res => res.data); };
// 申请代理
export const insertDAgentBrand = params => { return axios.post(`${base}/brand/insertDAgentBrand`, params).then(res => res.data); };
// 获取个人中心已代理品牌
export const getBrandListByAgentBrand = params => { return axios.post(`${base}/brand/getBrandListByAgentBrand`, params).then(res => res.data); };
// 获取公告列表
export const getNotices = params => { return axios.post(`${base}/brand/getNotices`, params).then(res => res.data); };
// 获取公告详情
export const getNoticebyId = params => { return axios.post(`${base}/brand/getNoticebyId`, params).then(res => res.data); };
// 获取banner列表
export const getBannerList = params => { return axios.post(`${base}/resource/getBannerList`, params).then(res => res.data); };
// 获取一级类目下的商品
export const getCategorySpuList = params => { return axios.post(`${base}/brand/getCategorySpuList`, params).then(res => res.data); };
// 获取erp中的资料包
export const getBrandDetail = params => { return axios.post(`${base}/brand/getBrandDetail`, params).then(res => res.data); };

// product
// 商品列表
export const getProductList = params => { return axios.post(`${base}/product/getProductList`, params).then(res => res.data); };

// 获取一些特殊的商品列表，比如推荐商品，相关商品，最近浏览
export const getProductSpecialList = params => { return axios.post(`${base}/product/getProductSpecialList`, params).then(res => res.data); };

export const getProductDetail = params => { return axios.post(`${base}/product/getProductDetail`, params).then(res => res.data); };

// 获取商品包裹信息
export const getProductPackingInfo = params => { return axios.post(`${base}/product/getProductPackingInfo`, params).then(res => res.data); };

// 计算运费
export const calculateShippingCost = params => { return axios.post(`${base}/product/calculateShippingCost`, params).then(res => res.data); };

// 获取已关注商品
export const getCollectionProductList = params => { return axios.post(`${base}/product/getCollectionProductList`, params).then(res => res.data); };

// 取消已关注商品
export const cancelAttentionProduct = params => { return axios.post(`${base}/product/cancelAttentionProduct`, params).then(res => res.data); };

// 批量取消已关注商品
export const batchCancelAttentionProduct = params => { return axios.post(`${base}/product/batchCancelAttentionProduct`, params).then(res => res.data); };

// 收藏商品
export const addCollectionProduct = params => { return axios.post(`${base}/product/addCollectionProduct`, params).then(res => res.data); };

// 查看是否收藏
export const getCollectionProduct = params => { return axios.post(`${base}/product/getCollectionProduct`, params).then(res => res.data); };

// 批量置顶商品
export const stickyProduct = params => { return axios.post(`${base}/product/stickyProduct`, params).then(res => res.data); };

// shoppingCart
// 加入购物车
export const addToShoppingCart = params => { return axios.post(`${base}/shoppingCart/addToShoppingCart`, params).then(res => res.data); };

// 批量删除购物车
export const batchDeleteCollection = params => { return axios.post(`${base}/shoppingCart/batchDeleteCollection`, params).then(res => res.data); };

// 获取购物车
export const getShoppingCart = params => { return axios.post(`${base}/shoppingCart/getShoppingCart`, params).then(res => res.data); };

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

// 获取一级类目下的商品
export const getAgentBrand = params => { return axios.post(`${base}/manageDistributor/getAgentBrand`, params).then(res => res.data); };

// 显示区域：1:banner下方；2:讨论区-评测；3:讨论区-行业资讯
export const getArticleList = params => { return axios.post(`${base}/manageArticle/getArticleList`, params).then(res => res.data); };

// 显示区域：1:banner下方；2:讨论区-评测；3:讨论区-行业资讯
export const getArticleDetail = params => { return axios.post(`${base}/manageArticle/getArticleDetail`, params).then(res => res.data); };
// 显示区域：1:banner下方；2:讨论区-评测；3:讨论区-行业资讯
export const getArticleDetailById = params => { return axios.post(`${base}/manageArticle/getArticleDetailById`, params).then(res => res.data); };

// 促销列表
export const getPromotionList = params => { return axios.post(`${base}/managePromotion/getPromotionList`, params).then(res => res.data); };

// 促销详情
export const getPromotionDetail = params => { return axios.post(`${base}/managePromotion/getPromotionDetail`, params).then(res => res.data); };

export const getAuthorFile = params => { return axios.get(`${base}/file/list`, { params: params }); };

export const getDelivery = params => { return axios.get(`${base}/order/delivery`, { params: params }); };

export const getInvoiceList = params => { return axios.get(`${base}/invoice/list`, { params: params }); };
