'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var $ = require('jquery');
var _ = require('lodash');

var DOMEventListener = require('./DOMEventListener');

var items = require('./items.json');



var Application = React.createClass({
    getInitialState: function() {
        return {
            items: _.sortBy(items, function(item) {
                return Number(item.price);
            }),
            currentIndex: Number(window.localStorage.currentIndex || '0'),
            likes: JSON.parse(window.localStorage.likes || '[]'),
            lastAction: 'down'
        };
    },

    componentDidMount: function() {
        DOMEventListener.listen(
          document, 'keyup', this.handleDocumentKeyUp
        );
    },

    handleDocumentKeyUp: function(event) {
        switch (event.keyCode) {
          case 38: // Arrow up
            this.setState({
                lastAction: 'up'
            });

            this.prev();
            break;

          case 40: // Arrow down
            this.setState({
                lastAction: 'down'
            });

            this.next();
            break;

          case 39: // Arrow right
            this.setState({
                lastAction: 'right'
            });

            this.like();
            break;

          case 37: // Arrow left
            this.setState({
              lastAction: 'left'
            });

            this.dislike();
            break;
        }
    },

    dislike: function() {
        var that = this;

        this.setState({
            likes: _.filter(this.state.likes, function(like) {
                return like.link !== that.state.items[that.state.currentIndex].link;
            })
        });

        window.localStorage.likes = JSON.stringify(this.state.likes);

        this.next();
    },

    like: function() {
        this.setState({
            likes: _.uniq(
                this.state.likes.concat([
                    this.state.items[this.state.currentIndex]
                ]),
                function(item) {
                    return item.link;
                }
            )
        });

        window.localStorage.likes = JSON.stringify(this.state.likes);

        this.next();
    },

    prev: function() {
        this.setState({
            currentIndex: this.state.currentIndex - 1
        });

        window.localStorage.currentIndex = this.state.currentIndex;
    },

    next: function() {
        this.setState({
            currentIndex: this.state.currentIndex + 1
        });

        window.localStorage.currentIndex = this.state.currentIndex;
    },

    render: function() {
        var item = this.state.items[this.state.currentIndex];
        var $item;

        if (item) {
            $item = (
                <div className="item" key={item.link}>
                    <img src={item.img} />

                    <div className="item-text">
                        <br/>
                        <br/>
                        {item.price}
                        <br/>
                        <br/>
                        {item.name}
                        <br/>
                        <br/>
                        <b>{item.length}cm</b> bei Größe {item.size} (+{item.length - 73}cm)
                    </div>
                </div>
            );
        }

        var that = this;

        var $likes = this.state.likes.map(function(item) {
            var goToItem = function() {
                that.setState({
                    lastAction: 'down',
                    currentIndex: _.findIndex(
                        that.state.items,
                        {link: item.link}
                    )
                });
            };

            return (
                <div key={'like' + item.link} className="like">
                    <img src={item.img} onClick={goToItem} />
                    <a key={'like' + item.link} href={item.link} target="_blank">
                        Link
                    </a>
                </div>
            );
        });

        var transition = 's-move-' + this.state.lastAction + '-';

        return (
            <div>
                <div className="page">
                    {this.state.currentIndex + 1}/{this.state.items.length}
                </div>

                <div className="item-wrapper">
                    <ReactCSSTransitionGroup transitionName={transition}>
                        {$item}
                    </ReactCSSTransitionGroup>
                </div>

                <div className="likes-wrapper">
                    <div className="likes">
                        {$likes}
                    </div>
                </div>
            </div>
        );
    }
});


React.render(
    <Application />,
    document.getElementById('container')
);
