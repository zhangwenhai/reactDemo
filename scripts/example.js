/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import "../css/comment";

var CommentBox = React.createClass({
    getLoginInfo: function () {
        //document.cookie = "auth-uid=1";
        //document.cookie = "auth-token=52e95cfe45ac48388b59124cf823d288";
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        this.auth_uid = "-1";
        this.auth_token = "-1";
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if ("auth-uid" == arr[0]) {
                this.auth_uid = arr[1];
            } else if ("auth-token" == arr[0]) {
                this.auth_token = arr[1];
            }
        }
        console.log(this.auth_uid);
        console.log(this.auth_token);
        if (this.auth_uid == "-1" || this.auth_token == "-1") {
            this.isLogin = false;
        } else {
            this.isLogin = true;
        }
    },

    loadCommentsFromServer: function () {
        fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({data: responseData.data});
            })
            .catch(error => {
            });
    },

    getUrlParam: function () {
        this.url = "/v3/topic/detail?id=" + window.topic_id;
        this.CommentSubmiturl = "/v3/topic/comment?topicId=" + window.topic_id;
        console.log(this.url);
    },

    getUrlParam1: function () {
        location.href = '../comment.html?id=' + window.topic_id;
    },

    handleCommentSubmit: function (comment) {
        fetch(this.CommentSubmiturl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "auth-uid": this.auth_uid,
                "auth-token": this.auth_token,
            },
            body: "content=" + comment.text,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.code == 20101) {
                    alert("登录过期，请重新登录")
                }
            })
            .catch(error => {
            });
    },

    getInitialState: function () {
        return {data: []};
    },

    componentDidMount: function () {
        this.getLoginInfo();
        this.getUrlParam();
        this.loadCommentsFromServer();
    },

    render: function () {
        if (this.isLogin) {
            return (
                <div className="commentBox">
                    <div className="commentLine"/>
                    <span className="commentHead">评论: {this.state.data.commentCount}</span>

                    <div className="commentLine"/>

                    <div className="commentHead_1"></div>
                    <CommentList data={this.state.data.comments}/>

                    <span className="commentFoot" onClick={this.getUrlParam1}>查看全部评论</span>

                    <div style={{width:"100%",height:54}}></div>
                    <div className="commentLine" style={{position:"fixed",bottom:55,border:0}}></div>
                    <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                </div>
            );
        } else {
            return (
                <div className="commentBox">
                    <div className="commentLine"/>
                    <span className="commentHead">评论: {this.state.data.commentCount}</span>

                    <div className="commentLine"/>

                    <div className="commentHead_1"></div>
                    <CommentList data={this.state.data.comments}/>

                    <span className="commentFoot" onClick={this.getUrlParam1}>查看全部评论</span>
                </div>
            );
        }
    }
});

var CommentBox2 = React.createClass({
    getLoginInfo: function () {
        //document.cookie = "auth-uid=1";
        //document.cookie = "auth-token=52e95cfe45ac48388b59124cf823d288";
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        this.auth_uid = "-1";
        this.auth_token = "-1";
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if ("auth-uid" == arr[0]) {
                this.auth_uid = arr[1];
            } else if ("auth-token" == arr[0]) {
                this.auth_token = arr[1];
            }
        }
        console.log(this.auth_uid);
        console.log(this.auth_token);
        if (this.auth_uid == "-1" || this.auth_token == "-1") {
            this.isLogin = false;
        } else {
            this.isLogin = true;
        }
    },
    getInitialState: function () {
        return {data: []};
    },

    componentDidMount: function () {
        this.pageNum = 1;
        this.isEnd = false;
        this.getLoginInfo();
        this.loadCommentsFromServer();
        window.onscroll = function () {
            if (getScrollTop() + getClientHeight() == getScrollHeight()) {
                this.loadCommentsFromServer();
            }
        }.bind(this);
    },

    getUrlParam: function (pageNum) {
        var urlParams;
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);
        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        this.url = "/v3/topic/comments?topicId=" + urlParams["id"] + "&pageNum=" + pageNum + "&pageSize=20";
        this.CommentSubmiturl = "/v3/topic/comment?topicId=" + urlParams["id"];
        console.log(this.url);
    },

    loadCommentsFromServer: function () {
        if (this.isEnd) {
            return;
        }
        this.getUrlParam(this.pageNum);
        fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.data.length < 20) {
                    this.isEnd = true;
                } else {
                    this.isEnd = false;
                }
                var data = this.state.data;
                if (this.pageNum == 1) {
                    data = responseData.data;
                } else {
                    data = data.concat(responseData.data);
                }
                this.setState({data: data});
                this.pageNum = this.pageNum + 1;
            })
            .catch(error => {
            });
    },

    getUrlParam1: function () {
        location.href = '../comment.html?id=' + window.topic_id;
    },

    handleCommentSubmit: function (comment) {
        fetch(this.CommentSubmiturl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "auth-uid": this.auth_uid,
                "auth-token": this.auth_token
            },
            body: "content=" + comment.text
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.code == 20101) {
                    alert("登录过期，请重新登录")
                } else {
                    this.loadCommentsFromServer();
                }
            })
            .catch(error => {
            });
    },

    render: function () {
        if (this.isLogin) {
            return (
                <div className="commentBox">
                    <CommentList data={this.state.data}/>

                    <div style={{width:"100%",height:54}}></div>
                    <div className="commentLine" style={{position:"fixed",bottom:55,border:0}}></div>
                    <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                </div>
            );
        } else {
            return (
                <div className="commentBox">
                    <CommentList data={this.state.data}/>
                </div>
            );
        }
    }
});

