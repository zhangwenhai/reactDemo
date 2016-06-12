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

var Comment = React.createClass({
    rawMarkup: function () {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return {__html: rawMarkup};
    },

    render: function () {
        var reply;
        if (this.props.comment.replyContent) {
            reply = (<div className="comment">
                <span
                    className="commentReplyAuthor"> {this.props.comment.replyAuthor} 回复 {this.props.comment.author}</span>
                <br />
                <span className="commentReplyTime">{this.props.comment.replyAt}</span>
                <br />
                <span className="commentReplyText">{this.props.comment.replyContent}</span>

                <div className="commentLine"/>
            </div>)
        }
        return (
            <div className="comment">
                <span className="commentAuthor"> {this.props.comment.author} </span>
                <br />
                <span className="commentTime">{this.props.comment.time}</span>
                <br />
                <span className="commentText">{this.props.comment.content}</span>

                <div className={this.props.comment.replyContent ?"commentReplyLine":"commentLine"}/>
                {reply}
            </div>
        );
    }
});

var CommentBox = React.createClass({
        loadCommentsFromServer: function () {
            $.ajax({
                url: this.url,
                dataType: 'json',
                type: 'post',
                cache: false,
                success: function (data) {
                    console.log(data);
                    this.setState({data: data.data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        },

        getUrlParam: function () {
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
            this.url = "/v3/topic/detail?id=" + urlParams["id"];
            console.log(this.url);
        },

        dyniframesize: function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            var pTar = null;
            if (document.getElementById) {
                pTar = document.getElementById("iFrame");
            } else {
                eval('pTar=' + down + ';');
            }
            console.log(pTar);
            if (!pTar) {
                return
            }
            pTar.style.display = "block";

            if (Sys.ie) {
                if (Sys.ie == '9.0') {
                    pTar.height = pTar.contentWindow.document.body.offsetHeight + 15 + "px";
                    pTar.width = pTar.contentWindow.document.body.scrollWidth + "px";
                } else if (Sys.ie == '8.0') {
                    pTar.height = pTar.Document.body.offsetHeight + 15 + "px";
                    pTar.width = pTar.Document.body.scrollWidth + "px";
                } else {
                    pTar.height = pTar.Document.body.scrollHeight + 25 + "px";
                    pTar.width = pTar.Document.body.scrollWidth + "px";
                }
                console.log("ie");
            }
            if (Sys.firefox) {
                pTar.height = pTar.contentDocument.body.offsetHeight + 15 + "px";
                pTar.width = pTar.contentDocument.body.scrollWidth + "px";
                console.log("firefox");
            }
            if (Sys.chrome) {
                pTar.height = pTar.contentDocument.body.offsetHeight;
                pTar.width = pTar.contentDocument.body.scrollWidth;
                console.log("chrome");
            }
            if (Sys.opera) {
                pTar.height = pTar.contentDocument.body.offsetHeight;
                pTar.width = pTar.contentDocument.body.scrollWidth;
                console.log("opera");
            }
            if (Sys.safari) {
                console.log(window.innerHeight);
                pTar.height = window.innerHeight;
                pTar.width = pTar.contentDocument.body.scrollWidth;
                console.log("safari");
            }
        },

        reinitIframe: function () {
            var iframe = document.getElementById("iFrame");
            iframe.height = 2000;
            console.log(iframe);
            try {
                var bHeight = iframe.contentWindow.document.body.scrollHeight;
                var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
                var height = Math.max(bHeight, dHeight);
                iframe.height = height;
                console.log(iframe.height);
            } catch (ex) {
                console.log(ex);
                console.log(iframe.height);
            }
        },

        handleCommentSubmit: function (comment) {
            var comments = this.state.data;
            comment.id = Date.now();
            var newComments = comments.concat([comment]);
            this.setState({data: newComments});
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                type: 'POST',
                data: comment,
                success: function (data) {
                    this.setState({data: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    this.setState({data: comments});
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
        ,
        getInitialState: function () {
            return {data: []};
        }
        ,
        componentDidMount: function () {
            this.getUrlParam();
            this.loadCommentsFromServer();
            this.reinitIframe();
            //setInterval(this.reinitIframe, 2000);
        },
        render: function () {
            return (
                <div className="commentBox">
                    <div className="commentLine"/>
                    <span className="commentHead">评论: {this.state.data.commentCount}</span>

                    <div className="commentLine"/>

                    <div className="commentHead_1"></div>
                    <CommentList data={this.state.data}/>
                    <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                    <span className="commentFoot"></span>
                </div>
            );
        }
    })
    ;

var CommentList = React.createClass({
    render: function () {
        if (!this.props.data.comments) {
            return null;
        }
        var commentNodes = this.props.data.comments.map(function (comment, index) {
            return (
                <Comment key={comment.id} comment={comment}/>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function () {
        return {author: '', text: ''};
    },
    handleAuthorChange: function (e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    },
    render: function () {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                    />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                    />
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

ReactDOM.render(
    <CommentBox />,
    document.getElementById('content')
);
