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
        //首页历史返回 / 上次记录初始化逻辑
        if ($("#infoDialog").length <= 0) {
            _this.historyBackinit();
        }

        //贷款金额输入监听（不要绑定利率输入框）
        $(".shangyef,.gjjf").on("input", function (e) {
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

        // 首页“上次输入记录”按钮
        $("#historyRecordBtn").on("click", function () {
            _this.applyLastRecord();
        });

        //详情滚动导航固定
        $("#infoDialog").scroll(_this.fixTop);

        //详情页面数据绑定
        if ($("#infoDialog").length > 0) {
            _this.resultBind();
            // 详情页：下载Excel
            $("#downloadExcelBtn").on("click", function () {
                _this.downloadExcel();
            });
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
        // 保存上次记录
        _this.saveLastRecord({
            lanType: "1",
            repayType: type,
            sdnum: num,
            gjjnum: "",
            sdyear: year,
            gjjyear: "",
            sdRatePercent: $("#shangyeRateInput").val() || "",
            gjjRatePercent: ""
        });

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
        // 保存上次记录
        _this.saveLastRecord({
            lanType: "2",
            repayType: type,
            sdnum: "",
            gjjnum: num,
            sdyear: "",
            gjjyear: year,
            sdRatePercent: "",
            gjjRatePercent: $("#gjjRateInput").val() || ""
        });
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
        // 保存上次记录
        _this.saveLastRecord({
            lanType: "3",
            repayType: type,
            sdnum: sdnum,
            gjjnum: gjjnum,
            sdyear: sdyear,
            gjjyear: gjjyear,
            sdRatePercent: $("#shangyeRateInput").val() || "",
            gjjRatePercent: $("#gjjRateInput").val() || ""
        });
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
    formatWan4: function (yuan) {
        var n = parseFloat(yuan);
        if (isNaN(n)) {
            return "0.0000";
        }
        return (n / 10000).toFixed(4);
    },
    formatWan2: function (yuan) {
        var n = parseFloat(yuan);
        if (isNaN(n)) {
            return "0.00";
        }
        return (n / 10000).toFixed(2);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    saveLastRecord: function (data) {
        try {
            localStorage.setItem("loanLastRecord", JSON.stringify(data));
        } catch (e) { }
    },
    getLastRecord: function () {
        try {
            var str = localStorage.getItem("loanLastRecord");
            if (!str) return null;
            return JSON.parse(str);
        } catch (e) {
            return null;
        }
    },
    applyLastRecord: function () {
        var _this = this;
        var rec = _this.getLastRecord();
        if (!rec) {
            return;
        }
        // 贷款类型
        $("#lanChange").val(rec.lanType);
        $("#lanChange").trigger("change");
        // 年限与金额、利率
        if (rec.lanType == "1") {
            $(".shangyef").val(rec.sdnum || "");
            $("#sylanyear").val(rec.sdyear || "");
            $("#shangyeRateInput").val(rec.sdRatePercent || "");
        } else if (rec.lanType == "2") {
            $(".gjjf").val(rec.gjjnum || "");
            $("#gjjlanyear").val(rec.gjjyear || "");
            $("#gjjRateInput").val(rec.gjjRatePercent || "");
        } else if (rec.lanType == "3") {
            $(".shangyef").val(rec.sdnum || "");
            $(".gjjf").val(rec.gjjnum || "");
            $("#sylanyear").val(rec.sdyear || "");
            $("#gjjlanyear").val(rec.gjjyear || "");
            $("#shangyeRateInput").val(rec.sdRatePercent || "");
            $("#gjjRateInput").val(rec.gjjRatePercent || "");
        }
        // 还款方式 tab
        if (rec.repayType == "1") {
            $(".cal_changenav[data-name='benxi']").addClass("current");
            $(".cal_changenav[data-name='benjin']").removeClass("current");
        } else {
            $(".cal_changenav[data-name='benjin']").addClass("current");
            $(".cal_changenav[data-name='benxi']").removeClass("current");
        }
        // 重新计算
        if (rec.lanType == "1") {
            _this.shangdaiData(rec.repayType, rec.sdnum);
        } else if (rec.lanType == "2") {
            _this.gjjData(rec.repayType, rec.gjjnum);
        } else if (rec.lanType == "3") {
            _this.zuheData(rec.repayType, rec.sdnum, rec.gjjnum);
        }
        $(".cal_benxiinfo").show();
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
        var diffData = []; // 差值数据数组
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
            var bxVal = bxSum / 10000;
            var bjVal = bjSum / 10000;
            bxData.push(bxVal);
            bjData.push(bjVal);
            // 计算差值（本息-本金）
            diffData.push(bxVal - bjVal);
        }
        
        if (this.interestChart) {
            this.interestChart.destroy();
        }
        var _this = this;
        this.interestChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                        label: "等额本息累计利息",
                        data: bxData,
                        borderColor: "#ff6b6b",
                        backgroundColor: "rgba(255,107,107,0.1)",
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 0
                    },
                    {
                        label: "等额本金累计利息",
                        data: bjData,
                        borderColor: "#4b7bec",
                        backgroundColor: "rgba(75,123,236,0.1)",
                        tension: 0.1,
                        borderWidth: 2,
                        pointRadius: 0
                    },
                    {
                        label: "差值(本息-本金)",
                        data: diffData,
                        borderColor: "#00b894",
                        backgroundColor: "rgba(0,184,148,0.1)",
                        borderDash: [5, 5], // 虚线样式，更清晰地区分差值曲线
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
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true, // 使用点样式代替矩形
                            boxWidth: 10
                        }
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            // 修改标题回调，在浮层标题中显示期数
                            title: function(context) {
                                if (context && context.length > 0) {
                                    var index = context[0].dataIndex;
                                    return "第 " + (index + 1) + " 期";
                                }
                                return "";
                            },
                            label: function (context) {
                                var label = context.dataset.label || "";
                                var value = context.parsed.y;
                                return label + ": " + value.toFixed(4) + "万";
                            }
                        }
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
                            text: "金额(万)"
                        },
                        grid: {
                            color: function(context) {
                                // 可以让y=0的网格线更突出
                                if (context.tick.value === 0) {
                                    return '#999';
                                }
                                return '#e0e0e0';
                            },
                            lineWidth: function(context) {
                                if (context.tick.value === 0) {
                                    return 2;
                                }
                                return 1;
                            }
                        }
                    }
                }
            }
        });

        // 渲染已还本金图表
        _this.renderPrincipalChart(benxiData, benjinData);
    },

    // 新增：渲染已还本金对比图表
    renderPrincipalChart: function(benxiData, benjinData) {
        if (typeof Chart === "undefined") {
            return;
        }
        var canvas = document.getElementById("principalChart");
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
        var bxPrincipalData = [];
        var bjPrincipalData = [];
        var bxInterestData = [];
        var bjInterestData = [];
        var bxPrincipalSum = 0;
        var bjPrincipalSum = 0;
        var bxInterestSum = 0;
        var bjInterestSum = 0;
        
        for (var i = 0; i < maxLen; i++) {
            labels.push(i + 1);
            if (i < bxArr.length) {
                bxPrincipalSum += bxArr[i].yuebenjin;
                bxInterestSum += bxArr[i].yuelixi;
                bxPrincipalData.push(bxPrincipalSum / 10000); // 转换为万元
                bxInterestData.push(bxInterestSum / 10000);   // 转换为万元
            }
            if (i < bjArr.length) {
                bjPrincipalSum += bjArr[i].yuebenjin;
                bjInterestSum += bjArr[i].yuelixi;
                bjPrincipalData.push(bjPrincipalSum / 10000); // 转换为万元
                bjInterestData.push(bjInterestSum / 10000);   // 转换为万元
            }
        }
        
        if (this.principalChart) {
            this.principalChart.destroy();
        }
        
        // 创建基础数据集（本金曲线默认显示）
        var datasets = [{
            label: "等额本息已还本金",
            data: bxPrincipalData,
            borderColor: "#ff6b6b",
            backgroundColor: "rgba(255,107,107,0.1)",
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 0,
            hidden: false
        }, {
            label: "等额本金已还本金",
            data: bjPrincipalData,
            borderColor: "#4b7bec",
            backgroundColor: "rgba(75,123,236,0.1)",
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 0,
            hidden: false
        }];
        
        // 添加可选的兴趣曲线数据集（默认隐藏）
        datasets.push({
            label: "等额本息已还利息",
            data: bxInterestData,
            borderColor: "#ff9e6b",
            backgroundColor: "rgba(255,158,107,0.1)",
            borderDash: [5, 5],
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 0,
            hidden: true  // 默认隐藏
        });
        
        datasets.push({
            label: "等额本金已还利息",
            data: bjInterestData,
            borderColor: "#6b9eff",
            backgroundColor: "rgba(107,158,255,0.1)",
            borderDash: [5, 5],
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 0,
            hidden: true  // 默认隐藏
        });
        
        var _this = this;
        this.principalChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 10
                        }
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                        callbacks: {
                            title: function(context) {
                                if (context && context.length > 0) {
                                    var index = context[0].dataIndex;
                                    return "第 " + (index + 1) + " 期";
                                }
                                return "";
                            },
                            label: function(context) {
                                var label = context.dataset.label || "";
                                var value = context.parsed.y;
                                return label + ": " + value.toFixed(4) + "万";
                            }
                        }
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
                            text: "金额(万)"
                        },
                        grid: {
                            color: '#e0e0e0',
                            lineWidth: 1
                        }
                    }
                }
            }
        });
        
        // 绑定复选框事件
        $('#toggleBenxiInterest').off('change').on('change', function() {
            if (_this.principalChart && _this.principalChart.data.datasets[2]) {
                _this.principalChart.data.datasets[2].hidden = !this.checked;
                _this.principalChart.update();
            }
        });
        
        $('#toggleBenjinInterest').off('change').on('change', function() {
            if (_this.principalChart && _this.principalChart.data.datasets[3]) {
                _this.principalChart.data.datasets[3].hidden = !this.checked;
                _this.principalChart.update();
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
            var cumulativePrincipal = 0;
            var cumulativeInterest = 0;
            
            monthdataArray.forEach(function (item, index) {
                cumulativePrincipal += item.yuebenjin;
                cumulativeInterest += item.yuelixi;
                var totalPaid = cumulativePrincipal + cumulativeInterest;
                
                rowsHtml.push(
                    '<div class="mouthli displayflex border_bottom">' +
                    '<div class="mouthtd flexli"><span>' + (index + 1) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(item.yuebenjin) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(item.yuelixi) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(item.leftBenjin) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(item.leftFund) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(cumulativePrincipal) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(cumulativeInterest) + '</span></div>' +
                    '<div class="mouthtd flexli"><span>' + _this.formatWan2(totalPaid) + '</span></div>' +
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
        // 优先使用本地存储的上次记录恢复计算结果
        this.applyLastRecord();
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
        // 包含所有列的表头，所有单位为元并保留两位小数
        var csv = '期次,每月本金(元),每月利息(元),剩余本金(元),剩余还款(元),已还本金(元),已还利息(元),已还金额(元)\n';
        var cumulativePrincipal = 0;
        var cumulativeInterest = 0;
        
        list.forEach(function (item, index) {
            cumulativePrincipal += item.yuebenjin;
            cumulativeInterest += item.yuelixi;
            var totalPaid = cumulativePrincipal + cumulativeInterest;
            
            var row = [
                index + 1,
                item.yuebenjin.toFixed(2),              // 每月本金 - 元，2位小数
                item.yuelixi.toFixed(2),                // 每月利息 - 元，2位小数
                item.leftBenjin.toFixed(2),             // 剩余本金 - 元，2位小数
                item.leftFund.toFixed(2),               // 剩余还款 - 元，2位小数
                cumulativePrincipal.toFixed(2),         // 已还本金 - 元，2位小数
                cumulativeInterest.toFixed(2),          // 已还利息 - 元，2位小数
                totalPaid.toFixed(2)                    // 已还金额 - 元，2位小数
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
    inputChange: function () { }



}
domOperate.init();