var CommentList = React.createClass({
    render: function () {
        var data = new Date();
        if (!this.props.data) {
            return null;
        }
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment key={comment.id} comment={comment} date={data}/>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var Comment = React.createClass({
    getInitialState: function () {
        return {favorited: this.props.comment.favorited, favorites: this.props.comment.favorites};
    },
    rawMarkup: function () {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return {__html: rawMarkup};
    },

    getShowTime: function (time1) {
        var time = time1 * 1000;
        var date = new Date(time);
        if (this.props.date.getTime() - time < 60 * 1000) {
            return parseInt((this.props.date.getTime() - time) / 1000) + "秒之前";
        }
        if (this.props.date.getTime() - time < 60 * 60 * 1000) {
            return parseInt((this.props.date.getTime() - time) / 1000 / 60) + "分钟之前";
        }
        if (this.props.date.getTime() - time < 24 * 60 * 60 * 1000) {
            return parseInt((this.props.date.getTime() - time) / 1000 / 60 / 60) + "小时之前";
        }
        var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var HH = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var MM = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + DD + "日  " + HH + ":" + MM;
    },

    setFavorited: function () {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        var auth_uid;
        var auth_token;
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if ("auth-uid" == arr[0]) {
                auth_uid = arr[1];
            } else if ("auth-token" == arr[0]) {
                auth_token = arr[1];
            }
        }
        console.log(auth_uid);
        console.log(auth_token);
        fetch("/v3/topic/favourComment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "auth-uid": auth_uid,
                "auth-token": auth_token,
            },
            body: "commentId=" + this.props.comment.id,
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                this.setState({
                    favorited: !this.state.favorited,
                    favorites: this.state.favorited ? this.state.favorites - 1 : this.state.favorites + 1
                });
            })
            .catch(error => {
            });
    },

    render: function () {
        var reply;
        if (this.props.comment.replyContent) {
            reply = (
                <div style={{display:"flex",display:"-webkit-flex",flexDirection:"column"}}>
                    <div style={{display:"flex",display:"-webkit-flex",flexDirection:"row",height:30,alignItems:"center",marginTop:5}}>
                        <span className="commentReplyAuthor">{this.props.comment.replyAuthor}</span>

                        <div style={{display:"flex",display:"-webkit-flex",flexDirection:"row",alignItems:"center",flex: 1}}>
                            <span className="commentReplyAuthor" style={{padding: "0 0 0 5px",color:"#D2D2D2",fontSize:"1.1em"}}>回复</span>
                            <span className="commentReplyAuthor" style={{padding: "0 0 0 5px",flex: 1}}>{this.props.comment.author}</span>
                        </div>
                    </div>
                    <span className="commentReplyTime">{this.getShowTime(this.props.comment.replyAt)}</span>
                    <span className="commentReplyText">{this.props.comment.replyContent}</span>

                    <div className="commentLine"/>
                </div>
            )
        }
        return (
            <div style={{display:"flex",display:"-webkit-flex",flexDirection:"column"}}>
                <div style={{display:"flex",display:"-webkit-flex",flexDirection:"row",height:30,alignItems:"center",marginTop:5}}>
                    <span className="commentAuthor"> {this.props.comment.author} </span>

                    <div onClick={this.setFavorited}
                         style={{display:"flex",display:"-webkit-flex",flexDirection:"row",alignItems:"center"}}>
                        <div className={this.state.favorited ?"commentZan_push":"commentZan"}></div>
                        <div className="commentZan_1">{this.state.favorites} </div>
                    </div>
                </div>
                <span className="commentTime">{this.getShowTime(this.props.comment.time)}</span>
                <span className="commentText">{this.props.comment.content}</span>

                <div className={this.props.comment.replyContent ?"commentReplyLine":"commentLine"}/>
                {reply}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function () {
        return {text: ''};
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var text = this.state.text.trim();
        if (!text) {
            return;
        }
        this.props.onCommentSubmit({text: text});
        this.setState({text: ''});
    },
    render: function () {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <div className="commentSubmit">
                    <input className="commentInput"
                           type="text"
                           placeholder="Say something..."
                           value={this.state.text}
                           onChange={this.handleTextChange}/>
                    <input className="commentPost" type="submit" value="发送"/>
                </div>
            </form>
        );
    }
});

function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

//获取当前可是范围的高度
function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    }
    else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}

//获取文档完整的高度
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

window.onload = function () {
    if (document.getElementById('detail_comment')) {
        ReactDOM.render(
            <CommentBox />,
            document.getElementById('detail_comment')
        );
    } else if (document.getElementById('comment_list')) {
        ReactDOM.render(
            <CommentBox2 />,
            document.getElementById('comment_list')
        );
    }
};
