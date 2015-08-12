/* global aloha, require, module */
'use strict';

var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            editable: null
        };
    },
    componentDidMount: function () {
        var element = React.findDOMNode(this.refs.content);
        this.setState({
            editable: aloha(element)
        });
    },
    toggleBold: function (event) {
        console.log(event.type);
        aloha.ui.command([this.state.editable], aloha.ui.commands.bold);
        console.log(aloha.ui.states(aloha.ui.commands, event));
    },
    toggleItalic: function () {
        aloha.ui.command(this.state.editable, aloha.ui.commands.italic);
    },
    toggleUnderline: function () {
        aloha.ui.command(aloha.ui.commands.underline, this.state.editable);
    },
    unformat: function () {
        aloha.ui.command(aloha.ui.commands.unformat, this.state.editable);
    },
    render: function () {
        return (
            /*jshint ignore:start */
            <div>
                <div className="aloha" ref="content"
                     dangerouslySetInnerHTML={{__html: this.props.content}}>
                </div>
                <div ref="toolbar" className={this.state.editable ? '': ' hidden'}>
                    <button className="btn btn-default action-bold"
                            ref="toolbarBold"
                            onClick={this.toggleBold}>B
                    </button>
                    <button className="btn btn-default action-italic"
                            ref="toolbarItalic"
                            onClick={this.toggleItalic}>I
                    </button>
                    <button className="btn btn-default action-underline"
                            onClick={this.toggleUnderline}>U
                    </button>
                    <button className="btn btn-default action-unformat"
                            onClick={this.unformat}>✘
                    </button>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }
});
