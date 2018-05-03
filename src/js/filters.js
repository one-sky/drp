/**
 * Created by cyw on 2017/10/16.
 */

import date from './date.js';

let formatMoney = value => {
  return !value || value == '' ? parseFloat(0).toFixed(2) : parseFloat(value).toFixed(2);
};
let formatAttribute = value => {
  var a;
  if (value && value != '') {
    a = value.split(';');
    if (a.length > 1 && a[1] != '') {
      var attribute = '';
      for (var i = 0; i < a.length - 2; i++) {
        attribute += a[i] + '；';
      }
      return attribute + a[i];
    } else {
      return a[0];
    }
  } else {
    return '';
  }
};

let formatDate = value => {
  return (!value || value == '') ? '' : date.formatDate.format(new Date(value), 'yyyy-MM-dd');
};

export { formatMoney, formatAttribute, formatDate };
