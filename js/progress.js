var progress = function (opt) {
        this.bar = opt.dom;
        this.allTime = opt.time;//总时间
        this.progressNum = 0;//当前时间进度
        this.timer = '';
        this.interval = 26;//时间间隔(ms)
        this.addNum=this.interval/1000;
        this.current=opt.current;
    };
    progress.prototype = {
        start: function () {
            var _this = this;
            console.log(_this);
            _this.progress();
            _this.timer = setInterval(function(){
                _this.progress();
            }, _this.interval);
            //_this.timer = setInterval(_this.progress, _this.interval);如果写成这样progress方法中的this会变成window

        },
        progress:function(){
            var _this=this;
            if (_this.progressNum >= _this.allTime) {
                _this.stop();
            } else {
                _this.progressNum += _this.addNum;
                _this.bar.css('width', (_this.progressNum * 100 / _this.allTime) + '%');
            }
            _this._doCallback(_this.current);
        },
        stop: function () {
            var _this = this;
            clearInterval(_this.timer);
        },
        //判断并执行回调
        _doCallback: function (callback) {
            if (callback && $.isFunction(callback)) {
                callback(this);
            }
        }
    };
    var progress1 = new progress({
        dom:$('.j-bar'),
        time:5,
        current:function(currentTime){
            $('.j-num').text(parseInt(currentTime.progressNum));
        }
    });
    progress1.start();