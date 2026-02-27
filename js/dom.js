var domOperate = {
    offsetTop: $(".infotop").height(),
    fixheight: $(".tablenav").height(),
    init: function () {
        var _this = this;
        _this.yearBind();
        //商贷年限变化
        $("#sylanyear").change(function () {
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "1") {
                _this.resultSd();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }
        })
        //公积金年限变化
        $("#gjjlanyear").change(function () {
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "2") {
                _this.resultGjj();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }

        })
        //商贷利率输入变化
        $("#shangyeRateInput").on("input", function () {
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "1") {
                _this.resultSd();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }
        })
        //公积金利率输入变化
        $("#gjjRateInput").on("input", function () {
            var selectvalue = $("#lanChange").val();
            if (selectvalue == "2") {
                _this.resultGjj();
            }
            if (selectvalue == "3") {
                _this.resuleZh();
            }
        })




        //本息本金按钮点击
        $(".cal_changenav").on("click", function () {
            var name = $(this).data("name");
            $(this).addClass("current").siblings().removeClass("current");
            if (name == "benxi") {
                //执行本息计算逻辑 本息type 1,本金type 2
                _this.checkLanType("1")
                $("#typethml").html("等额本息还款详情");
                if ($(this).hasClass("inner_bx")) {
                    _this.resultBind("1");
                }

            } else if (name == "benjin") {
                //执行本金计算逻辑 
                _this.checkLanType("2")
                $("#typethml").html("等额本金还款详情");
                if ($(this).hasClass("inner_bj")) {
                    _this.resultBind("2");
                }
            }
        })

        //贷款类型切换
        $("#lanChange").change(function () {
            var values = $(this).val();
            if (values == "1") {
                //商业贷款dom操作
                $(".sdfund").removeClass("split");
                $(".shangdai_hook").show();
                $(".gjj_hook").hide();
                $(".dkname").html("贷款金额");
                //执行计算逻辑
                _this.resultSd();

            } else if (values == "2") {
                //公积金贷款dom操作
                $(".sdfund").removeClass("split");
                $(".shangdai_hook").hide();
                $(".gjj_hook").show();
                $(".dkname").html("贷款金额");
                //执行计算逻辑
                _this.resultGjj();

            } else if (values == "3") {
                //组合贷款dom操作
                $(".sdfund").addClass("split");
                $(".shangdai_hook").show();
                $(".gjj_hook").show();
                $(".dkname").each(function () {
                    $(this).html($(this).data("zuhe"));
                })
                //执行计算逻辑
                _this.resuleZh();
            }
        })
        //历史返回初始化逻辑计算
        if ($("#infoDialog").length <= 0) {
            _this.historyBackinit();
        }

        //贷款输入数字监听
        $(".lannum").on("input", function (e) {
            var enterkey = e.target.value,
                stype = $(".current", ".cal_nav").data("name"),
                type = "";
            stype == "benxi" ? type = "1" : type = "2";
            if ($(this).hasClass("gjjf")) {
                // console.log("公积金逻辑")
                _this.checkLanType(type, "", enterkey);

            } else {
                // console.log("商贷计算逻辑");
                _this.checkLanType(type, enterkey, "");
            }
            //详情显示
            if ($.trim(enterkey) != "" && !isNaN(enterkey) && enterkey > 0) {
                $(".cal_benxiinfo").show();
            } else {
                $(".cal_benxiinfo").hide();
            }

        })

        //详情滚动导航固定
        $("#infoDialog").scroll(_this.fixTop);

        //详情页面数据绑定
        if ($("#infoDialog").length > 0) {
            _this.resultBind();
            // 详情页：下载Excel
            $("#downloadExcelBtn").on("click", function () {
                _this.downloadExcel();
            });
            // 详情页：跳转提前还款模拟
            $("#goPrepay").attr("href", "prepay.html" + window.location.search);
            // 提前还款按钮绑定（存在于提前还款页面）
            $("#prepayCalcBtn").on("click", function () {
                var monthVal = $("#prepayMonthInput").val();
                var res = _this.prepayAll(monthVal);
                if (!res) {
                    $("#prepayResult").html("请输入有效的期数。");
                    return;
                }
                var newTotalLixiWan = _this.formatCurrency(res.newTotalLixi / 10000);
                var saveLixiWan = _this.formatCurrency(res.saveLixi / 10000);
                $("#prepayResult").html('在第' + res.month + '期后一次性结清，总利息约为' + newTotalLixiWan + '万，较原计划节省利息约' + saveLixiWan + '万。');
            });
        }



    },
    fixTop: function () {
        var _this = domOperate;
        var scrollTop = $("#infoDialog").scrollTop();
        if (scrollTop >= _this.offsetTop) {
            if (!$(".tablenav").hasClass("topfixedpc")) {
                $(".tablenav").addClass("topfixedpc");
                $(".yearouter").css("padding-top", _this.fixheight + "px")
            }
        } else {
            $(".tablenav").removeClass("topfixedpc");
            $(".yearouter").removeAttr("style");
        }
    },
    resultSd: function () {
        var _this = this;
        var stype = $(".current", ".cal_top").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        _this.shangdaiData(type);
    },
    resultGjj: function () {
        var _this = this;
        var stype = $(".current", ".cal_top").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        _this.gjjData(type);
    },
    resuleZh: function () {
        var _this = this;
        var stype = $(".current", ".cal_top").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        _this.zuheData(type);
    },
    checkLanType: function (type, sdnum, gjjnum) {
        var _this = this;
        var lanType = $("#lanChange").val();
        if (lanType == "1") {
            _this.shangdaiData(type, sdnum);
        } else if (lanType == "2") {
            _this.gjjData(type, gjjnum);
        } else if (lanType == "3") {
            _this.zuheData(type, sdnum, gjjnum);
        }
    },
    getRateValue: function (selector) {
        var val = $.trim($(selector).val());
        if (val === "") {
            return null;
        }
        var num = parseFloat(val);
        if (isNaN(num) || num <= 0) {
            return null;
        }
        return num / 100; // 转换为小数利率
    },
    shangdaiData: function (type, num) {
        num = num || $(".shangyef").val();
        var _this = this;
        var year = $("#sylanyear").val();
        var lilv = _this.getRateValue("#shangyeRateInput");
        if (!num || isNaN(num) || num <= 0 || lilv == null) {
            return;
        }
        //结果地址传参数
        _this.navigateUrl(type, "1", num, "", year, "", lilv, "");
        //调用商贷计算公式（本息、本金同时计算用于对比图表）
        var benxiObj = calcute.singleDk("1", num, year, lilv);
        var benjinObj = calcute.singleDk("2", num, year, lilv);
        var resobj = type == "1" ? benxiObj : benjinObj;
        _this.domOperates(type, resobj);
        _this.updateInterestChart(benxiObj, benjinObj);

    },
    gjjData: function (type, num) {
        num = num || $(".gjjf").val();
        var _this = this;
        var year = $("#gjjlanyear").val();
        var lilv = _this.getRateValue("#gjjRateInput");
        if (!num || isNaN(num) || num <= 0 || lilv == null) {
            return;
        }
        //结果地址传参数
        _this.navigateUrl(type, "2", "", num, "", year, "", lilv);
        //调用公积金计算公式（本息、本金同时计算用于对比图表）
        var benxiObj = calcute.singleDk("1", num, year, lilv);
        var benjinObj = calcute.singleDk("2", num, year, lilv);
        var resobj = type == "1" ? benxiObj : benjinObj;
        _this.domOperates(type, resobj);
        _this.updateInterestChart(benxiObj, benjinObj);
    },
    zuheData: function (type, sdnum, gjjnum) {
        sdnum = sdnum || $(".shangyef").val(), gjjnum = gjjnum || $(".gjjf").val();
        var _this = this;
        var sdyear = $("#sylanyear").val(),
            sdlilv = _this.getRateValue("#shangyeRateInput");
        var gjjyear = $("#gjjlanyear").val(),
            gjjlilv = _this.getRateValue("#gjjRateInput");
        if (!sdnum || isNaN(sdnum) || sdnum <= 0 || !gjjnum || isNaN(gjjnum) || gjjnum <= 0 || sdlilv == null || gjjlilv == null) {
            return;
        }
        //结果地址传参数
        _this.navigateUrl(type, "3", sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
        //调用组合贷款计算公式（本息、本金同时计算用于对比图表）
        var benxiObj = calcute.zuhe("1", sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
        var benjinObj = calcute.zuhe("2", sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
        var resobj = type == "1" ? benxiObj : benjinObj;
        _this.domOperates(type, resobj);
        _this.updateInterestChart(benxiObj, benjinObj);
    },
    yearBind: function () { //年份绑定
        var yearArray = [];
        config.loanyear.forEach(function (item, index) {
            var selectflag = "";
            if (item.select) {
                selectflag = 'selected="selected"'
            }
            yearArray[index] = '<option value="' + item.year + '" ' + selectflag + '>' + item.year + '年</option>'
        })
        $("#gjjlanyear").html(yearArray.join(""));
        $("#sylanyear").html(yearArray.join(""));
    },
    lilvCal: function (year, lilv, selectcontent, id) {
        var getLilv = "",
            lilvbindArray = [];
        lilv.forEach(function (item, index) {
            if (year >= item.year) {
                getLilv = item.lilv;
            }
        })
        var callilv = selectcontent.map(function (item, index) {
            return {
                lilv: (item.lilv * getLilv).toFixed(4),
                name: item.name
            }
        })
        callilv.forEach(function (item, index) {
            lilvbindArray[index] = '<option value="' + item.lilv + '" >' + item.name + '</option>'
        })
        $("#" + id).html(lilvbindArray.join(""));

    },
    formatCurrency: function (num) { //将数值四舍五入(保留2位小数)后格式化成金额形式
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    updateInterestChart: function (benxiData, benjinData) {
        // 仅在首页存在图表容器时绘制
        if (typeof Chart === "undefined") {
            return;
        }
        var canvas = document.getElementById("interestChart");
        if (!canvas) {
            return;
        }
        var ctx = canvas.getContext("2d");
        var bxArr = benxiData.monthdataArray || [];
        var bjArr = benjinData.monthdataArray || [];
        var maxLen = Math.max(bxArr.length, bjArr.length);
        if (maxLen === 0) {
            return;
        }
        var labels = [];
        var bxData = [];
        var bjData = [];
        var bxSum = 0;
        var bjSum = 0;
        for (var i = 0; i < maxLen; i++) {
            labels.push(i + 1);
            if (i < bxArr.length) {
                bxSum += bxArr[i].yuelixi;
            }
            if (i < bjArr.length) {
                bjSum += bjArr[i].yuelixi;
            }
            // 转换为万元显示
            bxData.push(bxSum / 10000);
            bjData.push(bjSum / 10000);
        }
        if (this.interestChart) {
            this.interestChart.destroy();
        }
        this.interestChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                        label: "等额本息累计利息(万)",
                        data: bxData,
                        borderColor: "#ff6b6b",
                        backgroundColor: "rgba(255,107,107,0.1)",
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 0
                    },
                    {
                        label: "等额本金累计利息(万)",
                        data: bjData,
                        borderColor: "#4b7bec",
                        backgroundColor: "rgba(75,123,236,0.1)",
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "期数（月）"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "累计利息(万)"
                        }
                    }
                }
            }
        });
    },
    domOperates: function (type, data) {
        var _this = this;
        // 保存当前计算结果，便于提前还款等后续计算使用
        _this.currentResult = {
            type: type,
            data: data
        };
        var yuegong = _this.formatCurrency(data.yuegong);
        var totalPrice = _this.formatCurrency(data.totalPrice / 10000); //万元转换
        var totalLixi = _this.formatCurrency(data.totalLixi / 10000); //万元转换
        var totalDknum = _this.formatCurrency(data.totalDknum);
        var monthdataArray = data.monthdataArray;
        $(".cal_price_hook").html(yuegong);
        $(".htotalnum").html(totalPrice + "万");
        $(".htotallixinum").html(totalLixi + "万");
        if (type == "1") { //等额本息dom操作
            $(".cal_dijian").html("");
            $(".cal_dijianprice").html("");
            $(".inner_bx").addClass("current");
            $(".inner_bj").removeClass("current");
        } else if (type == "2") {
            $(".cal_dijian").html("每月递减(元)");
            $(".cal_dijianprice").html(_this.formatCurrency(data.yuegongdijian));
            $(".inner_bx").removeClass("current");
            $(".inner_bj").addClass("current");
        }
        if ($("#infoDialog").length > 0) {
            $("#totalPrice").html(totalPrice);
            $("#totalLixi").html(totalLixi);
            $("#totalDknum").html(totalDknum);
            $("#totalyear").html(data.year);
            // 详情页面循环：按期次平铺
            var rowsHtml = [];
            monthdataArray.forEach(function (item, index) {
                rowsHtml.push(
                    '<div class="mouthli displayflex border_bottom">' +
                    '<div class="mouthtd flexli"><span>' + (index + 1) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatCurrency(item.yuebenjin) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatCurrency(item.yuelixi) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatCurrency(item.leftFund) + '</span></div>' +
                    '</div>'
                );
            });
            $("#yearouter").html('<div class="mouths">' + rowsHtml.join("") + '</div>');

        }

    },
    navigateUrl: function (type, loantype, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv) {
        var type = type || "1",
            loantype = loantype || "1",
            sdnum = sdnum || "",
            gjjnum = gjjnum || "",
            sdyear = sdyear || "",
            gjjyear = gjjyear || "",
            sdlilv = sdlilv || "",
            gjjlilv = gjjlilv || "";
        if (loantype == "1") {
            var url = 'result.html?type=' + type + '&sdnum=' + sdnum + '&sdyear=' + sdyear + '&sdlilv=' + sdlilv + '&loantype=1';
        } else if (loantype == "2") {
            var url = 'result.html?type=' + type + '&gjjnum=' + gjjnum + '&gjjyear=' + gjjyear + '&gjjlilv=' + gjjlilv + '&loantype=2';
        } else if (loantype == "3") {
            var url = 'result.html?type=' + type + '&sdnum=' + sdnum + '&gjjnum=' + gjjnum + '&sdyear=' + sdyear + '&gjjyear=' + gjjyear + '&sdlilv=' + sdlilv + '&gjjlilv=' + gjjlilv + '&loantype=3';
        }
        $("#typethml").attr("href", url);
    },
    resultBind: function (type) {
        var _this = this;
        var loantype = _this.getQueryString("loantype");
        if (loantype == "1") {
            var type = type || _this.getQueryString("type"),
                sdnum = _this.getQueryString("sdnum"),
                sdyear = _this.getQueryString("sdyear"),
                sdlilv = _this.getQueryString("sdlilv");

            var ressdobj = calcute.singleDk(type, sdnum, sdyear, sdlilv);
            //console.log(resobj);
            _this.domOperates(type, ressdobj);

        } else if (loantype == "2") {
            var type = type || _this.getQueryString("type"),
                gjjnum = _this.getQueryString("gjjnum"),
                gjjyear = _this.getQueryString("gjjyear"),
                gjjlilv = _this.getQueryString("gjjlilv");

            var resgjjobj = calcute.singleDk(type, gjjnum, gjjyear, gjjlilv);
            //console.log(resobj);
            _this.domOperates(type, resgjjobj);
        } else if (loantype == "3") {
            var type = type || _this.getQueryString("type"),
                gjjnum = _this.getQueryString("gjjnum"),
                gjjyear = _this.getQueryString("gjjyear"),
                gjjlilv = _this.getQueryString("gjjlilv"),
                sdnum = _this.getQueryString("sdnum"),
                sdyear = _this.getQueryString("sdyear"),
                sdlilv = _this.getQueryString("sdlilv");
            var reszhobj = calcute.zuhe(type, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv);
            //console.log(resobj);
            _this.domOperates(type, reszhobj);
        }
    },
    historyBackinit: function () { //历史返回初始化逻辑计算
        var _this = this;
        if ($("#lanChange").val() != "1") {
            $("#lanChange").trigger("change")
        }
        if ($(".shangyef").val() != "") {
            _this.inputChange($(".shangyef").val());
        }
        if ($(".gjjf").val() != "") {
            _this.inputChange($(".gjjf").val());
        }
    },
    // 提前还款（一次性结清）计算：基于当前计算结果
    prepayAll: function (monthIndex) {
        var result = this.currentResult;
        if (!result || !result.data || !result.data.monthdataArray) {
            return null;
        }
        var data = result.data;
        var monthArray = data.monthdataArray;
        var m = parseInt(monthIndex, 10);
        if (isNaN(m) || m <= 0) {
            return null;
        }
        if (m > monthArray.length) {
            m = monthArray.length;
        }
        var paidLixi = 0;
        var paidBenjin = 0;
        for (var i = 0; i < m; i++) {
            paidLixi += monthArray[i].yuelixi;
            paidBenjin += monthArray[i].yuebenjin;
        }
        var dknum = parseFloat(data.totalDknum) * 10000;
        var newTotalLixi = paidLixi;
        var newTotalPrice = dknum + newTotalLixi;
        var saveLixi = data.totalLixi - newTotalLixi;
        return {
            month: m,
            newTotalLixi: newTotalLixi,
            newTotalPrice: newTotalPrice,
            saveLixi: saveLixi
        };
    },
    // 下载还款明细为 Excel（CSV）
    downloadExcel: function () {
        var result = this.currentResult;
        if (!result || !result.data || !result.data.monthdataArray) {
            return;
        }
        var data = result.data;
        var list = data.monthdataArray;
        if (!list || list.length === 0) {
            return;
        }
        var csv = '期次,每月本金(元),每月利息(元),剩余还款(元)\n';
        list.forEach(function (item, index) {
            var row = [
                index + 1,
                item.yuebenjin.toFixed(2),
                item.yuelixi.toFixed(2),
                item.leftFund.toFixed(2)
            ];
            csv += row.join(',') + '\n';
        });
        var blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '还款明细.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    inputChange: function (values) {
        var _this = this,
            enterkey = values,
            stype = $(".current", ".cal_nav").data("name"),
            type = "";
        stype == "benxi" ? type = "1" : type = "2";
        if ($(this).hasClass("gjjf")) {
            // console.log("公积金逻辑")
            _this.checkLanType(type, "", enterkey);

        } else {
            // console.log("商贷计算逻辑");
            _this.checkLanType(type, enterkey, "");
        }
        //详情显示
        if ($.trim(enterkey) != "" && !isNaN(enterkey) && enterkey > 0) {
            $(".cal_benxiinfo").show();
        } else {
            $(".cal_benxiinfo").hide();
        }
    }



}
domOperate.init();