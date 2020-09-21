// ==UserScript==
// @name         Test JS Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require
// @match        https://www.mangoerp.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    initialize();
})();

function initialize(){
    //插入翻譯按鈕
    insert_btn_html='<li class="btn btn-sm btn-warning btn_translation">Trans...</li>';
    $('.nav1-main').append(insert_btn_html);
    $('.nav1-main').prepend(insert_btn_html);

    //按鈕點擊翻譯
    $('.btn_translation').click(function(){
        collect_words = collect_translation_words();
        translate_website(collect_words);
    })

    $( document ).ajaxComplete(function() {
        collect_words = collect_translation_words();
        translate_website(collect_words);
    });
}

//
function collect_translation_words(){
    translate_block_words = translate_block_statement();
    first_menu_words = first_level_memu();
    second_memu_words = second_level_memu();
    third_menu_words = third_level_menu();
    tables_title_words = tables_title();
    collect_words = Object.assign( translate_block_words, first_menu_words, second_memu_words, tables_title_words);
    return collect_words
}

//第0層翻譯,避免覆蓋
function translate_block_statement(){
    var translate_block_words = {
        '商品库':'Product Library',
        'Platform销售额排名':'Platform Sales Orders',
        '更多':'More...',
        '卖家参谋':'Seller Dashboard',
        '预警':'Alert',
        '打包':'Packing',
        '发货':'Delevery',
        '异常':'Abnormal',
        '滞销':'unsalable'
    };
    return translate_block_words;
}

//第1層筆翻譯
function first_level_memu(){
    var first_menu_words = {
        '授权':'Webs',
        '首页' : 'Home',
        '产品':'Products',
        '订单':'Orders',
        '客服':'Services',
        '物流':'Delivery',
        '商品':'Items',
        '库存':'Stock',
        '采购':'Purchases',
        '数据':'Data',
        '跨境学院':'School',
    };
    return first_menu_words;
}

//第2層筆翻譯
function second_level_memu(){
    var second_memu_words = {
        '平台Webs':'Websites',
        '帮助文档' :'Helpers',
        '模块管理':'Modules',
        '分类配对':'Cat. Matching',


        //產品-通用
        '通用':'Generals - 1',
        '采集箱':'Gen-Boxes',
        '1688Gen-Boxes':' 1688 Boxes',
        'Items库':'Items Library',
        '刊登统计':'Statistics',

        //
        'Products刊登':'Draft-Webs - 2',
        '在线Products':'Online-Webs - 3',

        //產品-圖片空間
        '图片空间':'Images',
        '图片管理':'Img Manage',
        '图片分类设置': 'Cat. Settings',

        '全部Orders':'All Orders',
        '手工创建Orders':'Create Orders',
        'Orders规则':'Order Rules',
        'Orders确认规则':'Confirm Rules ',
        '打印设置':'Print Settings',

        '自动置顶':'Pull to Topr',

        //Item
        'Items管理':'Item Manage',
        'Items组管理':'Items Grouping',
        'SKU配对':'SKU Matching',

        //Purchases
        'Purchases管理':'Purchases Manage',
        'Purchases入库':'InStore',
        '供应商管理': 'Suppliers',
        ///////////////////////////////////////////////////////
        'Products图片': 'Photos',
        '标题':'Title',
        '名称':'Title',
        '父sku':'Parent SKU',
        '请编辑商品':'Edit Product',
        '编辑':'Edit',
        '创建产品':'Create Product',
        '手动创建':'Manual',
        '售价':'Sell Price',
        '店铺':'Platform',
        'Items分类':'Item Cat.',
        '其它':'Others',
        '标签':'Labels',
        '操作':'CRUD',
        '分配Product':'Assign Product',
        '快速搜索':'Searching...',
        '图片':'Photos',
        '分组':'Category',
        '已认领Platform': 'Assinged Platform',
        '创建':'Create',
        '修改':'Modified',
        '时间':'Time',
        '新建':'Create',
        '设置ItemsCategory':'Set Category',
        '仓库':'Wherehouse',
        '所有人':'PIC',
        'CRUD日志':'CRUD Book',
        '删除':'Del',
        '未Category':'No Category',
        '主账号':'Main PIC',
        'Items价格': 'Item Price',
        '搜索分组':'Search Category',
        '分类名称搜索':'Search Category',
        '管理人':'All PIC',
        '全部Items':'All Items',
        '单sku': 'Single SKU',
        '多sku': 'Multi SKU',
        '组合Items': 'Multi Items',
        '认领':'Assign',
    };
    return second_memu_words;
}

//第3層筆翻譯
function third_level_menu(){
    var third_menu_words = {
        '通用':'General'
    };
    return third_menu_words;
}

//表格翻譯
function tables_title(){
    var tables_title_words = {
        '图片':'Images',
        '名称':'Title',
        '父sku':'Father SKU',
        'sku':'SKU',
        'price':'Price',
        '库存':'Stock',
        '分组':'Category',
        '已认领店铺':'Assigned Platform',
        '时间':'Time',
        '操作':'CRUD',
        '编辑':'Edit',
        '颜色':'Color',
        '尺寸': 'Size',
        '平台':'Platform',
    };
    return tables_title_words;
}


//翻譯主程式
function translate_website(words){
    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        //排除掉的Tag 標籤
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }
}